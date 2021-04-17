import Link from 'next/link'
import {useRouter} from 'next/router'

import {Box, Flex} from '@chakra-ui/layout'
import {Button} from '@chakra-ui/button'
import {Image} from '@chakra-ui/image'

import {useUserContext} from '@/context/user-context'
import {Avatar} from '@chakra-ui/avatar'

function Navbar() {
  const {push} = useRouter()
  const {user, username} = useUserContext()

  return (
    <Box
      as="nav"
      pos="fixed"
      h="70px"
      w="100%"
      color="_text"
      top="0"
      px="10vw"
      py="0"
      zIndex="99"
      borderBottom="1px"
      borderColor="_grey"
      background="white"
    >
      <Flex as="ul" listStyleType="none" m="0" p="0" alignItems="center" justifyContent="space-between" height="100%">
        <Box as="li">
          <Link href="/">
            <Button
              size="lg"
              bg="black"
              color="white"
              _hover={{
                filter: 'brightness(80%)',
              }}
            >
              FEED
            </Button>
          </Link>
        </Box>

        {username && (
          <>
            <Box as="li" marginLeft="auto" marginRight="5">
              <Link href="admin" href="/admin">
                <Button colorScheme="messenger" size="lg">
                  Write Posts
                </Button>
              </Link>
            </Box>

            <Box as="li" marginRight="5">
              <Link href="admin" href={`/${username}`}>
                <Button size="lg" colorScheme="gray">
                  Log out
                </Button>
              </Link>
            </Box>

            <Box as="li">
              <Avatar
                // cause a11y matters <3
                _focus={{
                  boxShadow: 'outline',
                  outline: 'none',
                }}
                as="button"
                onClick={() => push(`/${username}`)}
                size="md"
                name={username}
                src={user?.photoURL}
              />
            </Box>
          </>
        )}

        {!username && (
          <>
            <Box as="li">
              <Link href="/enter">
                <Button colorScheme="messenger" size="lg">
                  Login
                </Button>
              </Link>
            </Box>
          </>
        )}
      </Flex>
    </Box>
  )
}

export {Navbar}
