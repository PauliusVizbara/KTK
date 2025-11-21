import puppeteer from 'puppeteer'

const BASE_URL = 'https://www.warhammer-community.com/en-gb/downloads/kill-team/'
const HEADERS = {
  // Note: User-Agent is less critical with node-fetch than with axios in some environments,
  // but it's good practice to keep it.
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
}

async function getPdfLinks(url: string) {
  console.log(`1. Fetching dynamic page content using Puppeteer: ${url}`)
  let browser
  try {
    // Launch a headless browser
    browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Go to the URL and wait for the network activity to calm down
    await page.goto(url, {waitUntil: 'networkidle2'})

    // --- Critical Step: Extracting Links from the Rendered DOM ---

    // Use page.evaluate to run code in the context of the browser window.
    const pdfLinks = await page.evaluate(() => {
      const allElements = Array.from(document.body.getElementsByTagName('*'))

      // Helper to find an element by text content
      const findElementByText = (text: string) => {
        return allElements.find((el) => el.textContent?.trim().toLowerCase() === text.toLowerCase())
      }

      const startElement = findElementByText('Team Rules')
      const endElement = findElementByText('Mission packs')

      if (!startElement || !endElement) {
        console.log('Start or end element not found', {start: !!startElement, end: !!endElement})
        return []
      }

      const links = new Set<string>()
      let isBetween = false

      // Iterate through all elements in document order
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
          if (href) {
            links.add(href)
          }
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
    // Always close the browser, even if an error occurred
    if (browser) {
      await browser.close()
    }
  }
}

export async function GET() {
  const pdfLinks = await getPdfLinks(BASE_URL)
  return Response.json(pdfLinks)
}
