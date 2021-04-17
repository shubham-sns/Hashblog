import {useState} from 'react'
import Link from 'next/link'
import {Box, Flex, Text, VStack} from '@chakra-ui/layout'
import {Avatar} from '@chakra-ui/avatar'
import {Button} from '@chakra-ui/button'

import {Loader} from '@/components/loader'
import {firestore, fromMillis, postToJSON} from '@/lib/firebase'
import {PostFeed} from '@/components/post-feed'
import {useUserContext} from '@/context/user-context'
import {Card} from '@/components/card'

const POST_LIMIT = 1

export async function getServerSideProps() {
  const postsQuery = firestore
    .collectionGroup('posts')
    .where('isPublished', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(POST_LIMIT)

  const posts = (await postsQuery.get()).docs.map(postToJSON)

  return {
    props: {posts}, // will be passed to the page component as props
  }
}

function Home({posts: ssrPosts}) {
  const {user, username} = useUserContext()

  const [posts, setPosts] = useState(ssrPosts)
  const [loading, setLoading] = useState(false)
  const [postsEnd, setPostsEnd] = useState(false)

  const getMorePosts = async () => {
    setLoading(true)

    const lastPost = posts[posts.length - 1]

    const cursor = typeof lastPost.createdAt === 'number' ? fromMillis(lastPost.createdAt) : lastPost.createdAt

    const query = firestore
      .collectionGroup('posts')
      .where('isPublished', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(POST_LIMIT)

    const newPosts = (await query.get()).docs.map(postToJSON)

    setPosts(posts => [...posts, ...newPosts])

    setLoading(false)

    if (newPosts.length < POST_LIMIT) {
      setPostsEnd(true)
    }
  }

  return (
    <VStack spacing="4">
      {username && (
        <Card>
          <Link href={`/${username}`}>
            <Flex mb="2">
              <Box cursor="pointer">
                <Avatar src={user.photoURL} size="sm" mr="2" color="white" bg="teal.500" />
                <Text display="inline" fontSize="xl" letterSpacing="tight">
                  {username}
                </Text>
              </Box>
            </Flex>
          </Link>

          <Box p="4" mt="2" bg="gray.100" rounded="xl" borderWidth="1px" borderColor="gray.300" borderRadius="lg">
            <Link href="/admin">
              <Flex cursor="pointer">
                <Box as="svg" display="inline" w="6" mr="4" fill="current" viewBox="0 0 512 512">
                  <path
                    d="M498 142.08l-56.6 56.55-128-128 56.55-56.55a48 48 0 0167.91 0L498 74.17a48 48 0 010 67.91z"
                    opacity=".4"
                  />
                  <path d="M12.85 371.11L.15 485.33a24 24 0 0026.49 26.51l114.14-12.6 278-278-128-128z" />
                </Box>
                <Text as="span" fontSize="xl">
                  Write an article...
                </Text>
              </Flex>
            </Link>
          </Box>
        </Card>
      )}

      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <Button onClick={getMorePosts} colorScheme="teal">
          Load more
        </Button>
      )}

      <Loader show={loading} />

      {postsEnd && (
        <Card>
          <Text textAlign="center" fontSize="xl" color="gray.600">
            You've reached at the end! 👋
          </Text>
        </Card>
      )}
    </VStack>
  )
}

export default Home
