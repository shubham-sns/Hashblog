import '@/styles/globals.css'

import {ChakraProvider} from '@chakra-ui/react'
import {extendTheme} from '@chakra-ui/react'

import {Navbar} from '@/components/navbar'

const colors = {
  _bg: '#eef0f1',
  _text: '#08090a',
  _blue: '#3b49df',
  _red: '#df3b3b',
  _green: '#3bdf72',
  _grey: '#b5bdc4',
}

const theme = extendTheme({
  colors,
  fonts: {
    body: 'Inter',
  },
  styles: {
    global: {
      body: {
        marginTop: '50px',
      },
      main: {
        padding: '1rem 10vw',
      },
      img: {maxWidth: '100%'},
      input: {
        display: 'inline-block',
        outline: 'none',
        border: 'none',
        fontSize: '1.5rem',
        width: '100%',
        padding: '5px 10px',
      },
      fieldset: {
        border: 'none',
        padding: '1em 0',
        fontSize: '1.25rem',
      },
      code: {
        overflowX: 'scroll',
      },
    },
  },
})

function MyApp({Component, pageProps}) {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <Navbar />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
