export interface IResponse {
  success: boolean
  message: string
  data: IData
  meta: IMeta
}

export interface IData {
  posts: IPost[]
}

export interface  IPost {
  _id: string
  body: string
  image?: string
  privacy: string
  user: IUser
  sharedPost: any
  likes: string[]
  createdAt: string
  commentsCount: number
  topComment?: IComment
  sharesCount: number
  likesCount: number
  isShare: boolean
  id: string
  bookmarked: boolean
}

export interface IUser {
  _id: string
  name: string
  photo: string
  username?: string
}

export interface IComment {
  _id: string
  content: string
  commentCreator: IUser
  post: string
  parentComment: any
  likes: any[]
  createdAt: string
}

export interface IMeta {
  pagination: Pagination
}

export interface Pagination {
  currentPage: number
  numberOfPages: number
  limit: number
  nextPage: number
  total: number
}
