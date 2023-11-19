import * as React from 'react';
// import './rate.css';

export interface Rate {
  rate: number;
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
}
export interface Rate10 {
  rate: number;
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
  rate6: number;
  rate7: number;
  rate8: number;
  rate9: number;
  rate10: number;
}

export const DetailStar5 = (rateInfo?: Rate) => {
  if (!rateInfo) {
    return;
  }
  const list = [];
  const totalRate = rateInfo.rate1 + rateInfo.rate2 + rateInfo.rate3 + rateInfo.rate4 + rateInfo.rate5;
  for (let i = 5; i > 0; i--) {
    const rate = `rate${i}`;
    const value = rateInfo[rate as keyof Rate];
    let percent = 0;
    if (totalRate !== 0) {
      percent = (value * 100) / totalRate;
    }
    const numberStar = Array(i)
      .fill(React.createElement('i', null))
      // tslint:disable-next-line:only-arrow-functions
      .map(function (_, index) {
        return React.createElement('i', { key: index });
      });
    const startDiv = React.createElement('div', { className: 'rv-star' }, numberStar);
    const endDiv = (React.createElement('div', { key: i, className: 'progress' },
      React.createElement('span', { style: { width: percent + '%' } })));
    const rateDiv = (React.createElement('div', { key: i, className: 'detail' },
      startDiv,
      endDiv));
    list.push(rateDiv);
    /*
    const numberStar = Array(i)
      .fill(<i />)
      .map((_, index) => {
        return <i key={index}/>;
      });
    const startDiv = <div className='rv-star'>{numberStar}</div>;
    const endDiv = (
      <div key={i} className='progress'>
        <span style={{ width: `${percent}%` }} />
      </div>
    );
    const rateDiv = (
      <div key={i} className='detail'>
        {startDiv}
        {endDiv}
      </div>
    );
    */
    list.push(rateDiv);
  }
  return list;
};

export const DetailStar10 = (rateInfo?: Rate10) => {
  if (!rateInfo) {
    return;
  }
  const list = [];
  const totalRate =
    rateInfo.rate1 +
    rateInfo.rate2 +
    rateInfo.rate3 +
    rateInfo.rate4 +
    rateInfo.rate5 +
    rateInfo.rate6 +
    rateInfo.rate7 +
    rateInfo.rate8 +
    rateInfo.rate9 +
    rateInfo.rate10;
  for (let i = 10; i > 0; i--) {
    const rate = `rate${i}`;
    const value = rateInfo[rate as keyof Rate10];
    let percent = 0;
    if (totalRate !== 0) {
      percent = (value * 100) / totalRate;
    }
    const numberStar = Array(i)
      .fill(React.createElement('i', null))
      // tslint:disable-next-line:only-arrow-functions
      .map(function (_, index) {
        return React.createElement('i', { key: index });
      });
    const startDiv = React.createElement('div', { className: 'rv-star' }, numberStar);
    const endDiv = (React.createElement('div', { key: i, className: 'progress' },
      React.createElement('span', { style: { width: percent + '%' } })));
    const rateDiv = (React.createElement('div', { className: 'detail' },
      startDiv,
      endDiv));
    /*
    const numberStar = Array(i)
      .fill(<i />)
      .map((_, index) => {
        return <i key={index}/>;
      });
    const startDiv = <div className='rv-star'>{numberStar}</div>;
    const endDiv = (
      <div key={i} className='progress'>
        <span style={{ width: `${percent}%` }} />
      </div>
    );
    const rateDiv = (
      <div className='detail'>
        {startDiv}
        {endDiv}
      </div>
    );*/
    list.push(rateDiv);
  }
  return list;
};
