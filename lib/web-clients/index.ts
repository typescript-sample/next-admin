import { Attributes, build, DiffStatusConfig, EditStatusConfig, json, jsonArray, MetaModel, resources, SearchConfig } from './json';

export * from './json';

// tslint:disable-next-line:no-empty-interface
export interface Filter {
  // limit?: number;
  // fields?: string[];
}
export interface SearchResult<T> {
  total?: number;
  list: T[];
  nextPageToken?: string;
  last?: boolean;
}
export interface ErrorMessage {
  field: string;
  code: string;
  param?: string | number | Date;
  message?: string;
}
export interface ResultInfo<T> {
  status: number | string;
  errors?: ErrorMessage[];
  value?: T;
  message?: string;
}
export type Result<T> = number | ResultInfo<T>;

export function param(obj: any, fields?: string, excluding?: string): string {
  const ks = Object.keys(obj);
  const arrs: string[] = [];
  if (!fields || fields.length === 0) {
    fields = 'fields';
  }
  if (!excluding || excluding.length === 0) {
    excluding = 'excluding';
  }
  for (const key of ks) {
    if (key === fields) {
      if (Array.isArray(obj[key])) {
        const x = obj[key].join(',');
        const str = encodeURIComponent(key) + '=' + encodeURIComponent(x);
        arrs.push(str);
      }
    } else if (key === excluding) {
      const t2 = obj[key];
      if (typeof t2 === 'object' && Array.isArray(t2)) {
        for (const k2 of t2) {
          const v = t2[k2];
          if (Array.isArray(v)) {
            const arr: string[] = [];
            for (const y of v) {
              if (y) {
                if (typeof y === 'string') {
                  arr.push(y);
                } else if (typeof y === 'number') {
                  arr.push(y.toString());
                }
              }
            }
            const x = arr.join(',');
            const str = encodeURIComponent(`${excluding}.${k2}`) + '=' + encodeURIComponent(x);
            arrs.push(str);
          } else {
            const str = encodeURIComponent(`${excluding}.${k2}`) + '=' + encodeURIComponent(v);
            arrs.push(str);
          }
        }
      }
    } else {
      const v = obj[key];
      if (Array.isArray(v)) {
        const arr: string[] = [];
        for (const y of v) {
          if (y) {
            if (typeof y === 'string') {
              arr.push(y);
            } else if (typeof y === 'number') {
              arr.push(y.toString());
            }
          }
        }
        const x = arr.join(',');
        const str = encodeURIComponent(key) + '=' + encodeURIComponent(x);
        arrs.push(str);
      } else {
        const str = encodeURIComponent(key) + '=' + encodeURIComponent(v);
        arrs.push(str);
      }
    }
  }
  return arrs.join('&');
}

export interface Headers {
  [key: string]: any;
}
export interface HttpOptionsService {
  getHttpOptions(): { headers?: Headers };
}
export interface HttpRequest {
  get<T>(url: string, options?: { headers?: Headers }): Promise<T>;
  delete<T>(url: string, options?: { headers?: Headers }): Promise<T>;
  post<T>(url: string, obj: any, options?: { headers?: Headers }): Promise<T>;
  put<T>(url: string, obj: any, options?: { headers?: Headers }): Promise<T>;
  patch<T>(url: string, obj: any, options?: { headers?: Headers }): Promise<T>;
}

