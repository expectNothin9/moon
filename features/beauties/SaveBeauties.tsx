import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { fetchSaveBeauties } from './beautiesSlice'

const SaveBeauties = () => {
  const dispatch = useDispatch()
  const handleSaveBeauties = useCallback(() => {
    dispatch(fetchSaveBeauties())
  }, [])

  return (
    <button onClick={handleSaveBeauties}>Save Beauties</button>
  )
}

export default SaveBeauties