import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import puppeteer, { Page } from 'puppeteer'

const SNAPSHOT_PATH = path.join(__dirname, '../../..', 'public/snapshot.png')
console.log(SNAPSHOT_PATH)

const IG_LOGIN_URL = 'https://www.instagram.com/accounts/login/'
const IG_URL = 'https://www.instagram.com/'
const IG = {
  acc: process.env.IG_ACC,
  pwd: process.env.IG_PWD
}

const loginIg = async (page: Page) => {
  await page.goto(IG_LOGIN_URL, {
    waitUntil: ['load', 'networkidle0', 'domcontentloaded']
  })
  await page.focus('input[name=username]')
  await page.keyboard.type(IG.acc)
  await page.focus('input[name=password]')
  await page.keyboard.type(IG.pwd)
  await page.keyboard.press('Enter')
  await page.waitForTimeout(3000)
}

const scrapeBeautyPostIds = async (page: Page, targetUrl: string): Promise<string[]> => {
  await page.goto(targetUrl, {
    waitUntil: ['load', 'networkidle0', 'domcontentloaded']
  })

  const postIds = await page.evaluate(() => {
    const ids = []
    const aElements = document.querySelectorAll('[href^="/p/"]')
    const idPattern = /\/p\/(.*)\//
    aElements.forEach((aElement) => {
      const href = aElement.getAttribute('href')
      const found = href.match(idPattern)
      if (found) {
        ids.push(found[1])
      }
    })
    return ids
  })
  return postIds
}

const scrapeBeautiesInfo = async (page: Page, postIds: string[]) => {
  const beauties = []
  for (const postId of postIds) {
    const postUrl = `${IG_URL}p/${postId}/`
    await page.goto(postUrl, {
      waitUntil: ['load', 'networkidle0', 'domcontentloaded']
    })
    const beauty = await page.evaluate(() => {
      const info = { id: '', instagram: '', images: [] }
      let found = null

      // scrape image
      const imgPattern = /750w,(.*) 1080w/
      const srcSet = document.querySelector('article div > img').getAttribute('srcset')
      found = srcSet.match(imgPattern)
      if (found) {
        info.images.push(found[1])
      }

      // scrape IG id
      const igIdPattern = /^@(.*)/
      const aTags = document.querySelectorAll('article [role=menuitem] h2 + span a')
      aTags.forEach((aTag) => {
        found = aTag.innerHTML.match(igIdPattern)
        if (found) {
          info.instagram = found[1]
        }
      })
      return info
    })
    if (beauty.instagram !== '') {
      beauty.id = postId
      beauties.push(beauty)
    }
  }
  return beauties
}

const scrapeIg = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id = 'timliaoig.beauty' }
  } = req

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: false // this fix the error of ig login, but only works in local
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })

  // login
  try {
    await loginIg(page)
  } catch (error) {
    await page.screenshot({ path: SNAPSHOT_PATH })
    return res.status(500).json({
      statusCode: 500,
      message: 'Login IG failed'
    })
  }

  // scrape beauty post ids
  const targetUrl = `${IG_URL}${id}`
  let postIds = []
  try {
    postIds = await scrapeBeautyPostIds(page, targetUrl)
  } catch (error) {
    await page.screenshot({ path: SNAPSHOT_PATH })
    return res.status(500).json({
      statusCode: 500,
      message: 'Scrape beauty post ids failed'
    })
  }

  // scrape beauties information
  try {
    const beauties = await scrapeBeautiesInfo(page, postIds)
    return res.json({ beauties })
  } catch (error) {
    await page.screenshot({ path: SNAPSHOT_PATH })
    return res.status(500).json({
      statusCode: 500,
      message: 'Scrape beauties information failed'
    })
  }
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({
      statusCode: 403,
      message: 'Forbidden'
    })
  }

  switch (req.method) {
    case 'GET':
      return scrapeIg(req, res)
    default:
      return res.status(404).json({
        statusCode: 404,
        message: 'Not Found'
      })
  }
}

export default handler
