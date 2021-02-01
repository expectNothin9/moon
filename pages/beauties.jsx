import { useSelector } from 'react-redux'
import styled from 'styled-components'

import BeautiesList from '../features/beauties/BeautiesList'
import OperationsList from '../features/beauties/OperationsList'

const StyledBeautiesPage = styled.section`
  padding-bottom: 40px;
`
const BeautiesPage = () => {
  const appEnv = useSelector((state) => state.shared.appEnv)
  return (
    <StyledBeautiesPage>
      <BeautiesList />
      {appEnv === 'local' && <OperationsList />}
    </StyledBeautiesPage>
  )
}

export default BeautiesPage
