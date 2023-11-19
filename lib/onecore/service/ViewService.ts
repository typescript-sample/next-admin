import {Attributes} from '../metadata';

export interface ViewService<T, ID> {
  metadata?(): Attributes|undefined;
  keys?(): string[];
  load(id: ID, ctx?: any): Promise<T|null>;
}
