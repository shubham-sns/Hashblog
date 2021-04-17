import '@/styles/globals.css'

import {Box, ChakraProvider, extendTheme} from '@chakra-ui/react'

import {Navbar} from '@/components/navbar'
import {UserProvider} from '@/context/user-context'

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
    global: props => ({
      body: {
        marginTop: '70px',
        backgroundColor: props.theme.colors._bg,
      },
    }),
  },
})

function MyApp({Component, pageProps}) {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <UserProvider>
        <Navbar />
        <Box as="main" px="10vw" py="1rem">
          <Component {...pageProps} />
        </Box>
      </UserProvider>
    </ChakraProvider>
  )
}

export default MyApp
