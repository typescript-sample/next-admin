export * from './db';

export * from './formatter';
export * from './metadata';
export * from './cache';
export * from './validator';
export * from './loader';
export * from './model';

import {GenericRepository} from './repository/GenericRepository';

export * from './repository/ViewRepository';
export * from './repository/GenericRepository';
export * from './repository/SearchRepository';
export * from './repository/ViewSearchRepository';
export * from './repository/GenericSearchRepository';

export * from './service/ViewService';
export * from './service/GenericService';
export * from './service/SearchService';
export * from './service/ViewSearchService';
export * from './service/GenericSearchService';
export * from './service/DiffService';
export * from './service/ApprService';
export * from './service/DiffApprService';
export * from './service/GenericSearchDiffApprService';

export * from './mail/model/AttachmentData';
export * from './mail/model/TrackingSettings';
export * from './mail/model/EmailData';
export * from './mail/model/MailData';
export * from './mail/model/MailContent';
export * from './mail/model/PersonalizationData';
export * from './mail/model/MailSettings';
export * from './mail/model/ASMOptions';
export * from './mail/config';

export * from './location';
export * from './video';
export * from './health';
export * from './logger';

export type DeleteFile = (name: string, directory?: string) => Promise<boolean>;
export type Delete = (delFile: DeleteFile, url: string) => Promise<boolean>;
export type BuildUrl = (name: string, directory?: string) => string;
export type Generate = () => string;
export type SaveValues = (values: string[]) => Promise<number>;
export type SaveStrings = (values: string[]) => Promise<number>;
export interface QueryService<T> {
  query(keyword: string, max?: number): Promise<T[]>;
}
export type Get<T> = (keyword: string, max?: number) => Promise<T[]>;
export type Load<T> = (keyword: string, max?: number) => Promise<T[]>;
export type Log = (msg: string) => void;
export type LogFunc = Log;

import { Attributes } from './metadata';
import { Filter, SearchResult } from './model';
// import { GenericRepository } from './repository/GenericRepository';
import { ViewRepository } from './repository/ViewRepository';
import { GenericSearchService } from './service/GenericSearchService';
// import { GenericSearchService } from './service/GenericSearchService';
import { GenericService } from './service/GenericService';
import { ViewSearchService } from './service/ViewSearchService';
import { ViewService } from './service/ViewService';

export type Search<T, F> = (s: F, limit?: number, offset?: number | string, fields?: string[]) => Promise<SearchResult<T>>;
export type SearchFunc<T, F> = Search<T, F>;

export interface KeypairResult {
  rsaEncrypted: string;
  data: {
    shareKey: string;
    salt: string;
  };
}
export interface CryptoOption {
  isEncoded64?: boolean;
  convertKey2Bytes?: boolean;
}
export interface CryptoPort {
  exchangeKeypair: (pk: string) => Promise<KeypairResult>;
  encryptAESMessage: (aesKey: string, salt: string, dataJSON: string,  options?: CryptoOption) => Promise<string>;
  decryptAESMessage: <T>(messageEncrypted: string, clientShKey: string, clientSalt: string, options?: CryptoOption) => Promise<T | string>;
  encrypt: (pk: any, message: string) => string;
  decrypt: (sk: any, data: string) => string;
  encryptAES: (key: string, message: string) => string;
  decryptAES: (key: string, ciphertext: string, iv: string) => string;
  hashHMAC: (key: string, data: string) => string;
  hashData: (text: string) => string;
}
export interface CryptoService {
  exchangeKeypair: (pk: string) => Promise<KeypairResult>;
  encryptAESMessage: (aesKey: string, salt: string, dataJSON: string,  options?: CryptoOption) => Promise<string>;
  decryptAESMessage: <T>(messageEncrypted: string, clientShKey: string, clientSalt: string, options?: CryptoOption) => Promise<T | string>;
  encrypt: (pk: any, message: string) => string;
  decrypt: (sk: any, data: string) => string;
  encryptAES: (key: string, message: string) => string;
  decryptAES: (key: string, ciphertext: string, iv: string) => string;
  hashHMAC: (key: string, data: string) => string;
  hashData: (text: string) => string;
}

