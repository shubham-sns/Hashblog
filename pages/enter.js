/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect, useCallback} from 'react'
import {useRouter} from 'next/router'

import {Heading, Flex, Text, Box, VStack} from '@chakra-ui/layout'
import {Button} from '@chakra-ui/button'
import {Image} from '@chakra-ui/image'
import {FormControl, FormErrorMessage, FormHelperText, FormLabel} from '@chakra-ui/form-control'
import {Input} from '@chakra-ui/input'
import {useToast} from '@chakra-ui/toast'
import debounce from 'lodash.debounce'

import {auth, firestore, googleAuthProvider} from '@/lib/firebase'
import {useUserContext} from '@/context/user-context'

import {Metatags} from '@/components/meta-tags'

function Enter() {
  const {user, username} = useUserContext()
  return (
    <>
      <Metatags title="Enter" description="Sign up for this amazing app!" />
      {user ? !username ? <UserNameForm /> : <SignOutButton /> : <SignInButton />}
    </>
  )
}

function SignInButton() {
  const router = useRouter()
  const toast = useToast()

  const signInWithGoogle = async () => {
    await auth
      .signInWithPopup(googleAuthProvider)
      .then(result => {
        //* code which runs on success
        router.replace('/')
      })
      .catch(error => {
        //* Handle Errors here.
        const errorMessage = error.message
        toast({
          title: errorMessage,
          status: 'error',
          isClosable: true,
          variant: 'left-accent',
          position: 'top',
        })
      })
  }

  return (
    <VStack>
      <Button
        leftIcon={<Image boxSize="30px" src="/google.png" />}
        size="lg"
        onClick={signInWithGoogle}
        colorScheme="messenger"
        variant="outline"
      >
        Sign In with Google
      </Button>

      <Button
        colorScheme="gray"
        borderColor="black"
        size="lg"
        variant="outline"
        onClick={() => auth.signInAnonymously()}
      >
        <Box
          as="svg"
          h="8"
          mr="2"
          w="8"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </Box>
        Sign in Anonymously
      </Button>
    </VStack>
  )
}

function SignOutButton() {
  return (
    <Button size="lg" colorScheme="red" variant="outline" onClick={() => auth.signOut()}>
      Sign Out
    </Button>
  )
}

function UserNameForm() {
  const [formValue, setFormValue] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)

  const {user, username} = useUserContext()

  // Hit the database for username match after each debounced change
  // ? useCallback for 2 reasons -> 1. you want debounce to work even if page re-renders, 2. to put this into useEffect dep. array
  const checkUsername = useCallback(
    debounce(async username => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`)
        const {exists} = await ref.get()

        console.info('Firestore read executed!')

        setIsValid(!exists)
        setLoading(false)
      }
    }, 500),
    []
  )

  useEffect(() => {
    checkUsername(formValue)
  }, [checkUsername, formValue])

  const onSubmit = async e => {
    e.preventDefault()

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`)
    const usernameDoc = firestore.doc(`usernames/${formValue}`)

    // Commit both docs together as a batch write.
    const batch = firestore.batch()
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    })
    batch.set(usernameDoc, {uid: user.uid})

    await batch.commit()
  }

  const handleChange = e => {
    const val = e.target.value.toLowerCase()

    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val)
      setLoading(false)
      setIsValid(false)
    }

    if (re.test(val)) {
      setFormValue(val)
      setLoading(true)
      setIsValid(false)
    }
  }

  if (username) return null

  return (
    <Flex direction="column" justifyContent="center" alignItems="flex-start" as="section" mx="auto" width="50%">
      <form style={{width: '100%'}} onSubmit={onSubmit}>
        <FormControl id="username" colorScheme="blue" isInvalid={!isValid}>
          <FormLabel>
            <Heading as="h3" size="lg">
              Choose Username
            </Heading>
          </FormLabel>

          <Input borderColor="gray.400" background="white" size="lg" value={formValue} onChange={handleChange} />

          <HelperText isValid={isValid} loading={loading} formValue={formValue} />
        </FormControl>

        <Button
          type="submit"
          size="md"
          colorScheme="green"
          mt="3"
          disabled={!isValid || loading}
          isLoading={loading}
          loadingText="Loading..."
        >
          Submit
        </Button>
      </form>

      <Heading as="h3" size="md" mt="5" mb="2">
        Debug State
      </Heading>
      <Text>Username Valid: {isValid.toString()}</Text>
    </Flex>
  )
}

function HelperText({loading, formValue, isValid}) {
  if (loading) return null

  if (isValid) return <FormHelperText>'{formValue}' is available</FormHelperText>

  return (
    <FormErrorMessage>
      {formValue.length < 3 ? 'length of username must be 4 or more.' : 'Username is taken, try different username'}
    </FormErrorMessage>
  )
}

export default Enter
