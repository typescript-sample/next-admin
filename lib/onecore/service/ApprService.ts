export interface ApprService<ID> {
  approve(id: ID, ctx?: any): Promise<number|string>;
  reject(id: ID, ctx?: any): Promise<number|string>;
}
export interface ApprListService<ID> {
  approve(ids: ID[], ctx?: any): Promise<number|string>;
  reject(ids: ID[], ctx?: any): Promise<number|string>;
}

export interface ApprRepository<ID> {
  approve(id: ID, ctx?: any): Promise<number|string>;
  reject(id: ID, ctx?: any): Promise<number|string>;
}
export interface ApprListRepository<ID> {
  approve(ids: ID[], ctx?: any): Promise<number|string>;
  reject(ids: ID[], ctx?: any): Promise<number|string>;
}