export interface ExceptionHandler {
  handleException(rs: string, err: any, i?: number, filename?: string): void;
}
export interface ImportResult {
  total: number;
  success: number;
}
export interface ImportService {
  import(): Promise<ImportResult>;
}
export interface Importer {
  import(): Promise<ImportResult>;
}
export interface Parser<T> {
  parse: (data: string) => Promise<T>;
}
export interface Transformer<T> {
  transform: (data: string) => Promise<T>;
}
export interface ExportService {
  export(ctx?: any): Promise<number>;
}
export interface Exporter {
  export(ctx?: any): Promise<number>;
}
export class ViewManager<T, ID> implements ViewService<T, ID> {
  constructor(private r: ViewRepository<T, ID>) {
    this.metadata = this.metadata.bind(this);
    this.keys = this.keys.bind(this);
    this.load = this.load.bind(this);
  }
  metadata(): Attributes|undefined {
    return (this.r.metadata ? this.r.metadata() : undefined);
  }
  keys(): string[] {
    return (this.r.keys ? this.r.keys() : []);
  }
  load(id: ID, ctx?: any): Promise<T | null> {
    return this.r.load(id, ctx);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class ViewUseCase<T, ID> extends ViewManager<T, ID> {
}
// tslint:disable-next-line:max-classes-per-file
export class DefaultViewService<T, ID> extends ViewManager<T, ID> {
}

// tslint:disable-next-line:max-classes-per-file
export class ViewSearchManager<T, ID, F extends Filter> extends ViewManager<T, ID> implements ViewSearchService<T, ID, F> {
  constructor(public find: Search<T, F>, repo: ViewRepository<T, ID>) {
    super(repo);
    this.search = this.search.bind(this);
  }
  search(s: F, limit?: number, offset?: number|string, fields?: string[]): Promise<SearchResult<T>> {
    return this.find(s, limit, offset, fields);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class ViewSearchUseCase<T, ID, F extends Filter> extends ViewSearchManager<T, ID, F> {
}
// tslint:disable-next-line:max-classes-per-file
export class SearchManager<T, ID, F extends Filter> extends ViewManager<T, ID> implements ViewSearchService<T, ID, F> {
  constructor(protected repository: ViewSearchService<T, ID, F>) {
    super(repository);
    this.search = this.search.bind(this);
  }
  search(s: F, limit?: number, offset?: number|string, fields?: string[]): Promise<SearchResult<T>> {
    return this.repository.search(s, limit, offset, fields);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class SearchUseCase<T, ID, F extends Filter> extends SearchManager<T, ID, F> {
}
// tslint:disable-next-line:max-classes-per-file
export class GenericManager<T, ID> extends ViewManager<T, ID> implements GenericService<T, ID, number> {
  constructor(protected repository: GenericRepository<T, ID>) {
    super(repository);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);
  }
  insert(obj: T, ctx?: any): Promise<number> {
    return this.repository.insert(obj, ctx);
  }
  update(obj: T, ctx?: any): Promise<number> {
    return this.repository.update(obj, ctx);
  }
  patch(obj: Partial<T>, ctx?: any): Promise<number> {
    return (this.repository.patch ? this.repository.patch(obj, ctx) : Promise.resolve(-1));
  }
  delete(id: ID, ctx?: any): Promise<number> {
    return (this.repository.delete ? this.repository.delete(id, ctx) : Promise.resolve(-1));
  }
}
// tslint:disable-next-line:max-classes-per-file
export class GenericUseCase<T, ID> extends GenericManager<T, ID> {
}
// tslint:disable-next-line:max-classes-per-file
export class DefaultGenericService<T, ID> extends GenericManager<T, ID> {
}
// tslint:disable-next-line:max-classes-per-file
export class DefaultService<T, ID> extends GenericManager<T, ID> {
}
// tslint:disable-next-line:max-classes-per-file
export class DefaultGenericSearchService<T, ID> extends GenericManager<T, ID> {
}
// tslint:disable-next-line:max-classes-per-file
export class Manager<T, ID, F extends Filter> extends GenericManager<T, ID> implements GenericSearchService<T, ID, number, F> {
  constructor(public find: Search<T, F>, repo: GenericRepository<T, ID>) {
    super(repo);
    this.search = this.search.bind(this);
  }
  search(s: F, limit?: number, offset?: number|string, fields?: string[]): Promise<SearchResult<T>> {
    return this.find(s, limit, offset, fields);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class UseCase<T, ID, F extends Filter> extends Manager<T, ID, F> {
}
// tslint:disable-next-line:max-classes-per-file
export class GenericSearchManager<T, ID, F extends Filter> extends Manager<T, ID, F> {
}
// tslint:disable-next-line:max-classes-per-file
export class GenericSearchUseCase<T, ID, F extends Filter> extends Manager<T, ID, F> {
}
export interface SavedRepository<ID> {
  load(id: ID): Promise<string[]|null>;
  insert(id: ID, arr: string[]): Promise<number>;
  update(id: ID, arr: string[]): Promise<number>;
}
// tslint:disable-next-line:max-classes-per-file
export class SavedService<ID, T> {
  constructor(protected repository: SavedRepository<ID>, protected query: (ids: string[]) => Promise<T[]>, public max: number, public autoRemove?: boolean) {
    this.load = this.load.bind(this);
    this.save = this.save.bind(this);
    this.remove = this.remove.bind(this);
  }
  load(id: ID): Promise<T[]> {
    return this.repository.load(id).then(items => {
      if (!items || items.length === 0) {
        return [];
      }
      return this.query(items);
    });
  }
  save(id: ID, itemId: string): Promise<number> {
    return this.repository.load(id).then(items => {
      if (items == null) {
        return this.repository.insert(id, [itemId]);
      } else {
        if (items.includes(itemId)) {
          return Promise.resolve(0);
        } else {
          items.push(itemId);
          if (items.length > this.max) {
            if (this.autoRemove) {
              items.shift();
              return this.repository.update(id, items);
            } else {
              return Promise.resolve(-1);
            }
          } else {
            return this.repository.update(id, items);
          }
        }
      }
    });
  }
  remove(id: ID, itemId: string): Promise<number> {
    return this.repository.load(id).then(items => {
      if (items == null) {
        return Promise.resolve(0);
      } else {
        if (items.includes(itemId)) {
          items = items.filter((item: any) => {
            return item !== itemId;
          });
          return this.repository.update(id, items);
        } else {
          return Promise.resolve(0);
        }
      }
    });
  }
}
// tslint:disable-next-line:max-classes-per-file
export class SavedManager<ID, T> extends SavedService<ID, T> {
}
// tslint:disable-next-line:max-classes-per-file
export class SavedUseCase<ID, T> extends SavedService<ID, T> {
}
