import SyncIcon from '@material-ui/icons/Sync'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { fetchSyncBeauties } from './beautiesSlice'

const StyledSyncBeauties = styled.section`
  button {
    display: flex;
    align-items: center;
    padding: var(--space-xs) var(--space-s);
    border-radius: var(--space-xs);
    border: 1px solid #ccc;
    color: #333;
    background: #fff;
    font-size: 16px;
  }
`
const SaveBeauties = () => {
  const dispatch = useDispatch()
  const handleSyncBeauties = useCallback(() => {
    dispatch(fetchSyncBeauties())
  }, [dispatch])

  return (
    <StyledSyncBeauties>
      <button onClick={handleSyncBeauties}>
        <SyncIcon />
        Sync dummy beauties to redis
      </button>
    </StyledSyncBeauties>
  )
}

export default SaveBeauties
