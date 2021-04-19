import {useState} from 'react'
import {useRouter} from 'next/router'

import {useToast} from '@chakra-ui/toast'
import {Divider, Text, VStack} from '@chakra-ui/layout'
import {useCollectionOnce} from 'react-firebase-hooks/firestore'
import kebabCase from 'lodash.kebabcase'
import {FormControl, FormHelperText, FormLabel} from '@chakra-ui/form-control'
import {Input} from '@chakra-ui/input'
import {Button} from '@chakra-ui/button'

import {AuthCheck} from '@/components/auth-check'
import {useUserContext} from '@/context/user-context'
import {auth, firestore, postToJSON, serverTimestamp} from '@/lib/firebase'
import {PostFeed} from '@/components/post-feed'

function AdminPostsPage() {
  return (
    <AuthCheck>
      <CreateNewPost />

      <PostList />
    </AuthCheck>
  )
}

function PostList() {
  const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts')
  const query = ref.orderBy('createdAt')

  const [querySnapshot] = useCollectionOnce(query)
  const posts = querySnapshot?.docs.map(postToJSON)

  if (!posts?.length) return null

  return (
    <>
      <Text as="h1" fontSize="3xl" mb="4" fontWeight="semibold" textAlign="center">
        Manage your posts
      </Text>

      <VStack>
        <PostFeed posts={posts} admin />
      </VStack>
    </>
  )
}

function CreateNewPost() {
  const router = useRouter()
  const toast = useToast()
  const {username, user} = useUserContext()

  const [title, setTitle] = useState('')

  // ensure slug is url safe
  const slug = encodeURI(kebabCase(title.trim()))

  const isValid = title.length > 3 && title.length < 100

  const createPost = async e => {
    e.preventDefault()
    const {uid} = auth.currentUser
    const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug)

    const data = {
      title,
      slug,
      uid,
      username,
      isPublished: false,
      content: '### Hello world! 🌍',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
      photoURL: user.photoURL,
    }

    await ref.set(data)

    toast({
      title: 'Post Created',
      isClosable: true,
      status: 'success',
      position: 'top',
    })

    router.push(`/admin/${slug}`)
  }

  return (
    <form onSubmit={createPost}>
      <FormControl id="title">
        <FormLabel>Post Title</FormLabel>

        <Input size="lg" borderColor="_gray" bg="white" onChange={e => setTitle(e.target.value)} />

        <FormHelperText>
          <Text as="span" fontWeight="semibold">
            Slug
          </Text>
          : {slug}
        </FormHelperText>

        <Button type="submit" colorScheme="messenger" mt="4" disabled={!isValid}>
          Create New Post
        </Button>
      </FormControl>
    </form>
  )
}

export default AdminPostsPage
