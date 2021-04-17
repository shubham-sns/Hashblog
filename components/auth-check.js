import Link from 'next/link'

import {Button} from '@chakra-ui/button'
import {Text, VStack} from '@chakra-ui/layout'

const {useUserContext} = require('@/context/user-context')

function AuthCheck({children, fallback}) {
  const {username} = useUserContext()

  if (username) return children

  return (
    fallback || (
      <VStack alignContent="center" justifyContent="center">
        <Text as="h3" fontSize="xl">
          You must be signed in
        </Text>
        <Link href="/enter">
          <Button colorScheme="teal">Go to Signin</Button>
        </Link>
      </VStack>
    )
  )
}

export {AuthCheck}
