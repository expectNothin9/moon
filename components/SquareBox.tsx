import styled from 'styled-components'

const StyledSquareBox = styled.div`
  position: relative;
  color: #f00;
  &:after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
  .content {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`

const SquareBox = ({ children }) => (
  <StyledSquareBox>
    <div className="content">{children}</div>
  </StyledSquareBox>
)

export default SquareBox
