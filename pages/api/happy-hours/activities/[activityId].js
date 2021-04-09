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

const saveHappyHoursActivity = async (req, res) => {
  const activityId = parseInt(req.query.activityId, 10)
  const activityToSave = req.body
  const activities = await nSQL('happy-hours/activities')
    .query('upsert', activityToSave)
    .where(['id', '=', activityId])
    .exec()
  res.json({ activity: activities[0] })
}

const handler = (req, res) => {
  switch (req.method) {
    case 'PUT':
      return saveHappyHoursActivity(req, res)
    default:
      return res.status(404).json({
        statusCode: 404,
        message: 'Not Found'
      })
  }
}

export default connectMiddleware(handler)
