import { useCallback, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import SquareBox from '../../components/SquareBox'
import { fetchBeauties, selectBeauty } from './beautiesSlice'

const StyledBeautiesList = styled.ul`
  padding: var(--space-m);
  display: flex;
  flex-wrap: wrap;
  li {
    width: 25%;
  }
  li > div {
    display: block;
    margin: var(--space-s);
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
    text-decoration: none;
  }
  li > div.selected {
    box-shadow: 0 0 8px 2px #333;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  a {
    display: block;
    color: #333;
    padding: var(--space-s);
    text-decoration: none;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`

const BeautiesList = () => {
  const [initialized, setInitialized] = useState(false)
  const dispatch = useDispatch()
  const { beauties, selectedBeautyId } = useSelector((state) => {
    // console.log(state.beauties.data)
    return {
      beauties: Object.values(state.beauties.data),
      selectedBeautyId: state.beauties.selectedId
    }
  }, shallowEqual)

  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
      dispatch(fetchBeauties())
    }
  }, [initialized, dispatch])

  const handleSelectBeauty = useCallback(
    (beautyId) => () => {
      dispatch(selectBeauty({ beautyId }))
    },
    [dispatch]
  )

  return (
    <StyledBeautiesList>
      {beauties.map((beauty) => (
        <li key={beauty.id}>
          <div
            className={beauty.id === selectedBeautyId ? 'selected' : null}
            onClick={handleSelectBeauty(beauty.id)}
            selected={beauty.id === selectedBeautyId}
            role="presentation">
            <SquareBox>
              <img src={beauty.images[0]} alt={`@${beauty.instagram}`} />
            </SquareBox>
            <a href={`http://instagram.com/${beauty.instagram}`}>
              <em>@{beauty.instagram}</em>
            </a>
          </div>
        </li>
      ))}
    </StyledBeautiesList>
  )
}

export default BeautiesList
