import {Avatar} from '@chakra-ui/avatar'
import {Image} from '@chakra-ui/image'
import {Flex, Heading, Text} from '@chakra-ui/layout'

function UserProfile({user}) {
  return (
    <Flex justifyContent="center" alignItems="center" flexDir="column">
      <Avatar size="2xl" name={user.username} src={user.photoURL} />

      <Text as="i" mt="4">
        @{user.username}
      </Text>

      <Heading as="h1" mt="6">
        {user.displayName}
      </Heading>
    </Flex>
  )
}

export {UserProfile}