export class DefaultCsvService {
  constructor(private c: any) {
    this._csv = c;
    this.fromString = this.fromString.bind(this);
  }
  private _csv: any;
  fromString(value: string): Promise<string[][]> {
    return new Promise(resolve => {
      this._csv({ noheader: true, output: 'csv' }).fromString(value).then((v: string[][] | PromiseLike<string[][]>) => resolve(v));
    });
  }
}
export function fromString(value: string): Promise<string[][]> {
  const x = resources.csv;
  if (typeof x === 'function') {
    return x(value);
  } else {
    return x.fromString(value);
  }
}
export function optimizeFilter<S extends Filter>(s: S, page?: string, limit?: string, firstLimit?: string): S {
  const ks = Object.keys(s);
  const o: any = {};
  for (const key of ks) {
    const p = (s as any)[key];
    if (key === page) {
      if (p && p >= 1) {
        o[key] = p;
      } else {
        o[key] = 1;
      }
    } else if (key === limit) {
      if (p && p >= 1) {
        o[key] = p;
      }
    } else if (key === firstLimit) {
      if (p && p >= 1) {
        o[key] = p;
      }
    } else {
      if (p && p !== '') {
        o[key] = p;
      }
    }
  }
  // o.includeTotal = true;
  if (limit && firstLimit && o[limit] && o[firstLimit] === o[limit]) {
    delete o[firstLimit];
  }
  if (page && o[page] <= 1) {
    delete o[page];
  }
  for (const key of Object.keys(o)) {
    if (Array.isArray(o[key]) && o[key].length === 0) {
      delete o[key];
    }
  }
  return o;
}
export function fromCsv<T>(m: Filter, csv: string, sfields?: string): Promise<SearchResult<T>> {
  return fromString(csv).then(items => {
    const arr: any[] = [];
    if (!sfields || sfields.length === 0) {
      sfields = 'fields';
    }
    const fields: string[] = (m as any)[sfields];
    if (Array.isArray(fields)) {
      for (let i = 1; i < items.length; i++) {
        const obj: any = {};
        const len = Math.min(fields.length, items[i].length);
        for (let j = 0; j < len; j++) {
          obj[fields[j]] = items[i][j];
        }
        arr.push(obj);
      }
    }
    const x: SearchResult<T> = {
      total: parseFloat(items[0][0]),
      list: arr
      // last: (items[0][0] === '1')
    };
    if (items[0].length > 1 && items[0][1].length > 0) {
      x.nextPageToken = items[0][1];
    }
    return x;
  });
}
// tslint:disable-next-line:max-classes-per-file
export class ViewClient<T, ID> {
  constructor(protected http: HttpRequest, protected serviceUrl: string, pmodel?: Attributes | string[], ignoreDate?: boolean, metamodel?: MetaModel) {
    this.metadata = this.metadata.bind(this);
    this.keys = this.keys.bind(this);
    this.all = this.all.bind(this);
    this.load = this.load.bind(this);
    if (metamodel) {
      this._metamodel = metamodel;
      this._keys = metamodel.keys;
      if (pmodel && !Array.isArray(pmodel)) {
        this.attributes = pmodel;
      }
    } else {
      if (pmodel) {
        if (Array.isArray(pmodel)) {
          this._keys = pmodel;
        } else {
          this.attributes = pmodel;
          const m = build(pmodel, ignoreDate);
          this._metamodel = m;
          this._keys = m.keys;
        }
      } else {
        this._keys = [];
      }
    }
  }
  private _keys: string[] = [];
  protected attributes?: Attributes;
  protected _metamodel?: MetaModel;

  keys(): string[] {
    return this._keys;
  }
  metadata(): Attributes | undefined {
    return this.attributes;
  }

  all(ctx?: any): Promise<T[]> {
    const t = this;
    return t.http.get<T[]>(t.serviceUrl).then(list => {
      if (!t._metamodel) {
        return list;
      }
      return jsonArray(list, t._metamodel);
    });
  }

