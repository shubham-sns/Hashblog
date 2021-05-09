import {Box, Flex, Stack} from '@chakra-ui/layout'
import {useMediaQuery} from '@chakra-ui/media-query'

import {Card} from '@/components/card'

function ContainerLayout({children, aside}) {
  const [isLessThan768] = useMediaQuery('(max-width: 768px)')

  return (
    <Stack spacing="1rem" direction={isLessThan768 ? 'column' : 'row'} minH="fit-content">
      <Box as="section" width={isLessThan768 ? '100%' : '60vw'}>
        <Card>{children}</Card>
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
      >
        <Card>
          <Flex alignItems="center" justifyContent="center" direction={isLessThan768 ? 'row' : 'column'} gridGap="4">
            {aside}
          </Flex>
        </Card>
      </Flex>
    </Stack>
  )
}

export {ContainerLayout}
