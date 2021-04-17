import {UserProfile} from '@/components/user-profile'
import {PostFeed} from '@/components/post-feed'

import {getUserWithUsername, postToJSON} from '@/lib/firebase'

export async function getServerSideProps({query}) {
  const {username} = query

  const userDoc = await getUserWithUsername(username)

  let user = null
  let posts = null

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
      <PostFeed posts={posts} />
    </>
  )
}

export default UserProfilePage
