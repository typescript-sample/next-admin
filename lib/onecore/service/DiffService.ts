
import {DiffModel} from '../model';

export interface DiffService<T, ID> {
  keys?(): string[];
  diff(id: ID, ctx?: any): Promise<DiffModel<T, ID>>;
}
export interface DiffListService<T, ID> {
  keys?(): string[];
  // tslint:disable-next-line:array-type
  diff(ids: ID[], ctx?: any): Promise<Array<DiffModel<T, ID>>>;
}

export interface DiffRepository<T, ID> {
  keys?(): string[];
  diff(id: ID, ctx?: any): Promise<DiffModel<T, ID>>;
}
export interface DiffListRepository<T, ID> {
  keys?(): string[];
  // tslint:disable-next-line:array-type
  diff(ids: ID[], ctx?: any): Promise<Array<DiffModel<T, ID>>>;
}
