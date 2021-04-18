import {Text} from '@chakra-ui/layout'
import {useDocumentData} from 'react-firebase-hooks/firestore'

import {PostContent} from '@/components/post-content'
import {ContainerLayout} from '@/layouts/container'
import {firestore, getUserWithUsername, postToJSON} from '@/lib/firebase'

// incremental static site generation [https://arunoda.me/blog/what-is-nextjs-issg]
export async function getStaticProps({params}) {
  const {username, slug} = params
  const userDoc = await getUserWithUsername(username)

  let post
  let path

  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug)
    const postDoc = await postRef.get()
    console.log(postDoc)
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
    <ContainerLayout aside={<Text>{post.heartCount || 0} 💗</Text>}>
      <PostContent post={latestPost} />
    </ContainerLayout>
  )
}

export default Post
