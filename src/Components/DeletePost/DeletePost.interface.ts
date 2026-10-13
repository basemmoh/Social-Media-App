export interface DeletePostResponseType  {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  post: Post
}

export interface Post {
  _id: string
  body: string
  privacy: string
  user: string
  sharedPost: any
  likes: any[]
  createdAt: string
  image: string
  likesCount: number
  isShare: boolean
  id: string
}
