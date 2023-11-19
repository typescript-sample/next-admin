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
export * from './components';
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
