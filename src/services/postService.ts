import apiClient from '../config/axios'

interface CreatePostData {
  content: string
  imageUrl?: string
  tags?: string[]
}

export const createPost = async (data: CreatePostData) => {
  const response = await apiClient.post('/posts', data)
  return response.data
}

export const getAllPosts = async (page = 1, limit = 10) => {
  const response = await apiClient.get('/posts', {
    params: { page, limit }
  })
  return response.data
}

export const likePost = async (postId: string) => {
  const response = await apiClient.post(`/posts/${postId}/like`)
  return response.data
}

export const unlikePost = async (postId: string) => {
  const response = await apiClient.delete(`/posts/${postId}/like`)
  return response.data
}

export const addComment = async (postId: string, content: string) => {
  const response = await apiClient.post(`/posts/${postId}/comments`, { content })
  return response.data
}

export const getPostComments = async (postId: string, page = 1, limit = 20) => {
  const response = await apiClient.get(`/posts/${postId}/comments`, {
    params: { page, limit }
  })
  return response.data
}
