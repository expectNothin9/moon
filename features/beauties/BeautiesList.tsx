import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../store'
import { Beauty, fetchBeauties } from './beautiesSlice'

const BeautiesList = () => {
  const [initialized, setInitialized] = useState(false)
  const dispatch = useDispatch()
  const beauties: Beauty[] = useSelector((state: RootState) => {
    console.log(state.beauties.data)
    return Object.values(state.beauties.data)
  })

  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
      dispatch(fetchBeauties())
    }
  }, [initialized])

  return (
    <ul>
      {beauties.map((beauty) => (
        <li key={beauty.id}>{beauty.instagram}</li>
      ))}
    </ul>
  )
}

export default BeautiesList
