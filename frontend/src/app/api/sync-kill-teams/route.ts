import puppeteer from 'puppeteer'
import OpenAI from 'openai'
import {z} from 'zod'
import {zodResponseFormat} from 'openai/helpers/zod'

// Polyfill DOMMatrix for pdf-parse
if (typeof DOMMatrix === 'undefined') {
  // @ts-ignore
  global.DOMMatrix = class DOMMatrix {
    constructor() {}
  }
}

// @ts-ignore
const pdf = require('pdf-parse/lib/pdf-parse.js')

const BASE_URL = 'https://www.warhammer-community.com/en-gb/downloads/kill-team/'
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
}

import {client} from '@/sanity/client'
import {uuid} from '@sanity/uuid'

// Initialize OpenAI
const openai = new OpenAI()

function stringToSectionBlock(text: string) {
  return [
    {
      _type: 'section',
      _key: uuid(),
      content: [
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
      ],
    },
  ]
}

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
  const data = await pdf(Buffer.from(buffer))
  return data.text
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
        content:
          'You are a helper that extracts structured data from Warhammer Kill Team PDF text. Find the 4 FACTION EQUIPMENT cards. Extract their names, descriptions, and any weapon (singular) or action (singular) associated with them. For weapons, determine if it is "ranged" or "melee". Weapon stat consists of name, attacks, hit, damage and critical damage. Damage and critical damage are separated by a slash. AP cost should be a number. Extract any limitations for actions if present.',
      },
      {role: 'user', content: relevantText},
    ],
    response_format: zodResponseFormat(ExtractionSchema, 'extraction'),
  })

  return completion.choices[0].message.parsed
}

export async function GET() {
  try {
    // const pdfLinks = await getPdfLinks(BASE_URL)
    const pdfLinks = [
      'https://assets.warhammer-community.com/eng_29-10_kill_team_team_rules_legionaries-e5hsbsasn6-l5akyfyeyu.pdf',
    ]
    if (pdfLinks.length === 0) {
      return Response.json({message: 'No PDFs found'})
    }

    const firstPdfUrl = pdfLinks[0]
    const text = await extractTextFromPdf(firstPdfUrl)
    const extractedData = await extractEquipmentFromText(text)

    if (!extractedData) {
      return Response.json({error: 'Failed to extract data'}, {status: 500})
    }

    const equipmentList = extractedData.factionEquipment.map((item) => ({
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
    }))

    const doc = {
      _type: 'team',
      name: 'Legionaries',
      equipment: equipmentList,
    }

    const result = await client.create(doc)

    return Response.json({
      url: firstPdfUrl,
      data: extractedData,
      sanityResult: result,
    })
  } catch (error: any) {
    console.error('Error in sync route:', error)
    return Response.json({error: error.message}, {status: 500})
  }
}
