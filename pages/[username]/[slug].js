import Link from 'next/link'
import {Button} from '@chakra-ui/button'
import {Box, Text} from '@chakra-ui/layout'
import {useDocumentData} from 'react-firebase-hooks/firestore'
import IframeResizer from 'iframe-resizer-react'

import {firestore, getUserWithUsername, postToJSON} from '@/lib/firebase'

import {PostContent} from '@/components/post-content'
import {ContainerLayout} from '@/layouts/container'
import {AuthCheck} from '@/components/auth-check'
import {HeartButton} from '@/components/heart-button'
import {Metatags} from '@/components/meta-tags'
import {Card} from '@/components/card'

// incremental static site generation [https://arunoda.me/blog/what-is-nextjs-issg]
export async function getStaticProps({params}) {
  const {username, slug} = params
  const userDoc = await getUserWithUsername(username)

  let post
  let path

  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug)
    const postDoc = await postRef.get()
    post = postToJSON(postDoc)

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
  const postRef = firestore.doc(path)
  const [realtimePost] = useDocumentData(postRef)

  const latestPost = realtimePost || post

  return (
    <>
      <Metatags title={post.title} description={post.title} />
      <ContainerLayout
        aside={
          <>
            <Text>{latestPost.heartCount || 0} 💗</Text>

            <AuthCheck
              fallback={
                <Link href="/enter">
                  <Button>Sign Up</Button>
                </Link>
              }
            >
              <HeartButton postRef={postRef} />
            </AuthCheck>
          </>
        }
      >
        <Card>
          <PostContent post={latestPost} />
        </Card>

        <Card mt="4">
          <Box
            as={IframeResizer}
            checkOrigin={false}
            title="Comments"
            src={`https://feedbackape.vercel.app/embed/AftuR9gHsFXiQIWjSgy7/${post.username}/${post.slug}`}
            w="full"
            frameBorder="0"
          />
        </Card>
      </ContainerLayout>
    </>
  )
}

export default Post
