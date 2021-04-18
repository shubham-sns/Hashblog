import Link from 'next/link'
import {Box, Divider, Flex, Heading, Text} from '@chakra-ui/layout'

import {formatDate} from '@/utils/misc'
import {Avatar} from '@chakra-ui/avatar'
import {MarkdownRenderer} from './markdown-renderer'

function PostContent({post}) {
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate()

  const wordCount = post?.content.trim().split(/\s+/g).length
  const minutesToRead = (wordCount / 100 + 1).toFixed(0)

  return (
    <>
      <Heading as="h1" mb="4">
        {post.title}
      </Heading>

      <Divider orientation="horizontal" />

      <Flex alignItems="center" justifyContent="space-between" my="2">
        <Flex>
          <Avatar showBorder size="lg" name={post.username} mr="2" color="white" bg="teal.500" />

          <Flex fontSize="sm" color="gray" flexDirection="column">
            <Link href={`/${post.username}`}>
              <Text fontSize="md" color="black">
                {post.username}
              </Text>
            </Link>

            <Text>
              Published on{' '}
              <Text as="span" fontWeight="semibold">
                {formatDate(new Date(createdAt))}
              </Text>
            </Text>

            <Text>
              <Box display="inline" as="svg" fill="currentcolor" w="4" mr="1" viewBox="0 0 512 512">
                <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216zm-148.9 88.3l-81.2-59c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h14c6.6 0 12 5.4 12 12v146.3l70.5 51.3c5.4 3.9 6.5 11.4 2.6 16.8l-8.2 11.3c-3.9 5.3-11.4 6.5-16.8 2.6z" />
              </Box>
              {minutesToRead} min read
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Divider orientation="horizontal" mb="6" />

      <MarkdownRenderer>{post.content}</MarkdownRenderer>
    </>
  )
}

export {PostContent}
