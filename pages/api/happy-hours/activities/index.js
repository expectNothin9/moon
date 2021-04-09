import { Redis } from '@nano-sql/adapter-redis'
import { nSQL } from '@nano-sql/core'

// import dummyData from '../../../dummy/happyHoursActivities'

const connectMiddleware = (handler) => async (req, res) => {
  const dbName = 'moon'

  if (!nSQL().listDatabases().includes(dbName)) {
    await nSQL().createDatabase({
      id: dbName,
      mode: new Redis({ url: process.env.REDIS_URL }),
      tables: [
        {
          name: 'happy-hours/members',
          model: {
            'id:string': { pk: true },
            'firstName:string': { notNull: true },
            'lastName:string': { notNull: true }
          }
        },
        {
          name: 'happy-hours/activities',
          model: {
            'id:int': { pk: true },
            'name:string': { notNull: true },
            'date:obj': {
              model: {
                'isScheduled:bool': { default: false },
                'tbd:string': { default: '' },
                'value:string': { default: '' },
                'meta:string': { default: '' }
              }
            },
            'place:string': { notNull: true },
            'plannerId:string': { notNull: true }
          }
        }
      ],
      version: 1
    })
  }
  nSQL().useDatabase(dbName)

  return handler(req, res)
}

// const saveHappyHoursActivities = async (_, res) => {
//   const data = dummyData.activities
//   const activities = await nSQL('happy-hours/activities').query('upsert', data).exec()
//   res.status(201).json({ activities })
// }

const listHappyHoursActivities = async (req, res) => {
  const activities = await nSQL('happy-hours/activities').query('select').exec()
  console.log(
    'listHappyHoursActivities activities',
    activities.map((activity) => activity.name)
  )
  res.json({ activities })
}

const handler = (req, res) => {
  switch (req.method) {
    // case 'POST':
    //   return saveHappyHoursActivities(req, res)
    case 'GET':
      return listHappyHoursActivities(req, res)
    default:
      return res.status(404).json({
        statusCode: 404,
        message: 'Not Found'
      })
  }
}

export default connectMiddleware(handler)
