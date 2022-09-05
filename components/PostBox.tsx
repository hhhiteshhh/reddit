import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import Avatar from './Avatar'
import { LinkIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import { useMutation } from '@apollo/client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutation'
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries'
import client from '../apollo-client'
import toast from 'react-hot-toast'

type FormData = {
  postTitle: string
  postBody: string
  postImage: string
  subreddit: string
}

type Props = {
  subreddit?: string
}
function PostBox({ subreddit }: Props) {
  const { data: session } = useSession()
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POSTS, 'getPostList'],
  })
  const [addSubreddit] = useMutation(ADD_SUBREDDIT)
  // const [addPost] = useMutation(GET_SUBREDDIT_BY_TOPIC)
  const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false)
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = handleSubmit(async (formData) => {
    const notification = toast.loading('Creating new post...')
    try {
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: { topic: subreddit || formData.subreddit },
      })

      const subredditExists = getSubredditListByTopic.length > 0

      if (!subredditExists) {
        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: { topic: formData.subreddit },
        })

        const image = formData.postImage || ''

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        })
      } else {
        const image = formData.postImage || ''

        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        })
      }

      setValue('postBody', '')
      setValue('postImage', '')
      setValue('postTitle', '')
      setValue('subreddit', '')
      toast.success('New post Created!', {
        id: notification,
      })
    } catch (error) {
      toast.error('Whoops something went wrong', {
        id: notification,
      })
      console.log(error)
    }
  })

  return (
    <form
      onSubmit={onSubmit}
      className="sticky top-16 z-50 border rounded-md border-gray-300 p-2 bg-white"
    >
      <div className="flex items-center space-x-3">
        <Avatar />
        <input
          {...register('postTitle', { required: true })}
          disabled={!session}
          className="bg-gray-50 p-2 pl-5 outline-none rounded-md flex-1"
          type="text"
          placeholder={
            session
              ? subreddit
                ? `Create a post in r/${subreddit}`
                : 'Create a post by entering a title!'
              : 'sign in to post'
          }
        />

        <PhotoIcon
          className={`h-6 text-gray-300 cursor-pointer ${
            imageBoxOpen && 'text-blue-300'
          }`}
          onClick={() => {
            setImageBoxOpen(!imageBoxOpen)
          }}
        />
        <LinkIcon className={`h-6 text-gray-300 `} />
      </div>

      {!!watch('postTitle') && (
        <div className="flex flex-col py-2">
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <input
              className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register('postBody')}
              type="text"
              placeholder="Text (optional)"
            ></input>
          </div>
          {!subreddit && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Sub Reddit:</p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register('subreddit', { required: true })}
                type="text"
                placeholder="i.e. reactjs"
              ></input>
            </div>
          )}
          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL:</p>
              <input
                className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register('postImage')}
                type="text"
                placeholder="Optional..."
              ></input>
            </div>
          )}

          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle?.type === 'required' && (
                <p>A Post Title is required.</p>
              )}
              {errors.subreddit?.type === 'required' && (
                <p>A SubReddit is required.</p>
              )}
            </div>
          )}

          {!!watch('postTitle') && (
            <button
              className="w-full rounded-full p-2 text-white bg-blue-400"
              type="submit"
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  )
}

export default PostBox
