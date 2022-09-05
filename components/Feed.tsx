import { useQuery } from '@apollo/client'
import React from 'react'
import { GET_ALL_POSTS, GET_ALL_POSTS_BY_TOPIC } from '../graphql/queries'
import Post from './Post'

type Props = {
  topic?: string
}

function Feed({ topic }: Props) {
  const { data, error } = useQuery(GET_ALL_POSTS)

  const posts: Post[] = !topic
    ? data?.getPostList
    : data?.getPostList.filter((post: [Post]) => post.subreddit.topic === topic)

  return (
    <div className="mt-5 space-y-4 w-full">
      {posts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}

export default Feed
