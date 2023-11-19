import {Filter} from '../model';
import {GenericRepository} from './GenericRepository';
import {SearchRepository} from './SearchRepository';

export interface GenericSearchRepository<T, ID, F extends Filter>
  extends GenericRepository<T, ID>, SearchRepository<T, F> {
}
