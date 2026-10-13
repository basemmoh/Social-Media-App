export interface ChangePhotoResponseType {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  photo: string
  postId: string
}