  load(id: ID, ctx?: any): Promise<T | null> {
    const t = this;
    let url = t.serviceUrl + '/' + id;
    if (t._keys && t._keys.length > 0 && typeof id === 'object') {
      url = t.serviceUrl;
      for (const name of t._keys) {
        url = url + '/' + (id as any)[name];
      }
    }
    return t.http.get<T>(url).then(obj => {
      if (!t._metamodel) {
        return obj;
      }
      return json(obj, t._metamodel);
    }).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      }
      throw err;
    });
  }
}
// tslint:disable-next-line:max-classes-per-file
export class CRUDClient<T, ID, R> extends ViewClient<T, ID> {
  constructor(http: HttpRequest, serviceUrl: string, pmodel?: Attributes | string[], public status?: EditStatusConfig, ignoreDate?: boolean, metamodel?: MetaModel) {
    super(http, serviceUrl, pmodel, ignoreDate, metamodel);
    this.formatResultInfo = this.formatResultInfo.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);
    if (!status) {
      this.status = resources.status;
    }
  }

  protected formatResultInfo(result: any, ctx?: any): any {
    if (this._metamodel && result && typeof result === 'object' && result.status === 1 && result.value && typeof result.value === 'object') {
      result.value = json(result.value, this._metamodel);
    }
    return result;
  }

  insert(obj: T, ctx?: any): Promise<R> {
    const t = this;
    if (t._metamodel) {
      json(obj, t._metamodel);
    }
    return t.http.post<R>(t.serviceUrl, obj).then(res => {
      if (!t._metamodel) {
        return res;
      }
      return t.formatResultInfo(res, ctx);
    }).catch(err => {
      if (err) {
        const data = (err && err.response) ? err.response : err;
        if (data.status === 404 || data.status === 410) {
          let x: any = 0;
          if (t.status && t.status.not_found) {
            x = t.status.not_found;
          }
          return x;
        } else if (data.status === 409) {
          let x: any = -1;
          if (t.status && t.status.version_error) {
            x = t.status.version_error;
          }
          return x;
        }
      }
      throw err;
    });
  }

  update(obj: T, ctx?: any): Promise<R> {
    const t = this;
    let url = t.serviceUrl;
    const ks = t.keys();
    if (ks && ks.length > 0) {
      for (const name of ks) {
        url += '/' + (obj as any)[name];
      }
    }
    return t.http.put<R>(url, obj).then(res => {
      if (!t._metamodel) {
        return res;
      }
      return t.formatResultInfo(res, ctx);
    }).catch(err => {
      if (err) {
        const data = (err && err.response) ? err.response : err;
        if (data.status === 404 || data.status === 410) {
          let x: any = 0;
          if (t.status && t.status.not_found) {
            x = t.status.not_found;
          }
          return x;
        } else if (data.status === 409) {
          let x: any = -1;
          if (t.status && t.status.version_error) {
            x = t.status.version_error;
          }
          return x;
        }
      }
      throw err;
    });
  }

  patch(obj: Partial<T>, ctx?: any): Promise<R> {
    const t = this;
    let url = t.serviceUrl;
    const ks = t.keys();
    if (ks && ks.length > 0) {
      for (const name of ks) {
        url += '/' + (obj as any)[name];
      }
    }
    return t.http.patch<R>(url, obj).then(res => {
      if (!t._metamodel) {
        return res;
      }
      return t.formatResultInfo(res, ctx);
    }).catch(err => {
      if (err) {
        const data = (err && err.response) ? err.response : err;
        if (data.status === 404 || data.status === 410) {
          let x: any = 0;
          if (t.status && t.status.not_found) {
            x = t.status.not_found;
          }
          return x;
        } else if (data.status === 409) {
          let x: any = -1;
          if (t.status && t.status.version_error) {
            x = t.status.version_error;
          }
          return x;
        }
      }
      throw err;
    });
  }

  delete(id: ID, ctx?: any): Promise<number> {
    const t = this;
    let url = this.serviceUrl + '/' + id;
    if (typeof id === 'object' && t.attributes && t.keys) {
      const ks = t.keys();
      if (ks && ks.length > 0) {
        url = t.serviceUrl;
        for (const key of ks) {
          url = url + '/' + (id as any)[key];
        }
      }
    }
    return t.http.delete<number>(url).then(r => r).catch(err => {
      if (err) {
        const data = (err && err.response) ? err.response : err;
        if (data && (data.status === 404 || data.status === 410)) {
          return 0;
        } else if (data.status === 409) {
          return -1;
        }
      }
      throw err;
    });
  }
}
// tslint:disable-next-line:max-classes-per-file
export class GenericClient<T, ID> extends CRUDClient<T, ID, Result<T>> {
  constructor(http: HttpRequest, serviceUrl: string, pmodel?: Attributes | string[], public status?: EditStatusConfig, ignoreDate?: boolean, metamodel?: MetaModel) {
    super(http, serviceUrl, pmodel, status, ignoreDate, metamodel);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class SearchWebClient<T, S extends Filter> {
  constructor(protected http: HttpRequest, protected serviceUrl: string, pmodel?: Attributes | string[], metaModel?: MetaModel, public config?: SearchConfig, ignoreDate?: boolean, protected searchGet?: boolean) {
    this.formatSearch = this.formatSearch.bind(this);
    this.makeUrlParameters = this.makeUrlParameters.bind(this);
    this.postOnly = this.postOnly.bind(this);
    this.search = this.search.bind(this);
    this.keys = this.keys.bind(this);
    if (metaModel) {
      this._metamodel = metaModel;
      this._keys = metaModel.keys;
    } else {
      if (pmodel) {
        if (Array.isArray(pmodel)) {
          this._keys = pmodel;
        } else {
          const m = build(pmodel, ignoreDate);
          this._metamodel = m;
          this._keys = m.keys;
        }
      }
    }
  }
  protected _keys: string[] = [];
  protected _metamodel?: MetaModel;

  protected postOnly(s: S): boolean {
    return false;
  }

  protected formatSearch(s: any) {

  }
  protected makeUrlParameters(s: S, fields?: string, excluding?: string): string {
    return param(s, fields, excluding);
  }
  keys(): string[] {
    return this._keys;
  }
  search(s: S, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<T>> {
    const t = this;
    t.formatSearch(s);
    const c = t.config;
    const sf = (c && c.fields && c.fields.length > 0 ? c.fields : 'fields');
    if (fields && fields.length > 0) {
      if (t._keys && t._keys.length > 0) {
        for (const key of t._keys) {
          if (fields.indexOf(key) < 0) {
            fields.push(key);
          }
        }
      }
      (s as any)[sf] = fields;
    }
    const sl = (c && c.limit && c.limit.length > 0 ? c.limit : 'limit');
    const sp = (c && c.page && c.page.length > 0 ? c.page : 'page');
    (s as any)[sl] = limit;
    if (limit && offset) {
      if (typeof offset === 'string') {
        const sn = (c && c.nextPageToken && c.nextPageToken.length > 0 ? c.nextPageToken : 'nextPageToken');
        (s as any)[sn] = offset;
      } else {
        if (offset >= limit) {
          const page = offset / limit + 1;
          (s as any)[sp] = page;
        }
      }
    }
    const sfl = (c ? c.firstLimit : undefined);
    const s1 = optimizeFilter(s, sp, sl, sfl);
    if (t.postOnly(s1)) {
      const postSearchUrl = t.serviceUrl + '/search';
      return t.http.post(postSearchUrl, s1).then(res => buildSearchResultByConfig(s, res, c, t._metamodel, sf));
    }
    const keys2 = Object.keys(s1);
    if (keys2.length === 0) {
      const searchUrl = (t.searchGet ? t.serviceUrl + '/search' : t.serviceUrl);
      return t.http.get<string | SearchResult<T>>(searchUrl).then(res => buildSearchResultByConfig(s, res, c, t._metamodel, sf));
    } else {
      const excluding = c ? c.excluding : undefined;
      const params = t.makeUrlParameters(s1, sf, excluding);
      let searchUrl = (t.searchGet ? t.serviceUrl + '/search' : t.serviceUrl);
      searchUrl = searchUrl + '?' + params;
      if (searchUrl.length <= 255) {
        return t.http.get<string | SearchResult<T>>(searchUrl).then(res => buildSearchResultByConfig(s, res, c, t._metamodel, sf));
      } else {
        const postSearchUrl = t.serviceUrl + '/search';
        return t.http.post<string | SearchResult<T>>(postSearchUrl, s1).then(res => buildSearchResultByConfig(s, res, c, t._metamodel, sf));
      }
    }
  }
}
export function buildSearchResultByConfig<T, S extends Filter>(s: S, res: string | SearchResult<T> | T[] | any, c?: SearchConfig, metamodel?: MetaModel, sfields?: string): SearchResult<T> | Promise<SearchResult<T>> {
  if (c && c.body && c.body.length > 0) {
    const re = res[c.body];
    return buildSearchResult(s, re, c, metamodel, sfields);
  } else {
    return buildSearchResult(s, res, c, metamodel, sfields);
  }
}
export function buildSearchResult<T, S extends Filter>(s: S, res: string | SearchResult<T> | T[], c?: SearchConfig, metamodel?: MetaModel, sfields?: string): SearchResult<T> | Promise<SearchResult<T>> {
  if (typeof res === 'string') {
    return fromCsv<T>(s, res, sfields);
  } else {
    if (Array.isArray(res)) {
      const result: SearchResult<T> = {
        list: res,
        total: res.length
      };
      if (!metamodel) {
        return result;
      }
      return jsonSearchResult(result, metamodel);
    } else {
      if (!c) {
        if (!metamodel) {
          return res;
        }
        return jsonSearchResult(res, metamodel);
      } else {
        const res2: any = {};
        if (c.list && c.list.length > 0) {
          res2.list = (res as any)[c.list];
        } else {
          res2.list = res.list;
        }
        if (c.total && c.total.length > 0) {
          res2.total = (res as any)[c.total];
        } else {
          res2.total = res.total;
        }
        if (c.last && c.last.length > 0 && (res as any)[c.last]) {
          res2.last = (res as any)[c.last];
        }
        if (!metamodel) {
          return res2;
        }
        return jsonSearchResult(res2, metamodel);
      }
    }
  }
}
export function jsonSearchResult<T>(r: SearchResult<T>, metamodel: MetaModel): SearchResult<T> {
  if (metamodel && r != null && r.list != null && r.list.length > 0) {
    jsonArray(r.list, metamodel);
  }
  return r;
}

export interface DiffModel<T, ID> {
  id?: ID;
  origin?: T;
  value: T;
}
// tslint:disable-next-line:max-classes-per-file
export class DiffClient<T, ID>  {
  constructor(protected http: HttpRequest, protected serviceUrl: string, pmodel?: Attributes | string[], ignoreDate?: boolean, metaModel?: MetaModel) {
    this.diff = this.diff.bind(this);
    if (metaModel) {
      this._metaModel = metaModel;
      this._ids = metaModel.keys;
      if (pmodel && !Array.isArray(pmodel)) {
        this.model = pmodel;
      }
    } else {
      if (pmodel) {
        if (Array.isArray(pmodel)) {
          this._ids = pmodel;
        } else {
          this.model = pmodel;
          const m = build(pmodel, ignoreDate);
          this._metaModel = m;
          this._ids = m.keys;
        }
      } else {
        this._ids = [];
      }
    }
  }
  protected _ids: string[];
  protected model?: Attributes;
  protected _metaModel?: MetaModel;
  keys(): string[] {
    return this._ids;
  }
  diff(id: ID, ctx?: any): Promise<DiffModel<T, ID> | undefined | null> {
    const t = this;
    let url = t.serviceUrl + '/' + id + '/diff';
    if (t._ids && t._ids.length > 0 && typeof id === 'object') {
      url = t.serviceUrl;
      for (const name of t._ids) {
        url = url + '/' + (id as any)[name];
      }
      url = url + '/diff';
    }
    return t.http.get<DiffModel<any, ID>>(url).then(res => {
      if (!res) {
        return null;
      }
      if (!res.value) {
        res.value = {};
      }
      if (typeof res.value === 'string') {
        res.value = JSON.parse(res.value);
      }
      if (!res.origin) {
        res.origin = {};
      }
      if (typeof res.origin === 'string') {
        res.origin = JSON.parse(res.origin);
      }
      if (res.value) {
        json(res.value, t._metaModel);
      }
      if (res.origin) {
        json(res.origin, t._metaModel);
      }
      return res;
    }).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return null;
      } else {
        throw err;
      }
    });
  }
}
// tslint:disable-next-line:max-classes-per-file
export class ApprClient<ID> {
  constructor(protected http: HttpRequest, protected serviceUrl: string, pmodel?: Attributes | string[], public diffStatus?: DiffStatusConfig, ignoreDate?: boolean, metaModel?: MetaModel) {
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
    this.keys = this.keys.bind(this);
    if (metaModel) {
      this._keys = metaModel.keys;
      if (pmodel && !Array.isArray(pmodel)) {
        this.model = pmodel;
      }
    } else {
      if (pmodel) {
        if (Array.isArray(pmodel)) {
          this._keys = pmodel;
        } else {
          this.model = pmodel;
          const m = build(pmodel, ignoreDate);
          this._keys = m.keys;
        }
      } else {
        this._keys = [];
      }
    }
    if (!diffStatus) {
      this.diffStatus = resources.diff;
    }
  }
  protected _keys: string[];
  protected model?: Attributes;
  keys(): string[] {
    return this._keys;
  }

