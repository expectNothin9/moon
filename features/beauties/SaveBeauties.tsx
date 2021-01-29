import SyncIcon from '@material-ui/icons/Sync'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { fetchSaveBeauties } from './beautiesSlice'

const StyledSaveBeauties = styled.section`
  display: flex;
  justify-content: center;
  padding-top: var(--space-m);
  button {
    display: flex;
    align-items: center;
    padding: var(--space-s) var(--space-m);
    border-radius: var(--space-s);
    border: 1px solid #ccc;
    color: #333;
    font-size: 16px;
  }
`
const SaveBeauties = () => {
  const dispatch = useDispatch()
  const handleSaveBeauties = useCallback(() => {
    dispatch(fetchSaveBeauties())
  }, [dispatch])

  return (
    <StyledSaveBeauties>
      <button onClick={handleSaveBeauties}>
        <SyncIcon />
        Save dummy beauties to redis
      </button>
    </StyledSaveBeauties>
  )
}

export default SaveBeauties
