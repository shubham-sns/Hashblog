import {PostItem} from './post-item'

function PostFeed({posts, admin}) {
  if (!posts) return null

  return (
    <>
      {posts.map(post => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))}
    </>
  )
}

export {PostFeed}
