import type { NextApiRequest, NextApiResponse } from 'next'

import dummyData from '../../dummy/beauties'

const listBeauties = async (_: NextApiRequest, res: NextApiResponse) => {
  res.json(dummyData)
}

export default function handler (req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return listBeauties(req, res)
    default:
      return res.status(404).json({
        statusCode: 404,
        message: 'Not Found'
      })
  }
}
