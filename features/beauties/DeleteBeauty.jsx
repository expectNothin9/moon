import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { fetchDeleteBeauty } from './beautiesSlice'

const StyledDeleteBeauty = styled.section`
  button {
    display: flex;
    align-items: center;
    margin-left: var(--space-m);
    padding: var(--space-xs) var(--space-s);
    border-radius: var(--space-xs);
    border: 1px solid #ccc;
    color: #333;
    background: #fff;
    font-size: 16px;
  }
`
const DeleteBeauty = () => {
  const dispatch = useDispatch()
  const selectedBeauty = useSelector((state) => {
    const { data, selectedId } = state.beauties
    return data[selectedId]
  })
  const handleDeleteBeauty = useCallback(() => {
    dispatch(fetchDeleteBeauty({ beautyId: selectedBeauty.id }))
  }, [dispatch, selectedBeauty])

  return selectedBeauty === undefined ? null : (
    <StyledDeleteBeauty>
      <button onClick={handleDeleteBeauty}>
        <DeleteForeverIcon />
        {`Delete ${selectedBeauty.instagram}`}
      </button>
    </StyledDeleteBeauty>
  )
}

export default DeleteBeauty
