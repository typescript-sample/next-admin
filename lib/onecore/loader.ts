export interface ValueGenerator<V> {
  generate(param?: any, ctx?: any): V;
}
export interface IdGenerator<T> {
  generate(model: T, ...args: string[]): T;
}

export interface Generator<V> {
  generate(name: V, ctx?: any): V;
  array(name: V, ctx?: any): V[];
}
export interface Loader<V> {
  values(values: V[], ctx?: any): Promise<V[]>;
}
export interface UniqueValueBuilder<T, V> {
  build(model: T, name: string, ctx?: any): Promise<V>;
}

export interface DataLoader<T> {
  loadData(keyWords: string, max: number, ctx?: any): Promise<T[]>;
}
