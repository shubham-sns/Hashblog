import {Box} from '@chakra-ui/layout'

import {Loader} from '@/components/loader'
import {useToast} from '@chakra-ui/toast'
import {Button} from '@chakra-ui/button'

function Home() {
  return (
    <Box>
      <Loader show />
    </Box>
  )
}

export default Home
