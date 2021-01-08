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
        // const candidateIds = candidates.map((candidate) => candidate.id).join(',')
        return client
          .replyMessage(event.replyToken, {
            type: 'template',
            altText: 'beauty-pageant',
            template: {
              type: 'image_carousel',
              columns: [
                // {
                //   imageUrl:
                //     'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/fr/e15/s1080x1080/133852809_823622258485938_371339567555113004_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=DCCtHKKQEiYAX9rKPLN&tp=1&oh=085e665b0c878818efd3696c9ad9f599&oe=6020A3BB',
                //   action: {
                //     type: 'postback',
                //     label: '@nicalin0707',
                //     data: 'action=beauty-pageant&match=CJm99Punf5R,CIn0VcmH-eT&win=CJm99Punf5R'
                //   }
                // },
                {
                  imageUrl:
                    'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/130117511_174890051048164_3725753661346970517_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=lfmGLfe_FqgAX8NnaKb&tp=1&oh=153f8c2fdc4588a50a97d03d9a6d375a&oe=6022FC4E',
                  action: {
                    type: 'postback',
                    label: '@kristina6.23',
                    data: 'action=beauty-pageant&match=CJm99Punf5R,CIn0VcmH-eT&win=CIn0VcmH-eT'
                  }
                }
              ]
              // columns: candidates.map((candidate) => {
              //   return {
              //     imageUrl: candidate.images[0],
              //     action: {
              //       type: 'postback',
              //       label: `@${candidate.instagram}`,
              //       data: `action=beauty-pageant&match=${candidateIds}&win=${candidate.id}`
              //     }
              //   }
              // })
            }
          })
          .catch((error) => {
            console.log(error)
            return null
          })
      } else if (event.message.text === '/test1') {
        return client
          .replyMessage(event.replyToken, {
            type: 'template',
            altText: 'beauty-pageant',
            template: {
              type: 'image_carousel',
              columns: [
                {
                  imageUrl:
                    'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/fr/e15/s1080x1080/133852809_823622258485938_371339567555113004_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=DCCtHKKQEiYAX9rKPLN&tp=1&oh=085e665b0c878818efd3696c9ad9f599&oe=6020A3BB',
                  action: {
                    type: 'postback',
                    label: '@nicalin0707',
                    data: 'action=beauty-pageant&match=CJm99Punf5R,CIn0VcmH-eT&win=CJm99Punf5R'
                  }
                }
              ]
            }
          })
          .catch((error) => {
            console.log(error)
            return null
          })
      } else if (event.message.text === '/test2') {
        return client
          .replyMessage(event.replyToken, {
            type: 'template',
            altText: 'beauty-pageant',
            template: {
              type: 'image_carousel',
              columns: [
                {
                  imageUrl:
                    'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/129745327_665427261003150_1268165138661069468_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=sAKnMsQHPsQAX-mWsuK&tp=1&oh=773dc84cd3a4a6438740285a631b2fc7&oe=6020C9E6',
                  action: {
                    type: 'postback',
                    label: '@nicalin0707',
                    data: 'action=beauty-pageant&match=CJm99Punf5R,CIn0VcmH-eT&win=CJm99Punf5R'
                  }
                }
              ]
            }
          })
          .catch((error) => {
            console.log(error)
            return null
          })
      } else if (event.message.text === '/test3') {
        return client
          .replyMessage(event.replyToken, {
            type: 'template',
            altText: 'beauty-pageant',
            template: {
              type: 'image_carousel',
              columns: [
                {
                  imageUrl:
                    'https://instagram.ftpe12-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/129745327_665427261003150_1268165138661069468_n.jpg?_nc_ht=instagram.ftpe12-1.fna.fbcdn.net&_nc_cat=106&_nc_ohc=sAKnMsQHPsQAX-mWsuK&tp=1&oh=773dc84cd3a4a6438740285a631b2fc7&oe=6020C9E6',
                  action: {
                    type: 'postback',
                    label: '@u_ting221',
                    data: 'action=beauty-pageant&match=CIj9aUrnzos,CIzcbLUHhF9&win=CIj9aUrnzos'
                  }
                }
              ]
            }
          })
          .catch((error) => {
            console.log(error)
            return null
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
