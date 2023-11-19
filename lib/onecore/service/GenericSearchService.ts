import {Filter, Result} from '../model';
import {GenericService} from './GenericService';
import {SearchService} from './SearchService';

export interface GenericSearchService<T, ID, R, F extends Filter>
  extends GenericService<T, ID, R>, SearchService<T, F> {
}
export interface Service<T, ID, F extends Filter> extends GenericSearchService<T, ID, Result<T>, F> {

}
