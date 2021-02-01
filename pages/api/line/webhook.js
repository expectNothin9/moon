import { Client, middleware } from '@line/bot-sdk'
import querystring from 'querystring'

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
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(404).json({
      statusCode: 404,
      message: 'Not Found'
    })
  }

  await runMiddleware(req, res, lineMiddleware)
  Promise.all(
    req.body.events.map(async (event) => {
      switch (event.type) {
        case 'message': {
          if (event.message.type !== 'text') {
            return Promise.resolve(null)
          }
          if (event.message.text === '/test') {
            const { beauties } = await fetch(API_BEAUTIES).then((resp) => resp.json())
            const shuffledBeauties = shuffle(beauties)
            const candidates = shuffledBeauties.slice(0, 2)
            console.log(candidates)
            const candidateIds = candidates.map((candidate) => candidate.id).join(',')
            return client
              .replyMessage(event.replyToken, {
                type: 'template',
                altText: 'beauty-pageant',
                template: {
                  type: 'image_carousel',
                  columns: candidates.map((candidate) => {
                    // TODO: implement mask logic
                    const maskedIgId = `@${candidate.instagram}`.slice(0, 12)
                    return {
                      imageUrl: candidate.images[0],
                      action: {
                        type: 'postback',
                        label: maskedIgId,
                        data: `action=beauty-pageant&match=${candidateIds}&win=${candidate.id}`
                      }
                    }
                  })
                }
              })
              .catch((error) => {
                console.log(error)
                return null
              })
          } else {
            return Promise.resolve(null)
          }
        }
        case 'postback': {
          console.log('postbak event', event)
          const {
            source,
            postback: { data }
          } = event
          const parsedData = querystring.parse(data)
          const [userProfile, apiResp] = await Promise.all([
            client.getProfile(source.userId),
            fetch(`${API_BEAUTIES}/${parsedData.win}`).then((resp) => resp.json())
          ])
          console.log(userProfile, apiResp)
          return client.replyMessage(event.replyToken, {
            type: 'text',
            text: `${userProfile.displayName} ♡ https://instagr.am/${apiResp.beauty.instagram}`
          })
        }
        default:
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
