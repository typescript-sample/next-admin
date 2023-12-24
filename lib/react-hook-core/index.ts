import * as React from 'react';
export * from './formutil';
export * from './util';
export * from './core';
export * from './state';
export * from './edit';
export * from './route';
export * from './diff';
export * from './merge';
export * from './update';
export * from './useSearch';
export * from './useMessage';
export * from './useEdit';
export * from './search';
export * from './reflect';
export * from './com';

export function checked(s: string[]|string|undefined, v: string): boolean|undefined {
  if (s) {
    if (Array.isArray(s)) {
      return s.includes(v);
    } else {
      return s === v;
    }
  }
  return false;
}
export function value<T>(obj?: T): T {
  return (obj ? obj : {} as any);
}
export interface LoadingProps {
  error?: any;
}
export const Loading = (props: LoadingProps) => {
  const loadingStyle = {
    top: '30%',
    backgroundColor: 'white',
    border: 'none',
    'WebkitBoxShadow': 'none',
    'boxShadow': 'none'
  };
  if (props.error) {
    return React.createElement('div', null, 'Error Load Module!'); // return (<div>Error Load Module!</div>);
  } else {
    return (React.createElement('div', { className: 'loader-wrapper' }, React.createElement('div', { className: 'loader-sign', style: loadingStyle }, React.createElement('div', { className: 'loader' }))));
    /*
    return (
      <div className='loader-wrapper'>
        <div className='loader-sign' style={loadingStyle}>
          <div className='loader' />
        </div>
      </div>
    );*/
  }
};
export type OnClick = React.MouseEvent<HTMLElement, MouseEvent>;
export function formatDate(date: Date | null | undefined, format: string): string {
  if (!date) {
    return '';
  }
  const opts: any = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
  };
  const d2 = new Date(date).toLocaleString("en-US", opts);
  let od = format.replace("YYYY", d2.slice(6, 10));
  od = od.replace("MM", d2.slice(0, 2));
  od = od.replace("DD", d2.slice(3, 5));
  od = od.replace("HH", d2.slice(12, 14));
  od = od.replace("mm", d2.slice(15, 17));
  od = od.replace("ss", d2.slice(18, 20));
  return od;
};
export function dateToString(date: Date | string): string {
  const d2 = typeof date !== "string" ? date : new Date(date);
  const year = d2.getFullYear();
  const month = String(d2.getMonth() + 1).padStart(2, "0");
  const day = String(d2.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
export function datetimeToString(date: Date | string = ""): string {
  const d2 = typeof date !== "string" ? date : new Date(date);
  const year = d2.getFullYear();
  const month = String(d2.getMonth() + 1).padStart(2, "0");
  const day = String(d2.getDate()).padStart(2, "0");
  const hours = String(d2.getHours()).padStart(2, "0");
  const minutes = String(d2.getMinutes()).padStart(2, "0");
  const seconds = String(d2.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
