import { Client, middleware, WebhookEvent } from '@line/bot-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'

import { shuffle } from '../../../util/array'

const API_BEAUTIES = process.env.API_BEAUTIES

const botConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const client = new Client(botConfig)
const lineMiddleware = middleware(botConfig)

// https://nextjs.org/docs/api-routes/api-middlewares
// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(404).json({
      statusCode: 404,
      message: 'Not Found'
    })
  }

  await runMiddleware(req, res, lineMiddleware)
  Promise.all(
    req.body.events.map(async (event: WebhookEvent) => {
      if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null)
      }
      if (event.message.text === '/test') {
        const { beauties } = await fetch(API_BEAUTIES).then((resp) => resp.json())
        const shuffledBeauties = shuffle(beauties)
        const candidates = shuffledBeauties.slice(0, 2)
        console.log(candidates)
        const candidateIds = candidates.map((candidate) => candidate.id).join(',')
        return client.replyMessage(event.replyToken, {
          type: 'template',
          altText: 'beauty-pageant',
          template: {
            type: 'image_carousel',
            columns: candidates.map((candidate) => {
              return {
                imageUrl: candidate.images[0],
                action: {
                  type: 'postback',
                  label: `@${candidate.instagram}`,
                  data: `action=beauty-pageant&match=${candidateIds}&win=${candidate.id}`
                }
              }
            })
          }
        })
      } else {
        return Promise.resolve(null)
      }
    })
  ).then((result) => res.json(result))
}

// https://line.github.io/line-bot-sdk-nodejs/api-reference/middleware.html#usage
// https://nextjs.org/docs/api-routes/api-middlewares
export const config = {
  api: {
    bodyParser: false
  }
}

export default handler
