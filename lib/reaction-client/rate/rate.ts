export interface SRate {
  rate?: number;
  review?: string;
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
export interface RateFilter {
  firstLimit?: number;
  fields?: string[];
  sort?: string;
  currentUserId?: string;
  keyword?: string;
  refId?: string | number;
  rateId?: string;
  id?: string;
  author?: string;
  rate?: number;
  time?: Date;
  review?: string;
  usefulCount?: number;
  replyCount?: number;
  userId?: string;
  limit?: number;
  pageSize?: number;
  pageIndex?: number;
  page?: number;
}

export interface RateService {
  rate(id: string, author: string, rate: SRate): Promise<boolean>;
}
export interface SearchResult<T> {
  list: T[];
  total?: number;
  last?: boolean;
  nextPageToken?: string;
}
export interface SearchRateService {
  search(s: RateFilter, limit?: number, offset?: number|string, fields?: string[], ctx?: any): Promise<SearchResult<Rate>>;
}
