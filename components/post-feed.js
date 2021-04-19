import {PostItem} from './post-item'

function PostFeed({posts, admin}) {
  return (
    <>
      {posts.map(post => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))}
    </>
  )
}

export {PostFeed}
