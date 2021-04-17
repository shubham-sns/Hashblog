import {UserProfile} from '@/components/user-profile'
import {PostFeed} from '@/components/post-feed'

import {getUserWithUsername, postToJSON} from '@/lib/firebase'
import {VStack} from '@chakra-ui/layout'

export async function getServerSideProps({query}) {
  const {username} = query

  const userDoc = await getUserWithUsername(username)

  let user = null
  let posts = null

  // if no user, short circuit to 404 page
  if (!userDoc) {
    return {notFound: true}
  }

  if (userDoc) {
    user = userDoc.data()

    // query to get user post
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('isPublished', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5)

    posts = (await postsQuery.get()).docs.map(postToJSON)
  }

  return {
    props: {user, posts},
  }
}

function UserProfilePage({user, posts}) {
  return (
    <>
      <UserProfile user={user} />

      <VStack spacing="4" mt="8">
        <PostFeed posts={posts} />
      </VStack>
    </>
  )
}

export default UserProfilePage
