import 'pdf-parse/worker' // Import this before importing "pdf-parse"
import {PDFParse} from 'pdf-parse'
import puppeteer from 'puppeteer'
import OpenAI from 'openai'
import {z} from 'zod'
import {zodResponseFormat} from 'openai/helpers/zod'

const BASE_URL = 'https://www.warhammer-community.com/en-gb/downloads/kill-team/'
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
}

import {uuid} from '@sanity/uuid'
import {serverClient} from '@/sanity/client'

// Initialize OpenAI
const openai = new OpenAI()

function stringToBlock(text: string) {
  return [
    {
      _type: 'block',
      _key: uuid(),
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: uuid(),
          text: text,
          marks: [],
        },
      ],
      markDefs: [],
    },
  ]
}

function stringToSectionBlock(text: string) {
  return [
    {
      _type: 'section',
      _key: uuid(),
      content: stringToBlock(text),
    },
  ]
}

// Define the schema for the extracted data
const EquipmentSchema = z.object({
  name: z.string(),
  amount: z.number(),
  description: z.string(),
  weapon: z
    .object({
      name: z.string(),
      type: z.enum(['ranged', 'melee']),
      atk: z.number(),
      hit: z.number(),
      damageNormal: z.number(),
      damageCritical: z.number(),
      rules: z.string(),
    })
    .nullable(),
  action: z
    .object({
      name: z.string(),
      apCost: z.number(),
      description: z.string(),
      limitations: z.string().nullable(),
    })
    .nullable(),
})

const ExtractionSchema = z.object({
  equipment: z.array(EquipmentSchema),
})

async function getPdfLinks(url: string) {
  console.log(`1. Fetching dynamic page content using Puppeteer: ${url}`)
  let browser
  try {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url, {waitUntil: 'networkidle2'})

    const pdfLinks = await page.evaluate(() => {
      const allElements = Array.from(document.body.getElementsByTagName('*'))
      const findElementByText = (text: string) => {
        return allElements.find((el) => el.textContent?.trim().toLowerCase() === text.toLowerCase())
      }

      // Look for "Universal Equipment" anchor
      const universalEquipmentElement = findElementByText('Universal Equipment')

      if (!universalEquipmentElement) return []

      // Find the closest parent that might contain the PDF link
      let currentElement = universalEquipmentElement
      const links = new Set<string>()

      // Search in the next few siblings for PDF links
      for (let i = 0; i < 10 && currentElement; i++) {
        const anchors = currentElement.getElementsByTagName('a')
        for (const anchor of Array.from(anchors)) {
          const href = (anchor as HTMLAnchorElement).href
          if (href && href.toLowerCase().includes('.pdf')) {
            links.add(href)
          }
        }
        currentElement = currentElement.nextElementSibling as HTMLElement
        if (!currentElement) break
      }

      return Array.from(links)
    })

    console.log(`   Found ${pdfLinks.length} PDF link(s) for Universal Equipment.`)
    return pdfLinks
  } catch (error: any) {
    console.error(`Error with Puppeteer: ${error.message}`)
    return []
  } finally {
    if (browser) await browser.close()
  }
}

async function extractTextFromPdf(url: string): Promise<string> {
  console.log(`Downloading PDF: ${url}`)
  const response = await fetch(url, {headers: HEADERS})
  if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.statusText}`)

  const buffer = await response.arrayBuffer()
  const parser = new PDFParse({data: buffer})

  const result = await parser.getText()
  return result.text
}

async function extractEquipmentFromText(text: string) {
  console.log('Sending text to OpenAI for extraction...')

  const keyword = 'UNIVERSAL EQUIPMENT'
  const index = text.indexOf(keyword)
  const relevantText = index !== -1 ? text.substring(index) : text.substring(0, 20000)

  const completion = await openai.chat.completions.parse({
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: 'system',
        content: `You are a helper that extracts structured data from Warhammer Kill Team PDF text.

