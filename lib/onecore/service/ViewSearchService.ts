import {Filter} from '../model';
import {SearchService} from './SearchService';
import {ViewService} from './ViewService';

export interface ViewSearchService<T, ID, F extends Filter>
  extends ViewService<T, ID>, SearchService<T, F> {
}
