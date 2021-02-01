import { Redis } from '@nano-sql/adapter-redis'
import { nSQL } from '@nano-sql/core'

const connectMiddleware = (handler) => async (req, res) => {
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

const listBeauty = async (req, res) => {
  const {
    query: { id = '' }
  } = req
  const response = await nSQL('beauties').query('select').where(['id', '=', id]).exec()
  const beauty = response[0]
  if (beauty) {
    console.log('listBeauty beauty', beauty.instagram)
    res.json({ beauty })
  } else {
    return res.status(404).json({
      statusCode: 404,
      message: 'Not Found'
    })
  }
}

const handler = (req, res) => {
  switch (req.method) {
    case 'GET':
      return listBeauty(req, res)
    default:
      return res.status(404).json({
        statusCode: 404,
        message: 'Not Found'
      })
  }
}

export default connectMiddleware(handler)
