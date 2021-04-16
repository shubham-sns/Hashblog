import {UserProfile} from '@/components/user-profile'
import {PostFeed} from '@/components/postfeed'

import {getUserWithUsername} from '@/lib/firebase'

export async function getServerSideProps({query}) {
  const {username} = query

  const userDoc = await getUserWithUsername(username)

  let user = null
  let post = null

  if (userDoc) {
    user = userDoc.data()
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('isPublished', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5)

    posts = (await postsQuery.get()).docs().map(postToJSON)
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
