import '../reset.css'

import { Provider } from 'react-redux'
import { createGlobalStyle } from 'styled-components'

import store from '../store'

const GlobalStyle = createGlobalStyle`
  html, body, #__next {
    width:100%;
    height:100%;
  }
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  :root {
    --space-m: 12px;
    --space-s: 8px;
    --space-xs: 4px;
    --ultimate-gray: #97999b;
    --illuminating: #f5df4d;
  }
`

const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <GlobalStyle />
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default MyApp
