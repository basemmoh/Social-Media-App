import type React from "react"

export interface userAuthContextType {
    userData : UserData | null
    setUserData : React.Dispatch<React.SetStateAction<UserData | null>>
}

export interface USerDataResponseType {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  user: UserData
}

export interface UserData {
  _id: string
  name: string
  username: string
  email: string
  dateOfBirth?: string
  gender?: string
  photo: string
  cover: string
  bookmarks?: any[]
  followers?: any[]
  following?: any[]
  createdAt?: string
  followersCount?: number
  followingCount?: number
  bookmarksCount?: number
  id?: string
}
