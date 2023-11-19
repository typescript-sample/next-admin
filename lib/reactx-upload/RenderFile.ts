import * as React from 'react';
import { FileInfo } from './model';

export const RenderItem = (props: { item: FileInfo }) => {
  if (props.item.type === 'youtube') {
    return (React.createElement('div', { className: 'col xl11 l11 m11 s11' },
      React.createElement('div', { className: 'data-item' },
        React.createElement('iframe', { width: '338', height: '190', src: props.item.url, title: 'YouTube video player', allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;' }))));
  } else if (props.item.type === 'video') {
    return (React.createElement('div', { className: 'col xl11 l11 m11 s11' },
      React.createElement('div', { className: 'data-item' },
        React.createElement('video', { controls: true, className: 'video-uploaded', src: props.item.url }))));
  } else {
    return (React.createElement('div', { className: 'col xl11 l11 m11 s11' },
      React.createElement('div', { className: 'data-item' },
        React.createElement('img', { className: 'image-uploaded', src: props.item.url, alt: 'uploads' }))));
  }
  /*
  if (props.item.type === 'youtube' ) {
    return (
      <div className='col xl11 l11 m11 s11'>
        <div className='data-item'>
        <iframe
          width='338'
          height='190'
          src={props.item.url}
          title='YouTube video player'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;'
        />
      </div>
      </div>
    );
  } else if (props.item.type === 'video') {
    return (
      <div className='col xl11 l11 m11 s11'>
        <div className='data-item'>
          <video controls={true}  className='video-uploaded' src={props.item.url} />
        </div>
      </div>
    );
  } else {
    return (
      <div className='col xl11 l11 m11 s11'>
        <div className='data-item'>
          <img className='image-uploaded' src={props.item.url} alt='uploads'/>
        </div>
      </div>
    );
  }*/
};
