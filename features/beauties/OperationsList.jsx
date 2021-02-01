import styled from 'styled-components'

import DeleteBeauty from './DeleteBeauty'
import SyncBeauties from './SyncBeauties'

const StyledOperations = styled.section`
  position: fixed;
  bottom: 0;
  z-index: 1;
  padding: var(--space-m);
  background: rgba(255, 255, 255, 0.9);
  width: 100%;
  display: flex;
`

const OperationsList = () => {
  return (
    <StyledOperations>
      <SyncBeauties />
      <DeleteBeauty />
    </StyledOperations>
  )
}

export default OperationsList
