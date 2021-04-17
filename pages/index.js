import {useState} from 'react'
import {Box} from '@chakra-ui/layout'
import {Button} from '@chakra-ui/button'
import {useToast} from '@chakra-ui/toast'

import {Loader} from '@/components/loader'
import {firestore, fromMillis, postToJSON} from '@/lib/firebase'
import {PostFeed} from '@/components/postfeed'
import {isLocalURL} from 'next/dist/next-server/lib/router/router'

const POST_LIMIT = 1

export async function getServerSideProps(context) {
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

function Home(props) {
  const [posts, setPosts] = useState(props.posts)
  const [loading, setLoading] = useState(false)
  const [postsEnd, setPostsEnd] = useState(false)

  const getMorePosts = async () => {
    setLoading(true)

    const lastPost = posts[posts.length - 1]

    const cursor =
      typeof lastPost.createdAt === 'number'
        ? fromMillis(lastPost.createdAt)
        : lastPost.createdAt

    const query = firestore
      .collectionGroup('posts')
      .where('isPublished', '==', true)
      .orderBy('createdAt', 'desc')
      .startAfter(cursor)
      .limit(POST_LIMIT)

    const newPosts = (await query.get()).docs.map(doc => doc.data())

    setPosts(posts => [...posts, ...newPosts])

    setLoading(false)

    if (newPosts.length < POST_LIMIT) {
      setPostsEnd(true)
    }
  }

  return (
    <Box>
      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <Button onClick={getMorePosts} colorScheme="teal">
          Load more
        </Button>
      )}

      <Loader show={loading} />

      {postsEnd && 'You have reached at the end!'}
    </Box>
  )
}

export default Home
