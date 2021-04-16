import {Image} from '@chakra-ui/image'
import {Flex, Heading, Text} from '@chakra-ui/layout'

function UserProfile({user}) {
  return (
    <Flex justifyContent="center" alignItems="center" flexDir="column">
      <Image
        src={user.photoURL ?? '/hacker.png'}
        display="block"
        m="auto"
        w="20%"
        maxW="150px"
        borderRadius="full"
      />
      <Text as="i">@{user.username}</Text>
      <Heading as="h1">{user.displayname}</Heading>
    </Flex>
  )
}

export {UserProfile}
