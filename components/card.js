import {Box} from '@chakra-ui/layout'

function Card({children}) {
  return (
    <Box p="4" background="white" border borderWidth="1px" borderColor="_gray" borderRadius="lg" w="full">
      {children}
    </Box>
  )
}

export {Card}
