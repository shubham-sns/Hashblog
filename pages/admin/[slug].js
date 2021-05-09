/* eslint-disable react/jsx-props-no-spreading */
import {useRef} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'

import {FormControl, FormErrorMessage} from '@chakra-ui/form-control'
import {Textarea} from '@chakra-ui/textarea'
import {Box, Text, VStack} from '@chakra-ui/layout'
import {Checkbox} from '@chakra-ui/checkbox'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from '@chakra-ui/tabs'
import {Button} from '@chakra-ui/button'
import {useToast} from '@chakra-ui/toast'
import {useDisclosure} from '@chakra-ui/hooks'

import {useDocumentDataOnce} from 'react-firebase-hooks/firestore'
import {useForm, useWatch} from 'react-hook-form'

import {AuthCheck} from '@/components/auth-check'
import {ContainerLayout} from '@/layouts/container'
import {MarkdownRenderer} from '@/components/markdown-renderer'
import {auth, firestore, serverTimestamp} from '@/lib/firebase'
import {AirplaneIcon, DeleteIcon, EyeIcon, PencilIcon} from 'assets/icons'
import {ConfirmDialog} from '@/components/logout-dialog'

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
        <>
          {isLoading ? null : (
            <>
              <Link href={`/${post.username}/${post.slug}`}>
                <Button colorScheme="messenger" variant="outline">
                  <>
                    <AirplaneIcon />
                    View Live
                  </>
                </Button>
              </Link>

              <DeletePost postRef={postRef} />
            </>
          )}
        </>
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
    formState: {isDirty, errors},
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

function DeletePost({postRef}) {
  const router = useRouter()
  const toast = useToast()

  const {isOpen, onClose, onOpen} = useDisclosure()

  const deletePost = async () => {
    await postRef.delete()
    router.push('/admin')
    toast({
      status: 'error',
      title: 'Post annihilated ',
      isClosable: true,
      position: 'top',
    })
  }

  const cancelRef = useRef()

  return (
    <>
      <Button colorScheme="red" variant="outline" onClick={onOpen}>
        <DeleteIcon />
        Delete
      </Button>

      <ConfirmDialog
        header="Delete!!"
        body="Are you sure you want to delete this post? This action can't be undone."
        cancelRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={deletePost}
      />
    </>
  )
}

export default AdminPostEdit
