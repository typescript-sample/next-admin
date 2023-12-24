import {Attributes} from '../metadata';
import {Filter, SearchResult} from '../model';

export interface SearchService<T, F extends Filter> {
  keys?(): string[];
  search(s: F, limit?: number, offset?: number|string, fields?: string[], ctx?: any): Promise<SearchResult<T>>;
}
export interface Query<T, ID, F extends Filter> extends SearchService<T, F> {
  metadata?(): Attributes|undefined;
  metadata?(): Attributes|undefined;
  load(id: ID, ctx?: any): Promise<T|null>;
}
export interface QueryService<T, ID, F extends Filter> extends SearchService<T, F> {
  metadata?(): Attributes|undefined;
  metadata?(): Attributes|undefined;
  load(id: ID, ctx?: any): Promise<T|null>;
}
export interface QueryRepository<T, ID, F extends Filter> extends SearchService<T, F> {
  metadata?(): Attributes|undefined;
  metadata?(): Attributes|undefined;
  load(id: ID, ctx?: any): Promise<T|null>;
}
