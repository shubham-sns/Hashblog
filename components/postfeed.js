import Link from 'next/link'
import {Button} from '@chakra-ui/button'
import {Box, VStack} from '@chakra-ui/layout'

function PostFeed({posts, admin}) {
  if (!posts) return null

  return (
    <VStack spacing="4">
      {posts.map(post => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))}
    </VStack>
  )
}

function PostItem({post, admin = false}) {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length
  const minutesToRead = (wordCount / 100 + 1).toFixed(0)

  return (
    <Box p="8" mt="8" background="white" border borderWidth="1px">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>

      <Link href={`/${post.username}/${post.slug}`}>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span className="push-left">💗 {post.heartCount || 0} Hearts</span>
      </footer>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/admin/${post.slug}`}>
            <h3>
              <Button colorScheme="messenger">Edit</Button>
            </h3>
          </Link>

          {post.published ? <p className="text-success">Live</p> : <p className="text-danger">Unpublished</p>}
        </>
      )}
    </Box>
  )
}

export {PostFeed}
