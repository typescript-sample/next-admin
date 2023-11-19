import {ApprListRepository, ApprListService, ApprRepository, ApprService} from './ApprService';
import {DiffListRepository, DiffListService, DiffRepository, DiffService} from './DiffService';

export interface DiffApprService<T, ID> extends DiffService<T, ID>, ApprService<ID> {

}
export interface DiffApprListService<T, ID> extends DiffListService<T, ID>, ApprListService<ID> {

}

export interface DiffApprRepository<T, ID> extends DiffRepository<T, ID>, ApprRepository<ID> {

}
export interface DiffApprListRepository<T, ID> extends DiffListRepository<T, ID>, ApprListRepository<ID> {

}
