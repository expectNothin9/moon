export const loadCss = async (path: string) => {
  return new Promise((resolve) => {
    try {
      console.log('start to load')
      const head = document.querySelector('head')
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.type = 'text/css'
      link.href = path
      link.onload = () => {
        console.log('loaded')
        resolve(true)
      }
      link.onerror = () => {
        console.log('failed to load')
        resolve(false)
      }
      head.appendChild(link)
    } catch (error) {
      resolve(false)
    }
  })
}

export const loadJs = async (path: string) => {
  return new Promise((resolve) => {
    try {
      console.log('start to load')
      const head = document.querySelector('head')
      const script = document.createElement('script')
      script.src = path
      script.onload = () => {
        console.log('loaded')
        resolve(true)
      }
      script.onerror = () => {
        console.log('failed to load')
        resolve(false)
      }
      head.appendChild(script)
    } catch (error) {
      resolve(false)
    }
  })
}
