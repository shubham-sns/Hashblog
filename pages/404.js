import {Button} from '@chakra-ui/button'
import {Heading, VStack} from '@chakra-ui/layout'
import Link from 'next/link'

export default function Custom404() {
  return (
    <VStack justifyContent="center" alignItems="center" height="fit-content">
      <Heading as="h3" fontSize="2xl">
        404 - That page does not seem to exist...
      </Heading>

      <iframe
        title="gif"
        src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
        width="480px"
        height="362px"
        frameBorder="0"
      />

      <Link href="/">
        <Button colorScheme="teal">Go home</Button>
      </Link>
    </VStack>
  )
}
