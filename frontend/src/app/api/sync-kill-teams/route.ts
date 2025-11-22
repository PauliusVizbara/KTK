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
  description: z.string(),
  weapons: z
    .array(
      z.object({
        name: z.string(),
        type: z.enum(['ranged', 'melee']),
        atk: z.number(),
        hit: z.number(),
        damageNormal: z.number(),
        damageCritical: z.number(),
        rules: z.string(),
      }),
    )
    .nullable(),
  actions: z
    .array(
      z.object({
        name: z.string(),
        apCost: z.number(),
        description: z.string(),
        limitations: z.string().nullable(),
      }),
    )
    .nullable(),
})

const ExtractionSchema = z.object({
  teamName: z.string(),
  operativeCount: z.number(),
  factionEquipment: z.array(EquipmentSchema),
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

      const startElement = findElementByText('Team Rules')
      const endElement = findElementByText('Mission packs')

      if (!startElement || !endElement) return []

      const links = new Set<string>()
      let isBetween = false

      for (const el of allElements) {
        if (el === startElement) {
          isBetween = true
          continue
        }
        if (el === endElement) {
          isBetween = false
          break
        }

        if (isBetween && el.tagName === 'A') {
          const href = (el as HTMLAnchorElement).href
          if (href) links.add(href)
        }
      }
      return Array.from(links)
    })

    console.log(`   Found ${pdfLinks.length} unique links between sections.`)
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

  const keyword = 'FACTION EQUIPMENT'
  const index = text.indexOf(keyword)
  const relevantText = index !== -1 ? text.substring(index) : text.substring(0, 20000)

  const completion = await openai.chat.completions.parse({
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: 'system',
        content: `You are a helper that extracts structured data from Warhammer Kill Team PDF text.

First, identify the team name from the document header/title.

Then, calculate the TOTAL OPERATIVE COUNT for the kill team.
- Look for the "OPERATIVES" section.
- It will list requirements like "1 LEADER", "1 DRONE", "9 OPERATIVES selected from...".
- Sum these numbers to get the total count (e.g., 1 + 1 + 9 = 11).
- If it says "consists of X operatives", use that number.

Then find the 4 FACTION EQUIPMENT cards. Each card has this structure:
1. NAME (in all caps at the top)
2. LORE (italic/flavour text paragraph - this is narrative/story text, NOT game rules)
3. DESCRIPTION (game rules text - starts with phrases like "Once per turning point", "When", "Each time", etc.)

CRITICAL: The lore and description are SEPARATE fields. Do NOT combine them.
- LORE = The italic narrative text that describes what the equipment is thematically
- DESCRIPTION = The actual game mechanics and rules for how to use it. Remove random newlines - only keep newlines when there are bullet points or list items.

For each equipment, also extract:
- Weapons (list, if present): name, type ("ranged" or "melee"), attacks, hit, damage (normal/critical separated by slash), rules
- Actions (list, if present): name, AP cost, description, limitations

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
    // const pdfLinks = [
    //   'https://assets.warhammer-community.com/eng_29-10_kill_team_team_rules_legionaries-e5hsbsasn6-l5akyfyeyu.pdf',
    // ]
    if (pdfLinks.length === 0) {
      return Response.json({message: 'No PDFs found'})
    }

    const results = {
      total: pdfLinks.length,
      successful: [] as string[],
      failed: [] as {team: string; error: string}[],
    }

    // Process each PDF
    for (const pdfUrl of pdfLinks) {
      try {
        console.log(`\n--- Processing: ${pdfUrl} ---`)
        const text = await extractTextFromPdf(pdfUrl)
        const extractedData = await extractEquipmentFromText(text)

        if (!extractedData) {
          results.failed.push({team: pdfUrl, error: 'Failed to extract data'})
          continue
        }

        const teamName = extractedData.teamName
        const operativeCount = extractedData.operativeCount
        console.log(`Team name: ${teamName}, Operatives: ${operativeCount}`)

        const equipmentList = extractedData.factionEquipment.map((item: any) => ({
          _type: 'equipment',
          _key: uuid(),
          name: item.name,
          description: item.description,
          weapons: item.weapons?.map((weapon: any) => ({
            ...weapon,
            _type: 'weapon',
            _key: uuid(),
          })),
          actions: item.actions?.map((action: any) => ({
            _type: 'action',
            _key: uuid(),
            name: action.name,
            apCost: action.apCost,
            description: stringToSectionBlock(action.description),
            limitations: action.limitations ? stringToBlock(action.limitations) : undefined,
          })),
        }))

        // Check if team already exists
        const existingTeam = await serverClient.fetch(`*[_type == "team" && name == $name][0]`, {
          name: teamName,
        })

        let result
        if (existingTeam) {
          // Update existing team
          result = await serverClient
            .patch(existingTeam._id)
            .set({equipment: equipmentList, operativeCount: operativeCount})
            .commit()
          console.log(`✓ Updated existing team: ${teamName}`)
        } else {
          // Create new team
          const doc = {
            _type: 'team',
            name: teamName,
            operativeCount: operativeCount,
            equipment: equipmentList,
          }
          result = await serverClient.create(doc)
          console.log(`✓ Created new team: ${teamName}`)
        }

        results.successful.push(teamName)
      } catch (error: any) {
        console.error(`✗ Error processing PDF ${pdfUrl}:`, error.message)
        results.failed.push({team: pdfUrl, error: error.message})
      }
    }

    console.log(`\n=== Import Complete ===`)
    console.log(`Total: ${results.total}`)
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
