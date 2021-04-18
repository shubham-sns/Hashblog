/* eslint-disable react/jsx-props-no-spreading */
import Link from 'next/link'

import {useRouter} from 'next/router'
import {FormControl, FormErrorMessage} from '@chakra-ui/form-control'
import {Textarea} from '@chakra-ui/textarea'
import {Box, Text, VStack} from '@chakra-ui/layout'
import {Checkbox} from '@chakra-ui/checkbox'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from '@chakra-ui/tabs'
import {useToast} from '@chakra-ui/toast'
import {Button} from '@chakra-ui/button'

import {useDocumentDataOnce} from 'react-firebase-hooks/firestore'
import {useForm, useWatch} from 'react-hook-form'

import {AuthCheck} from '@/components/auth-check'
import {ContainerLayout} from '@/layouts/container'
import {MarkdownRenderer} from '@/components/markdown-renderer'
import {auth, firestore, serverTimestamp} from '@/lib/firebase'

function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  )
}

function PostManager() {
  const router = useRouter()
  const {slug} = router.query

  const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug)
  const [post, isLoading] = useDocumentDataOnce(postRef)

  return (
    <ContainerLayout
      aside={
        <Box>
          {isLoading ? null : (
            <Button colorScheme="messenger" variant="outline">
              <Link href={`/${post.username}/${post.slug}`}>
                <>
                  <Box
                    as="svg"
                    h="5"
                    w="5"
                    mr="2"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </Box>
                  View Live
                </>
              </Link>
            </Button>
          )}
        </Box>
      }
    >
      {post && (
        <>
          <Text as="h1" fontSize="4xl" fontWeight="semibold" letterSpacing="wide">
            {post.title}
          </Text>
          <Text color="gray" mb="4">
            ID: {post.slug}
          </Text>

          <PostForm postRef={postRef} defaultValues={post} />
        </>
      )}
    </ContainerLayout>
  )
}

// for less re-renders in form component :)
function IsolatedPreview({control}) {
  const content = useWatch({
    control,
    name: 'content',
  })

  return <MarkdownRenderer>{content}</MarkdownRenderer>
}

function PostForm({defaultValues, postRef}) {
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: {isDirty, isValid, errors},
  } = useForm({defaultValues})
  const toast = useToast()

  const updatePost = async ({content, isPublished}) => {
    await postRef
      .update({
        content,
        isPublished,
        updatedAt: serverTimestamp(),
      })
      .then(() => {
        reset({content, isPublished})
        toast({
          status: 'success',
          title: 'Updated',
          isClosable: true,
          position: 'top',
        })
      })
      .catch(e => {
        toast({
          status: 'error',
          title: 'Error',
          description: e.message,
          isClosable: true,
          position: 'top',
        })
      })
  }

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      <Tabs colorScheme="messenger">
        <TabList>
          <Tab>
            <PencilIcon />
            <Text>Write</Text>
          </Tab>
          <Tab>
            <EyeIcon />
            <Text>Preview</Text>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px="0">
            <VStack>
              <FormControl isInvalid={errors.content}>
                <Textarea
                  focusBorderColor="none"
                  h="60vh"
                  {...register('content', {
                    maxLength: {
                      value: 20000,
                      message: 'Content is too long',
                    },
                    minLength: {
                      value: 10,
                      message: 'Content is too short',
                    },
                    required: {
                      value: true,
                      message: 'Content is required',
                    },
                  })}
                  id="content"
                  borderColor="_gray"
                />
                <FormErrorMessage>{errors.content?.message}</FormErrorMessage>
              </FormControl>

              <FormControl ml="2" my="1">
                <Box as="fieldset">
                  <Checkbox {...register('isPublished')} id="isPublished" placeholder="published" size="lg">
                    Publish
                  </Checkbox>
                </Box>
              </FormControl>

              <Button colorScheme="green" size="lg" type="submit" disabled={!isDirty}>
                Save Changes
              </Button>
            </VStack>
          </TabPanel>

          <TabPanel>
            <IsolatedPreview control={control} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </form>
  )
}

function PencilIcon() {
  return (
    <Box
      as="svg"
      h="5"
      w="5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      mr="1"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </Box>
  )
}

function EyeIcon() {
  return (
    <Box
      as="svg"
      h="5"
      w="5"
      mr="1"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </Box>
  )
}

export default AdminPostEdit
