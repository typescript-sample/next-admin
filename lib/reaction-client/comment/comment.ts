export interface SComment {
  userURL?: string;
  comment?: string;
  time?: Date;
  parent?: string;
  replyCount?: number;
  usefulCount?: number;
  authorName?: string;
}
interface ShortComment {
  comment: string;
  time: Date;
}
export interface Comment {
  commentId?: string;
  id?: string;
  author?: string;
  userId?: string;
  userURL?: string;
  comment?: string;
  time?: Date;
  updatedAt?: Date;
  histories?: ShortComment[];
  parent?: string;
  replyCount?: number;
  usefulCount?: number;
  authorName?: string;
}

export interface CommentFilter {
  commentId?: string;
  id?: string;
  author?: string;
  authorURL?: string;
  userId?: string;
  comment?: string;
  time?: Date;
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  limit?: number;
}

export interface CommentService {
  getComments(id: string, author: string, ctx?: any): Promise<Comment[]>;
  getComment(id: string, author: string, userId: string, ctx?: any): Promise<Comment>;
  comment(id: string, author: string, userId: string, comment: SComment, ctx?: any): Promise<string>;
  updateComment(id: string, author: string, userId: string, commentId: string, comment: SComment, ctx?: any): Promise<number>;
  removeComment(id: string, author: string, userId: string, ctx?: any): Promise<number>;
}
