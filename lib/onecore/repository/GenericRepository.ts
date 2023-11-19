import {ViewRepository} from './ViewRepository';

export interface GenericRepository<T, ID> extends ViewRepository<T, ID> {
  insert(obj: T, ctx?: any): Promise<number>;
  update(obj: T, ctx?: any): Promise<number>;
  patch(obj: Partial<T>, ctx?: any): Promise<number>;
  delete(id: ID, ctx?: any): Promise<number>;
}
export interface Repository<T, ID> extends ViewRepository<T, ID> {
  insert(obj: T, ctx?: any): Promise<number>;
  update(obj: T, ctx?: any): Promise<number>;
  patch(obj: Partial<T>, ctx?: any): Promise<number>;
  delete(id: ID, ctx?: any): Promise<number>;
}
