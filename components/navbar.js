import Link from 'next/link'
import {useRef} from 'react'
import {useRouter} from 'next/router'

import {Box, Flex} from '@chakra-ui/layout'
import {Button} from '@chakra-ui/button'

import {useUserContext} from '@/context/user-context'
import {Avatar} from '@chakra-ui/avatar'
import {useDisclosure} from '@chakra-ui/hooks'
import {auth} from '@/lib/firebase'
import {useMediaQuery} from '@chakra-ui/media-query'
import {ConfirmDialog} from './logout-dialog'

function Navbar() {
  const {push} = useRouter()
  const {user, username} = useUserContext()

  const [isLessThan768] = useMediaQuery('(max-width: 768px)')

  const {isOpen, onClose, onOpen} = useDisclosure()

  const cancelRef = useRef()

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
      borderColor="_gray"
      background="white"
    >
      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        cancelRef={cancelRef}
        header="Log Out!"
        body="Are you sure you want to logout?"
        onConfirm={() => {
          auth.signOut()
          onClose()
        }}
      />

      <Flex as="ul" listStyleType="none" m="0" p="0" alignItems="center" justifyContent="space-between" height="100%">
        <Box as="li">
          <Link href="/">
            <Button
              size={isLessThan768 ? 'md' : 'lg'}
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
              <Link href="/admin">
                <Button colorScheme="messenger" size={isLessThan768 ? 'md' : 'lg'}>
                  Write Posts
                </Button>
              </Link>
            </Box>

            <Box as="li" marginRight="5">
              <Button size={isLessThan768 ? 'md' : 'lg'} onClick={onOpen}>
                Log Out
              </Button>
            </Box>

            <Box as="li">
              <Avatar
                color="white"
                bg="teal.500"
                _focus={{
                  // cause a11y matters <3
                  boxShadow: 'outline',
                  outline: 'none',
                }}
                as="button"
                onClick={() => push(`/${username}`)}
                size={isLessThan768 ? 'md' : 'lg'}
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
                <Button colorScheme="messenger" size={isLessThan768 ? 'md' : 'lg'}>
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
