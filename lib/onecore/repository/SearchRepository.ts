import {Filter} from '../model';
import {SearchResult} from '../model';

export interface SearchRepository<T, F extends Filter> {
  search(s: F, limit?: number, offset?: number|string, fields?: string[], ctx?: any): Promise<SearchResult<T>>;
}
