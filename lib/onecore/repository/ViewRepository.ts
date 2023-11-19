import {Attributes} from '../metadata';

export interface ViewRepository<T, ID> {
  metadata?(): Attributes|undefined;
  keys?(): string[];
  load(id: ID, ctx?: any): Promise<T|null>;
}
