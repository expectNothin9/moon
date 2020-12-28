import { useEffect } from 'react' 
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../../store'
import { Beauty, fetchBeauties } from './beautiesSlice'

const BeautiesList = () => {
  const dispatch = useDispatch()
  const beauties: Beauty[] = useSelector((state: RootState) => Object.values(state.beauties))

  useEffect(() => {
    if (beauties.length === 0) {
      dispatch(fetchBeauties())
    }
  }, [beauties])

  return (
    <ul>
      {beauties.map((beauty) =>
        <li key={beauty.id}>{beauty.instagram}</li>)
      }
    </ul>
  )
}

export default BeautiesList