Find all UNIVERSAL EQUIPMENT cards. Each card has this structure:
1. NAME (in all caps at the top)
2. AMOUNT (number of items), found as prefix before name
3. LORE (italic/flavour text paragraph - this is narrative/story text, NOT game rules)
4. DESCRIPTION (game rules text - starts with phrases like "Once per turning point", "When", "Each time", etc.)

CRITICAL: The lore and description are SEPARATE fields. Do NOT combine them.
- LORE = The italic narrative text that describes what the equipment is thematically
- DESCRIPTION = The actual game mechanics and rules for how to use it. Remove random newlines - only keep newlines when there are bullet points or list items.

For each equipment, also extract:
- Weapon (if present): name, type ("ranged" or "melee"), attacks, hit, damage (normal/critical separated by slash), rules
- Action (if present): name, AP cost, description, limitations

Do not trim anything from the text. Keep all game terms like "strategic gambit" intact.`,
      },
      {role: 'user', content: relevantText},
    ],
    response_format: zodResponseFormat(ExtractionSchema, 'extraction'),
  })

  return completion.choices[0].message.parsed
}

export async function GET() {
  try {
    const pdfLinks = await getPdfLinks(BASE_URL)

    if (pdfLinks.length === 0) {
      return Response.json({message: 'No Universal Equipment PDF found'})
    }

    const results = {
      total: pdfLinks.length,
      successful: [] as string[],
      failed: [] as {equipment: string; error: string}[],
    }

    // Process each PDF (should typically be just one for Universal Equipment)
    for (const pdfUrl of pdfLinks) {
      try {
        console.log(`\n--- Processing: ${pdfUrl} ---`)
        const text = await extractTextFromPdf(pdfUrl)
        const extractedData = await extractEquipmentFromText(text)

        if (!extractedData || !extractedData.equipment) {
          results.failed.push({equipment: pdfUrl, error: 'Failed to extract data'})
          continue
        }

        console.log(`Found ${extractedData.equipment.length} equipment items`)

        // Create individual universalEquipment documents for each equipment item
        for (const item of extractedData.equipment) {
          try {
            const equipmentData = {
              _type: 'equipment',
              _key: uuid(),
              name: item.name,
              description: item.description,
              weapon: item.weapon
                ? {
                    ...item.weapon,
                    _type: 'weapon',
                  }
                : undefined,
              action: item.action
                ? {
                    _type: 'action',
                    name: item.action.name,
                    apCost: item.action.apCost,
                    description: stringToSectionBlock(item.action.description),
                    limitations: item.action.limitations
                      ? stringToBlock(item.action.limitations)
                      : undefined,
                  }
                : undefined,
            }

            // Check if equipment already exists by name
            const existingEquipment = await serverClient.fetch(
              `*[_type == "universalEquipment" && equipment.name == $name][0]`,
              {
                name: item.name,
              },
            )

            let result
            if (existingEquipment) {
              // Update existing equipment
              result = await serverClient
                .patch(existingEquipment._id)
                .set({equipment: equipmentData, amount: item.amount})
                .commit()
              console.log(`✓ Updated existing equipment: ${item.name}`)
            } else {
              // Create new equipment document
              const doc = {
                _type: 'universalEquipment',
                equipment: equipmentData,
                amount: item.amount,
              }
              result = await serverClient.create(doc)
              console.log(`✓ Created new equipment: ${item.name}`)
            }

            results.successful.push(item.name)
          } catch (error: any) {
            console.error(`✗ Error processing equipment ${item.name}:`, error.message)
            results.failed.push({equipment: item.name, error: error.message})
          }
        }
      } catch (error: any) {
        console.error(`✗ Error processing PDF ${pdfUrl}:`, error.message)
        results.failed.push({equipment: pdfUrl, error: error.message})
      }
    }

    console.log(`\n=== Import Complete ===`)
    console.log(`Total PDFs: ${results.total}`)
    console.log(`Successful: ${results.successful.length}`)
    console.log(`Failed: ${results.failed.length}`)

    return Response.json({
      message: 'Import complete',
      results,
    })
  } catch (error: any) {
    console.error('Error in sync route:', error)
    return Response.json({error: error.message}, {status: 500})
  }
}
