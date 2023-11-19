export type HealthStatus = 'UP' | 'DOWN';
export interface HealthMap {
  [key: string]: Health;
}
export interface Health {
  status: HealthStatus;
  data?: AnyMap;
  details?: HealthMap;
}
export interface AnyMap {
  [key: string]: any;
}
export interface HealthChecker {
  name(): string;
  build(data: AnyMap, error: any): AnyMap;
  check(ctx?: any): Promise<AnyMap>;
}
