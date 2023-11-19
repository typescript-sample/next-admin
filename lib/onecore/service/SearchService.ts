import {Filter} from '../model';
import {SearchResult} from '../model';

export interface SearchService<T, F extends Filter> {
  keys?(): string[];
  search(s: F, limit?: number, offset?: number|string, fields?: string[], ctx?: any): Promise<SearchResult<T>>;
}
