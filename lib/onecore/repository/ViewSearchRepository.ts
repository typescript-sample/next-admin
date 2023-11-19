import {Filter} from '../model';
import {SearchRepository} from './SearchRepository';
import {ViewRepository} from './ViewRepository';

export interface ViewSearchRepository<T, ID, F extends Filter>
  extends ViewRepository<T, ID>, SearchRepository<T, F> {
}
