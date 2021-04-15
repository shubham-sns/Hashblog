import Link from 'next/link'

import {Box, Flex} from '@chakra-ui/layout'
import {Button} from '@chakra-ui/button'
import {Image} from '@chakra-ui/image'

function Navbar() {
  const username = null
  const user = null

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
    >
      <Flex
        as="ul"
        listStyleType="none"
        m="0"
        p="0"
        alignItems="center"
        justifyContent="space-between"
        height="100%"
      >
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
                <Button colorScheme="blue" size="lg">
                  Write Posts
                </Button>
              </Link>
            </Box>

            <Box as="li" marginRight="5">
              <Link href="admin" href={`/${username}`}>
                <Button size="lg" colorScheme="gray">
                  Log Out
                </Button>
              </Link>
            </Box>

            <Box as="li">
              <Link href="admin" href={`/${username}`}>
                <Image
                  cursor="pointer"
                  src={`/${user?.photURL}`}
                  boxSize="50px"
                  borderRadius="full"
                  fallbackSrc="https://via.placeholder.com/150"
                />
              </Link>
            </Box>
          </>
        )}

        {!username && (
          <>
            <Box as="li">
              <Link href="/enter">
                <Button colorScheme="blue" size="lg">
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
