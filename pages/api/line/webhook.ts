import { Client, middleware, WebhookEvent } from '@line/bot-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}

const client = new Client(config)
const lineMiddleware = middleware(config)

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
  await runMiddleware(req, res, lineMiddleware)
  Promise.all(
    req.body.events.map(async (event: WebhookEvent) => {
      if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null)
      }
      if (event.message.text === '/test') {
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'test?'
        })
      } else {
        return Promise.resolve(null)
      }
    })
  ).then((result) => res.json(result))
}

export default handler
