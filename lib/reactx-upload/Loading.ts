import * as React from 'react';
import 'reactx-upload/Loading.css';

export const Loading = () => {
  return (React.createElement('div', { className: 'loading' },
      React.createElement('svg', { viewBox: '0 0 50 50', className: 'spinner' },
          React.createElement('circle', { className: 'ring', cx: '25', cy: '25', r: '22.5' }),
          React.createElement('circle', { className: 'line', cx: '25', cy: '25', r: '22.5' }))));
};
/*
export const Loading = () => {
  return (
    <div className='loading'>
      <svg viewBox='0 0 50 50' className='spinner'>
        <circle className='ring' cx='25' cy='25' r='22.5' />
        <circle className='line' cx='25' cy='25' r='22.5' />
      </svg>
    </div>
  );
};
*/
