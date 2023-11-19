import * as React from 'react';
// import './rate.css';

interface Props {
  rate: number;
  rateRange: number;
}

const calculatorPercentStar = (rate: number, rateRange: number) => Number((rate * 100) / rateRange);

export const ReviewScore = (p: Props) => {
  return (React.createElement('div', { className: 'col s4 m5 l6 summary' },
        React.createElement('div', { className: 'score' },
            React.createElement('span', null, Math.ceil(p.rate * 100) / 100)),
        React.createElement('div', { className: 'average' },
            React.createElement('div', { className: p.rateRange === 5 ? 'empty-stars' : 'empty-stars-film' }),
            React.createElement('div', { className: p.rateRange === 5 ? 'full-stars' : 'full-stars-film', style: { width: (calculatorPercentStar(p.rate, p.rateRange) || 0) + '%' } }))));
  /*
  return (
    <div className='col s4 m5 l6 summary'>
      <div className='score'>
        <span>{Math.ceil(p.rate * 100) / 100}</span>
      </div>
      <div className='average'>
        <div className={p.rateRange === 5 ? 'empty-stars' : 'empty-stars-film'} />
        <div
          className={p.rateRange === 5 ? 'full-stars' : 'full-stars-film'}
          style={{ width: `${calculatorPercentStar(p.rate, p.rateRange) || 0}%` }}
        />
      </div>
    </div>
  );
  */
};
