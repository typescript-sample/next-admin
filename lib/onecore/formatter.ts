export interface Locale {
  id?: string;
  countryCode: string;
  dateFormat: string;
  firstDayOfWeek: number;
  decimalSeparator: string;
  groupSeparator: string;
  decimalDigits: number;
  currencyCode: string;
  currencySymbol: string;
  currencyPattern: number;
  currencySample?: string;
}

export interface StringFormatter<T> {
  format(obj: T): string;
}
export interface LocaleStringFormatter<T> {
  format(obj: T, locale: Locale): string;
}

export interface Formatter<T> {
  format(obj: T): T;
}
export interface LocaleFormatter<T> {
  format(obj: T, locale: Locale): T;
}

export interface Mapper<T, K> {
  map(obj: T): K;
}

export interface LocaleMapper<T, K> {
  map(obj: T, locale: Locale): K;
}
