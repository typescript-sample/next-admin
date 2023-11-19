export interface CacheService<K, V> {
  isEnabled?(): boolean;
  put(key: K, obj: V, expiresInSeconds?: number): Promise<boolean>;
  expire(key: K, timeToLive: number): Promise<boolean>;
  get(key: K): Promise<V>;
  getMany(keys: K[]): Promise<V[]>;
  containsKey(key: K): Promise<boolean>;
  remove(key: K): Promise<boolean>;
  clear(): Promise<boolean>;
  keys?(): Promise<string[]>;
  count?(): Promise<number>;
  size?(): Promise<number>;
}

export interface SyncCacheService<K, V> {
  put(key: K, obj: V, expiresInMilliseconds?: number): boolean;
  expire(key: K, timeToLive: number): boolean;
  get(key: K): V;
  getMany(keys: K[]): V[];
  containsKey(key: K): boolean;
  remove(key: K): boolean;
  clear(): boolean;
  keys?(): Promise<string[]>;
  count?(): Promise<number>;
}
