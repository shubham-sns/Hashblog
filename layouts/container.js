import {Card} from '@/components/card'
import {Box, Flex, Stack} from '@chakra-ui/layout'
import {useMediaQuery} from '@chakra-ui/media-query'

function ContainerLayout({children, aside}) {
  const [isLessThan768] = useMediaQuery('(max-width: 768px)')

  return (
    <Stack spacing="1rem" direction={isLessThan768 ? 'column' : 'row'} minH="fit-content">
      <Box as="section" width={isLessThan768 ? '100%' : '60vw'}>
        {children}
      </Box>

      <Flex
        as="aside"
        flexDir="column"
        w={isLessThan768 ? '100%' : '20%'}
        pos={isLessThan768 ? 'relative' : 'sticky'}
        minW="250px"
        minH="200px"
        textAlign="center"
        h="0"
        top="80px"
      >
        <Card>{aside}</Card>
      </Flex>
    </Stack>
  )
}

export {ContainerLayout}
