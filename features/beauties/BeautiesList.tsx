import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import SquareBox from '../../components/SquareBox'
import { RootState } from '../../store'
import { Beauty, fetchBeauties } from './beautiesSlice'

const StyledBeautiesList = styled.ul`
  --space-m: 12px;
  --space-s: 8px;
  --space-xs: 4px;
  padding: var(--space-m);
  display: flex;
  flex-wrap: wrap;
  li {
    width: 25%;
  }
  a {
    display: block;
    margin: var(--space-xs);
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
    text-decoration: none;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  em {
    display: block;
    color: #333;
    padding: var(--space-s);
    text-overflow: ellipsis;
    overflow: hidden;
  }
`

const BeautiesList = () => {
  const [initialized, setInitialized] = useState(false)
  const dispatch = useDispatch()
  const beauties: Beauty[] = useSelector((state: RootState) => {
    // console.log(state.beauties.data)
    return Object.values(state.beauties.data)
  })

  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
      dispatch(fetchBeauties())
    }
  }, [initialized, dispatch])

  return (
    <StyledBeautiesList>
      {beauties.map((beauty) => (
        <li key={beauty.id}>
          <a href={`http://instagram.com/${beauty.instagram}`}>
            <SquareBox>
              <img src={beauty.images[0]} alt={`@${beauty.instagram}`} />
            </SquareBox>
            <em>@{beauty.instagram}</em>
          </a>
        </li>
      ))}
    </StyledBeautiesList>
  )
}

export default BeautiesList