  approve(id: ID, ctx?: any): Promise<number | string> {
    const t = this;
    let url = t.serviceUrl + '/' + id + '/approve';
    if (t._keys && t._keys.length > 0 && typeof id === 'object') {
      url = t.serviceUrl;
      for (const name of t._keys) {
        url = url + '/' + (id as any)[name];
      }
      url = url + '/approve';
    }
    return t.http.patch<number | string>(url, '').then(r => r).catch(err => {
      if (!t.diffStatus) {
        throw err;
      }
      if (err) {
        const data = (err && err.response) ? err.response : err;
        if (data.status === 404 || data.status === 410) {
          return (t.diffStatus.not_found ? t.diffStatus.not_found : 0);
        } else if (data.status === 409) {
          return (t.diffStatus.version_error ? t.diffStatus.version_error : 2);
        }
      }
      if (t.diffStatus.error) {
        return t.diffStatus.error;
      } else {
        throw err;
      }
    });
  }
  reject(id: ID, ctx?: any): Promise<number | string> {
    const t = this;
    let url = t.serviceUrl + '/' + id + '/reject';
    if (t._keys && t._keys.length > 0 && typeof id === 'object') {
      url = t.serviceUrl;
      for (const name of t._keys) {
        url = url + '/' + (id as any)[name];
      }
      url = url + '/reject';
    }
    return t.http.patch<number | string>(url, '').then(r => r).catch(err => {
      if (!t.diffStatus) {
        throw err;
      }
      if (err) {
        const data = (err && err.response) ? err.response : err;
        if (data.status === 404 || data.status === 410) {
          return (t.diffStatus.not_found ? t.diffStatus.not_found : 0);
        } else if (data.status === 409) {
          return (t.diffStatus.version_error ? t.diffStatus.version_error : 2);
        }
      }
      if (t.diffStatus.error) {
        return t.diffStatus.error;
      } else {
        throw err;
      }
    });
  }
}
// tslint:disable-next-line:max-classes-per-file
export class DiffApprClient<T, ID> extends DiffClient<T, ID> {
  constructor(protected http: HttpRequest, protected serviceUrl: string, model?: Attributes | string[], diffStatus?: DiffStatusConfig, ignoreDate?: boolean, metaModel?: MetaModel) {
    super(http, serviceUrl, model, ignoreDate, metaModel);
    this.apprWebClient = new ApprClient(http, serviceUrl, model, diffStatus, ignoreDate, this._metaModel);
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
  }
  private apprWebClient: ApprClient<ID>;
  approve(id: ID, ctx?: any): Promise<number | string> {
    return this.apprWebClient.approve(id, ctx);
  }
  reject(id: ID, ctx?: any): Promise<number | string> {
    return this.apprWebClient.reject(id, ctx);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class SearchClient<T, ID, S extends Filter> extends SearchWebClient<T, S> {
  constructor(http: HttpRequest, serviceUrl: string, model?: Attributes | string[], config?: SearchConfig, ignoreDate?: boolean, searchGet?: boolean, metamodel?: MetaModel) {
    super(http, serviceUrl, model, metamodel, config, ignoreDate, searchGet);
    this.viewWebClient = new ViewClient<T, ID>(http, serviceUrl, model, ignoreDate, this._metamodel);
    this.metadata = this.metadata.bind(this);
    this.keys = this.keys.bind(this);
    this.all = this.all.bind(this);
    this.load = this.load.bind(this);
  }
  protected viewWebClient: ViewClient<T, ID>;

  keys(): string[] {
    return this.viewWebClient.keys();
  }
  metadata(): Attributes | undefined {
    return this.viewWebClient.metadata();
  }

  all(ctx?: any): Promise<T[]> {
    return this.viewWebClient.all(ctx);
  }

  load(id: ID, ctx?: any): Promise<T | null> {
    return this.viewWebClient.load(id, ctx);
  }
}
export const ViewSearchClient = SearchClient;
export const Query = SearchClient;
// tslint:disable-next-line:max-classes-per-file
export class GenericSearchClient<T, ID, R, S extends Filter> extends SearchWebClient<T, S> {
  constructor(http: HttpRequest, serviceUrl: string, model?: Attributes | string[], config?: SearchConfig & EditStatusConfig, ignoreDate?: boolean, searchGet?: boolean, metamodel?: MetaModel) {
    super(http, serviceUrl, model, metamodel, config, ignoreDate, searchGet);
    this.genericWebClient = new CRUDClient<T, ID, R>(http, serviceUrl, model, config, ignoreDate, this._metamodel);
    this.metadata = this.metadata.bind(this);
    this.keys = this.keys.bind(this);
    this.all = this.all.bind(this);
    this.load = this.load.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);
  }
  protected genericWebClient: CRUDClient<T, ID, R>;

  keys(): string[] {
    return this.genericWebClient.keys();
  }
  metadata(): Attributes | undefined {
    return this.genericWebClient.metadata();
  }
  all(ctx?: any): Promise<T[]> {
    return this.genericWebClient.all(ctx);
  }
  load(id: ID, ctx?: any): Promise<T | null> {
    return this.genericWebClient.load(id, ctx);
  }

  insert(obj: T, ctx?: any): Promise<R> {
    return this.genericWebClient.insert(obj, ctx);
  }
  update(obj: T, ctx?: any): Promise<R> {
    return this.genericWebClient.update(obj, ctx);
  }
  patch(obj: T, ctx?: any): Promise<R> {
    return this.genericWebClient.patch(obj, ctx);
  }
  delete(id: ID, ctx?: any): Promise<number> {
    return this.genericWebClient.delete(id, ctx);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class Client<T, ID, F extends Filter> extends GenericSearchClient<T, ID, Result<T>, F> {
  constructor(http: HttpRequest, serviceUrl: string, model?: Attributes | string[], config?: SearchConfig & EditStatusConfig, ignoreDate?: boolean, searchGet?: boolean, metamodel?: MetaModel) {
    super(http, serviceUrl, model, config, ignoreDate, searchGet, metamodel);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class ViewSearchDiffApprClient<T, ID, S extends Filter> extends SearchClient<T, ID, S> {
  constructor(http: HttpRequest, serviceUrl: string, model?: Attributes | string[], config?: SearchConfig & DiffStatusConfig, ignoreDate?: boolean, searchGet?: boolean, metamodel?: MetaModel) {
    super(http, serviceUrl, model, config, ignoreDate, searchGet, metamodel);
    this.diffWebClient = new DiffApprClient(http, serviceUrl, model, config, ignoreDate, this._metamodel);
    this.diff = this.diff.bind(this);
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
  }
  private diffWebClient: DiffApprClient<T, ID>;
  diff(id: ID, ctx?: any): Promise<DiffModel<T, ID> | undefined | null> {
    return this.diffWebClient.diff(id, ctx);
  }
  approve(id: ID, ctx?: any): Promise<number | string> {
    return this.diffWebClient.approve(id, ctx);
  }
  reject(id: ID, ctx?: any): Promise<number | string> {
    return this.diffWebClient.reject(id, ctx);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class CRUDSearchDiffApprClient<T, ID, R, S extends Filter> extends GenericSearchClient<T, ID, R, S> {
  constructor(http: HttpRequest, serviceUrl: string, model?: Attributes | string[], config?: SearchConfig & EditStatusConfig & DiffStatusConfig, ignoreDate?: boolean, searchGet?: boolean, metamodel?: MetaModel) {
    super(http, serviceUrl, model, config, ignoreDate, searchGet, metamodel);
    this.diffWebClient = new DiffApprClient(http, serviceUrl, model, config, ignoreDate, this._metamodel);
    this.diff = this.diff.bind(this);
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
  }
  private diffWebClient: DiffApprClient<T, ID>;
  diff(id: ID, ctx?: any): Promise<DiffModel<T, ID> | undefined | null> {
    return this.diffWebClient.diff(id, ctx);
  }
  approve(id: ID, ctx?: any): Promise<number | string> {
    return this.diffWebClient.approve(id, ctx);
  }
  reject(id: ID, ctx?: any): Promise<number | string> {
    return this.diffWebClient.reject(id, ctx);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class GenericSearchDiffApprClient<T, ID, S extends Filter> extends CRUDSearchDiffApprClient<T, ID, Result<T>, S> {
  constructor(http: HttpRequest, serviceUrl: string, model?: Attributes | string[], config?: SearchConfig & EditStatusConfig & DiffStatusConfig, ignoreDate?: boolean, searchGet?: boolean, metamodel?: MetaModel) {
    super(http, serviceUrl, model, config, ignoreDate, searchGet, metamodel);
  }
}
// tslint:disable-next-line:max-classes-per-file
export class QueryClient<T> {
  keyword: string;
  max: string;
  constructor(public http: HttpRequest, public url: string, keyword?: string, max?: string) {
    this.keyword = (keyword && keyword.length > 0 ? keyword : 'keyword');
    this.max = (max && max.length > 0 ? max : 'max');
    this.query = this.query.bind(this);
  }
  query(keyword: string, max?: number): Promise<T[]> {
    let query = this.url + `?${this.keyword}=${keyword}`;
    if (max && max > 0) {
      query += `&${this.max}=${max}`;
    }
    return this.http.get<T[]>(query).catch(err => {
      const data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return [];
      }
      throw err;
    });
  }
}

export interface BaseRate {
  author: string;
  authorURL?: string;
  rate: number;
}
export interface Rate extends BaseRate {
  id: string;
  time: Date;
  review: string;
  usefulCount: number;
  replyCount: number;
  histories?: ShortRate[];
  rate: number;

  imageURL?:string;
}
export interface ShortRate {
  rate: number;
  time: Date;
  review: string;
}
export interface Filter {
  page?: number;
  limit?: number;
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  currentUserId?: string;

  q?: string;
  keyword?: string;
  excluding?: string[]|number[];
  refId?: string|number;

  pageIndex?: number;
  pageSize?: number;
}
export interface RateFilter extends Filter {
  rateId?: string;
  id?: string;
  author?: string;
  rate?: number;
  time?: Date;
  review?: string;
  usefulCount?: number;
  replyCount?: number;
  userId?: string;
}
export class RatesClient extends SearchWebClient<Rate, RateFilter> {
  constructor(protected http: HttpRequest, protected serviceUrl: string, sg?: boolean, protected po?: boolean) {
    super(http, serviceUrl);
    this.searchGet = sg;
    this.search = this.search.bind(this);
  }
  postOnly(s: RateFilter): boolean {
    return (this.po ? this.po : false);
  }
  search(s: RateFilter, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<Rate>> {
    return super.search(s, limit, offset, fields).then(r => {
      formatTime(r.list);
      return r;
    });
  }
}
export interface STime {
  time?: Date;
}
export interface TimeObject<T extends STime> {
  time?: Date;
  histories?: T[];
}
export function formatTime<T extends STime, K extends TimeObject<T>>(l: K[]) {
  if (l && l.length > 0) {
    for (let i = 0; i < l.length; i++) {
      const c = l[i];
      const h = c.histories;
      if (h && h.length > 0) {
        for (let j = 0; j < h.length; j++) {
          const s = h[j];
          if (s.time) {
            s.time = new Date(s.time);
          }
        }
      }
      if (c.time) {
        c.time = new Date(c.time);
      }
    }
  }
}
export interface SComment {
  userURL?: string;
  comment?: string;
  time?: Date;
  parent?: string;
  replyCount?: number;
  usefulCount?: number;
  authorName?: string;
}
interface ShortComment {
  comment: string;
  time: Date;
}
export interface Comment {
  commentId?: string;
  id?: string;
  author?: string;
  userId?: string;
  userURL?: string;
  comment?: string;
  time?: Date;
  updatedAt?: Date;
  histories?: ShortComment[];
  parent?: string;
  replyCount?: number;
  usefulCount?: number;
  authorName?: string;
}

export interface CommentFilter {
  commentId?: string;
  id?: string;
  author?: string;
  authorURL?: string;
  userId?: string;
  comment?: string;
  time?: Date;
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  limit?: number;
}
export interface CommentsService {
  search(s: CommentFilter, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<Comment>>;
}
export class CommentsClient extends SearchWebClient<Comment, CommentFilter> {
  constructor(protected http: HttpRequest, protected serviceUrl: string, sg?: boolean, protected po?: boolean) {
    super(http, serviceUrl);
    this.searchGet = sg;
    this.search = this.search.bind(this);
  }
  postOnly(s: CommentFilter): boolean {
    return (this.po ? this.po : false);
  }
  search(s: CommentFilter, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<Comment>> {
    return super.search(s, limit, offset, fields).then(r => {
      formatTime(r.list);
      return r;
    });
  }
}
