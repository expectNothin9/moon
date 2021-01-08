import { Redis } from '@nano-sql/adapter-redis'
import { nSQL } from '@nano-sql/core'
import type { NextApiRequest, NextApiResponse } from 'next'

import dummyData from '../../dummy/beauties'

const connectMiddleware = (handler) => async (req: NextApiRequest, res: NextApiResponse) => {
  const dbName = 'moon'

  if (!nSQL().listDatabases().includes(dbName)) {
    await nSQL().createDatabase({
      id: dbName,
      mode: new Redis({ url: process.env.REDIS_URL }),
      tables: [
        {
          name: 'beauties',
          model: {
            'id:string': { pk: true },
            'instagram:string': { notNull: true },
            'images:string[]': { notNull: true }
          }
        }
      ],
      version: 1
    })
  }
  nSQL().useDatabase(dbName)

  return handler(req, res)
}

const saveBeauties = async (_: NextApiRequest, res: NextApiResponse) => {
  const data = dummyData.beauties
  const beauties = await nSQL('beauties').query('upsert', data).exec()
  res.status(201).json({ beauties })
}

const listBeauties = async (_: NextApiRequest, res: NextApiResponse) => {
  const beauties = await nSQL('beauties').query('select').exec()
  console.log(
    'listBeauties beauties',
    beauties.map((beauty) => beauty.instagram)
  )
  res.json({ beauties })
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      return saveBeauties(req, res)
    case 'GET':
      return listBeauties(req, res)
    default:
      return res.status(404).json({
        statusCode: 404,
        message: 'Not Found'
      })
  }
}

export default connectMiddleware(handler)
