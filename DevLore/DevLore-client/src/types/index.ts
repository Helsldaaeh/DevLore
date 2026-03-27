export const PostType = {
  Text: 0,
  Interactive: 1
} as const;
export type PostType = typeof PostType[keyof typeof PostType];

export const ReactionType = {
  Like: 1,
  Dislike: 2,
} as const;
export type ReactionType = typeof ReactionType[keyof typeof ReactionType];

export interface User {
  id?: number;
  username: string;
  email: string;
  profile: string;
  roleId: number;
  roleName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  id?: number;
  userId: number;
  username: string; // добавляем
  content: string;
  type: PostType;
  originalPostId?: number | null;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  id?: number;
  userId: number;
  postId: number;
  parentCommentId?: number | null;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Reaction {
  id?: number;
  type: ReactionType;
  userId: number;
  postId?: number | null;
  commentId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Follow {
  id?: number;
  userId: number;
  followedUserId: number;
  followedAt: string;
}

export interface Role {
  id?: number;
  name: string;
}

// Request DTO
export interface RequestPost {
  id?: number;
  userId: number;
  content: string;
  type: PostType;
  originalPostId?: number | null;
  tags?: string[];
}

export interface RequestComment {
  id?: number;
  userId: number;
  postId: number;
  parentCommentId?: number | null;
  content: string;
}

export interface RequestReaction {
  id?: number;
  userId: number;
  type: ReactionType;
  postId?: number | null;
  commentId?: number | null;
}

export interface RequestFollow {
  id?: number;
  userId: number;
  followedUserId: number;
}

export interface RequestUser {
  id?: number;
  username: string;
  email: string;
  password: string;
  profile?: string;
  roleId?: number;
}