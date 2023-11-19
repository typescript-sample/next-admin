export interface CsvService {
    fromString(value: string): Promise<string[][]>;
  }
  export interface SearchConfig {
    page?: string;
    limit?: string;
    firstLimit?: string;
    total?: string;
    list?: string;
    last?: string;
    body?: string;
    request?: string;
    fields?: string;
    excluding?: string;
    nextPageToken?: string;
  }
  export interface EditStatusConfig {
    duplicate_key?: number|string;
    not_found?: number|string;
    success?: number|string;
    version_error?: number|string;
    error?: number|string;
    data_corrupt?: number|string;
  }
  export interface DiffStatusConfig {
    not_found?: number|string;
    success?: number|string;
    version_error?: number|string;
    error?: number|string;
  }
  // tslint:disable-next-line:class-name
  export class resources {
    static config?: SearchConfig;
    static status?: EditStatusConfig;
    static diff?: DiffStatusConfig;
    static ignoreDate?: boolean;
    static csv: CsvService | ((value: string) => Promise<string[][]>);
  }
  
  export type DataType = 'ObjectId' | 'date' | 'datetime' | 'time'
    | 'boolean' | 'number' | 'integer' | 'string' | 'text'
    | 'object' | 'array' | 'binary'
    | 'primitives' | 'booleans' | 'numbers' | 'integers' | 'strings' | 'dates' | 'datetimes' | 'times';
  
  export interface Attribute {
    name?: string;
    type?: DataType;
    key?: boolean;
    ignored?: boolean;
    typeof?: Attributes;
  }
  export interface Attributes {
    [key: string]: Attribute;
  }
  
  export interface MetaModel {
    attributes: Attributes;
    attributeName?: string;
    keys: string[];
    dateFields?: string[];
    numberFields?: string[];
    objectFields?: MetaModel[];
    arrayFields?: MetaModel[];
  }
  
  export function build(attributes: Attributes, ignoreDate?: boolean): MetaModel {
    /*
    if (model && !model.source) {
      model.source = model.name;
    }
    */
    const primaryKeys: string[] = new Array<string>();
    const dateFields = new Array<string>();
    const numberFields = new Array<string>();
    const objectFields = new Array<MetaModel>();
    const arrayFields = new Array<MetaModel>();
    const ids: string[] = Object.keys(attributes);
    for (const key of ids) {
      const attr: Attribute = attributes[key];
      if (attr) {
        attr.name = key;
        if (attr.ignored !== true) {
          if (attr.key === true) {
            primaryKeys.push(attr.name);
          }
        }
  
        switch (attr.type) {
          case 'datetime': {
            dateFields.push(attr.name);
            break;
          }
          case 'date': {
            if (ignoreDate) {
              dateFields.push(attr.name);
            }
            break;
          }
          case 'number':
          case 'integer': {
            numberFields.push(attr.name);
            break;
          }
          case 'object': {
            if (attr.typeof) {
              const x = build(attr.typeof, ignoreDate);
              x.attributeName = key;
              objectFields.push(x);
            }
            break;
          }
          case 'array': {
            if (attr.typeof) {
              const y = build(attr.typeof, ignoreDate);
              y.attributeName = key;
              arrayFields.push(y);
            }
            break;
          }
          default:
            break;
        }
      }
    }
    const metadata: MetaModel = {attributes, keys: primaryKeys};
    if (primaryKeys.length > 0) {
      metadata.keys = primaryKeys;
    }
    if (dateFields.length > 0) {
      metadata.dateFields = dateFields;
    }
    if (numberFields.length > 0) {
      metadata.numberFields = numberFields;
    }
    if (objectFields.length > 0) {
      metadata.objectFields = objectFields;
    }
    if (arrayFields.length > 0) {
      metadata.arrayFields = arrayFields;
    }
    return metadata;
  }
  
  export function buildKeys(attributes: Attributes): string[] {
    if (!attributes) {
      return [];
    }
    const ids: string[] = Object.keys(attributes);
    const pks: string[] = [];
    for (const key of ids) {
      const attr: Attribute = attributes[key];
      if (attr && attr.ignored !== true && attr.key === true && attr.name && attr.name.length > 0) {
        pks.push(attr.name);
      }
    }
    return pks;
  }
  
  const _datereg = '/Date(';
  const _re = /-?\d+/;
  
  export function jsonToDate(obj: any, fields?: string[]) {
    if (!obj || !fields) {
      return obj;
    }
    if (!Array.isArray(obj)) {
      for (const field of fields) {
        const v = obj[field];
        if (v && !(v instanceof Date)) {
          obj[field] = toDate(v);
        }
      }
    }
  }
  export function jsonToNumber(obj: any, fields?: string[]) {
    if (!obj || !fields) {
      return obj;
    }
    if (!Array.isArray(obj)) {
      for (const field of fields) {
        const v = obj[field];
        if (typeof v === 'string' && !isNaN(v as any)) {
          obj[field] = parseFloat(v);
        }
      }
    }
  }
  function toDate(v: any): Date | null | undefined {
    if (!v) {
      return null;
    }
    if (v instanceof Date) {
      return v;
    } else if (typeof v === 'number') {
      return new Date(v);
    }
    const i = v.indexOf(_datereg);
    if (i >= 0) {
      const m = _re.exec(v);
      if (m !== null) {
        const d = parseInt(m[0], 10);
        return new Date(d);
      } else {
        return null;
      }
    } else {
      if (isNaN(v)) {
        return new Date(v);
      } else {
        const d = parseInt(v, 10);
        return new Date(d);
      }
    }
  }
  
  export function json(obj: any, meta?: MetaModel): any {
    if (!meta) {
      return obj;
    }
    jsonToDate(obj, meta.dateFields);
    jsonToNumber(obj, meta.numberFields);
    if (meta.objectFields) {
      for (const of of meta.objectFields) {
        if (of.attributeName && obj[of.attributeName]) {
          json(obj[of.attributeName], of);
        }
      }
    }
    if (meta.arrayFields) {
      for (const af of meta.arrayFields) {
        if (af.attributeName && obj[af.attributeName]) {
          const arr = obj[af.attributeName];
          if (Array.isArray(arr)) {
            for (const a of arr) {
              json(a, af);
            }
          }
        }
      }
    }
    return obj;
  }
  
  export function jsonArray<T>(list: T[], metaModel: MetaModel): T[] {
    if (!metaModel) {
      return list;
    }
    if (!list || list.length === 0) {
      return list;
    }
    for (const obj of list) {
      json(obj, metaModel);
    }
    return list;
  }
  