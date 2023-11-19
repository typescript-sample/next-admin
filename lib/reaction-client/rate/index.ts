
import { RateService, SRate } from './rate';

export * from './rate';

export interface Headers {
  [key: string]: any;
}
export interface HttpRequest {
  get<T>(url: string, options?: { headers?: Headers }): Promise<T>;
  delete<T>(url: string, options?: { headers?: Headers }): Promise<T>;
  post<T>(url: string, obj: any, options?: { headers?: Headers }): Promise<T>;
  put<T>(url: string, obj: any, options?: { headers?: Headers }): Promise<T>;
  patch<T>(url: string, obj: any, options?: { headers?: Headers }): Promise<T>;
}

export class RateClient implements RateService {
  constructor(protected http: HttpRequest, protected serviceUrl: string) {
    this.rate = this.rate.bind(this);
  }
  rate(id: string, author: string, rate: SRate): Promise<boolean> {
    const url = `${this.serviceUrl}/${id}/${author}`;
    return this.http.post(url, rate);
  }
}
