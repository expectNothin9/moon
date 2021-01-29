import { useSelector } from 'react-redux'

import BeautiesList from '../features/beauties/BeautiesList'
import SaveBeauties from '../features/beauties/SaveBeauties'
import { RootState } from '../store'

const BeautiesPage = () => {
  const appEnv = useSelector((state: RootState) => state.shared.appEnv)
  return (
    <>
      {appEnv === 'local' && <SaveBeauties />}
      <BeautiesList />
    </>
  )
}

export default BeautiesPage
