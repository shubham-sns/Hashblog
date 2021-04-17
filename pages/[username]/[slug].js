import {Box, Flex, Stack, Text} from '@chakra-ui/layout'
import {useDocumentData} from 'react-firebase-hooks/firestore'

import {firestore, getUserWithUsername, postToJSON} from '@/lib/firebase'
import {useMediaQuery} from '@chakra-ui/media-query'
import {PostContent} from '@/components/post-content'
import {Card} from '@/components/card'
import {useUserContext} from '@/context/user-context'

// incremental static site generation [https://arunoda.me/blog/what-is-nextjs-issg]
export async function getStaticProps({params}) {
  const {username, slug} = params
  const userDoc = await getUserWithUsername(username)

  let post
  let path

  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug)
    post = postToJSON(await postRef.get())

    path = postRef.path
  }

  return {
    props: {post, path},
    revalidate: 100,
  }
}

export async function getStaticPaths() {
  // Improve my using Admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup('posts').get()

  const paths = snapshot.docs.map(doc => {
    const {slug, username} = doc.data()
    return {
      params: {username, slug},
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

function Post({path, post}) {
  const {user} = useUserContext()

  const postRef = firestore.doc(path)
  const [realtimePost] = useDocumentData(postRef)

  const [isLessThan768] = useMediaQuery('(max-width: 768px)')

  const latestPost = realtimePost || post

  return (
    <Stack spacing="1rem" direction={isLessThan768 ? 'column' : 'row'} minH="fit-content">
      <Box as="section" width={isLessThan768 ? '100%' : '60vw'}>
        <PostContent post={latestPost} />
      </Box>

      <Flex
        as="aside"
        flexDir="column"
        w={isLessThan768 ? '100%' : '20%'}
        pos={isLessThan768 ? 'relative' : 'sticky'}
        minW="250px"
        minH="200px"
        textAlign="center"
        h="0"
        top="80px"
      >
        <Card>
          <Text>{post.heartCount || 0} 💗</Text>
        </Card>
      </Flex>
    </Stack>
  )
}

export default Post
