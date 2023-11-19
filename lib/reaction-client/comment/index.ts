import { Comment, CommentService, SComment } from './comment';

export * from './comment';

interface Headers {
  [key: string]: any;
}
interface HttpRequest {
  get<T>(url: string, options?: { headers?: Headers }): Promise<T>;
  delete<T>(url: string, options?: { headers?: Headers }): Promise<T>;
  post<T>(url: string, obj: any, options?: { headers?: Headers }): Promise<T>;
  put<T>(url: string, obj: any, options?: { headers?: Headers }): Promise<T>;
  patch<T>(url: string, obj: any, options?: { headers?: Headers }): Promise<T>;
}
export class CommentClient implements CommentService {
  constructor(protected http: HttpRequest, private url: string) {
    this.getComment = this.getComment.bind(this);
    this.getComments = this.getComments.bind(this);
    this.comment = this.comment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.removeComment = this.removeComment.bind(this);
  }
  getComment(id: string, author: string, commentId: string): Promise<Comment> {
    const url = `${this.url}/${id}/${author}/comments/${commentId}`;
    return this.http.get<Comment>(url).then(comment => {
      if (comment.time) {
        comment.time = new Date(comment.time);
        const h = comment.histories;
        if (h && h.length > 0) {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < h.length; i++) {
            if (h[i].time) {
              h[i].time = new Date(h[i].time);
            }
          }
        }
      }
      return comment;
    });
  }
  getComments(id: string, author: string): Promise<Comment[]> {
    const url = `${this.url}/${id}/${author}/comments`;
    return this.http.get<Comment[]>(url).then(comments => {
      if (comments && comments.length > 0) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < comments.length; j++) {
          const c = comments[j];
          if (c.time) {
            c.time = new Date(c.time);
            const h = comments[j].histories;
            if (h && h.length > 0) {
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < h.length; i++) {
                if (h[i].time) {
                  h[i].time = new Date(h[i].time);
                }
              }
            }
          }
        }
      }
      return comments;
    });
  }
  comment(id: string, author: string, userId: string, comment: SComment): Promise<string> {
    const url = `${this.url}/${id}/${author}/comments/${userId}`;
    return this.http.post(url, comment);
  }
  updateComment(id: string, author: string, userId: string, commentId: string, comment: SComment): Promise<number> {
    const url = `${this.url}/${id}/${author}/comments/${userId}/${commentId}`;
    return this.http.put(url, comment);
  }
  removeComment(id: string, author: string, commentId: string): Promise<number> {
    const url = `${this.url}/${id}/${author}/comments/${commentId}`;
    return this.http.delete(url);
  }
}
