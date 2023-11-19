export interface CommentReactionService {
  setUseful(commentId: string, author: string, userId: string): Promise<number>;
  removeUseful(commentId: string, author: string, userId: string): Promise<number>;
}

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
export class CommentReactionClient implements CommentReactionService {
  constructor(protected http: HttpRequest, protected url: string, name?: string) {
    this.setUseful = this.setUseful.bind(this);
    this.removeUseful = this.removeUseful.bind(this);
    this.name = (name ? name : 'useful');
  }
  name: string;
  setUseful(
    commentId: string,
    author: string,
    userId: string
  ): Promise<number> {
    const url = `${this.url}/${commentId}/${author}/${this.name}/${userId}`;
    return this.http.post(url, {});
  }
  removeUseful(
    commentId: string,
    author: string,
    userId: string
  ): Promise<number> {
    const url = `${this.url}/${commentId}/${author}/${this.name}/${userId}`;
    return this.http.delete(url);
  }
}
