import {Filter} from '../model';
import {DiffApprService} from './DiffApprService';
import {GenericSearchService} from './GenericSearchService';

export interface GenericSearchDiffApprService<T, ID, R, F extends Filter> extends GenericSearchService<T, ID, R, F>, DiffApprService<T, ID> {

}
