import { useSelector } from 'react-redux'

import BeautiesList from '../features/beauties/BeautiesList'
import SaveBeauties from '../features/beauties/SaveBeauties'
import { RootState } from '../store'

const BeautiesPage = () => {
  const appEnv = useSelector((state: RootState) => state.shared.appEnv)
  return (
    <>
      <BeautiesList />
      {appEnv === 'local' && <SaveBeauties />}
    </>
  )
}

export default BeautiesPage
