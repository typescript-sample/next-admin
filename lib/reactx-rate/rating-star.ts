import * as React from 'react';
import { useState } from 'react';
// import './rate.css';

interface Props {
  rateRange: number;
  setIsOpenRateModal: React.Dispatch<React.SetStateAction<boolean>>;
  setVoteStar: React.Dispatch<React.SetStateAction<number | undefined>>;
  ratingText: string;
}
export const RatingStar = ({ rateRange, setIsOpenRateModal, setVoteStar, ratingText }: Props) => {
  const [currClass, setCurrClass] = useState<string>('');
  const [rateClassName, setRateClassName] = useState<string>();
  const generateRatingClasses = (n: number) => {
    const className = ['rate'];
    for (let i = 1; i <= n; i++) {
      className.push(`star-${i}`);
    }
    return className.join(' ');
  };

  const handleOnclick = (n: number) => {
    setVoteStar(n);
    setIsOpenRateModal(true);
  };
  const handleOnMouseEnter = (n: number) => {
    const rateClass = generateRatingClasses(n);
    setRateClassName(rateClass);
  };
  const handleOnMouseLeave = () => {
    setRateClassName(currClass);
  };
  return (React.createElement('div', { className: 'col s12 m12 l12 rating' },
        React.createElement('p', null, ratingText),
        // tslint:disable-next-line:only-arrow-functions
        React.createElement('div', { className: rateClassName + ' rate' }, Array.from(Array(rateRange).keys()).map(function (item) { return React.createElement('i', { key: item, onClick () { return handleOnclick(item + 1); }, onMouseEnter () { return handleOnMouseEnter(item + 1); }, onMouseLeave () { return handleOnMouseLeave(); } }); }))));
  /*
  return (
    <div className='col s12 m12 l12 rating'>
      <p>{ratingText}</p>
      <div className={rateClassName + ' rate'} >
        {
          Array.from(Array(rateRange).keys()).map(item => <i
            key={item}
            onClick={() => handleOnclick(item + 1)}
            onMouseEnter={() => handleOnMouseEnter(item + 1)}
            onMouseLeave={() => handleOnMouseLeave()}
          />
          )
        }
      </div>
    </div>
  );*/
};
