import * as React from 'react';
// import '../carousel.css';

export * from './CarouselVideoItem';

export type OnClick = React.MouseEvent<HTMLElement, MouseEvent>;
interface Props {
  children: React.ReactNode[];
  infiniteLoop: boolean;
}
export interface ImageItemProps {
  src: string;
  alt?: string;
  draggable?: boolean;
}
export function CarouselImageItem(props: ImageItemProps) {
  return (React.createElement("div", { className: 'data-item-gallery' },
  React.createElement("img", { className: 'image-carousel iframe-youtube', src: props.src, alt: props.alt, draggable: props.draggable })));
  /*
  return (
    <div className='data-item-gallery'>
      <img className='image-carousel iframe-youtube' src={props.src} alt={props.alt} draggable={props.draggable} />
    </div>
  );
  */
}
export function Carousel(props: Props) {
  const { children, infiniteLoop } = props;
  const widthItem = React.useRef<number>(0);
  const counter = React.useRef<number>(0); // null
  const slidersLength = React.useRef<number>(0);
  const touchPosition = React.useRef<number>(0); // null
  const slider = React.useRef<HTMLDivElement>(null);
  const sliderContainer = React.useRef<HTMLDivElement>(null);
  const typingTimeoutRef = React.useRef<any>(null);
  const widthFullScreen = React.useRef<number>(0); // null
  const slideContentWrap = React.useRef<HTMLDivElement>(null);
  const widthSlideContentWrap = React.useRef<number>(0);

  React.useEffect(() => {
    if (!widthFullScreen.current || !slideContentWrap.current) { return; }
    widthFullScreen.current = window.screen.width;
    widthSlideContentWrap.current = slideContentWrap.current.offsetWidth;
  }, []);

  React.useLayoutEffect(() => {
    infiniteLoop ? (counter.current = 1) : (counter.current = 0);
    window.addEventListener('resize', handleResize);
    window.addEventListener('mouseup', handleResize);
    window.addEventListener('touchend', handleResize);
    handleWidth();
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handleResize);
      window.removeEventListener('touchend', handleResize);
      clearTimeout(typingTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  const handleResize = () => {
    if (!slideContentWrap.current) { return; }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (
      widthFullScreen.current === window.innerWidth &&
      document.fullscreenElement
    ) {
      return;
    }
    if (widthFullScreen.current !== window.screen.width) {
      widthFullScreen.current = window.screen.width;
      typingTimeoutRef.current = setTimeout(() => {
        handleWidth();
      }, 200);
      widthSlideContentWrap.current = slideContentWrap.current.offsetWidth;
      return;
    }
    if (
      slideContentWrap.current &&
      widthSlideContentWrap.current !== slideContentWrap.current.offsetWidth
    ) {
      typingTimeoutRef.current = setTimeout(() => {
        handleWidth();
      }, 200);
      widthSlideContentWrap.current = slideContentWrap.current.offsetWidth;
      return;
    }
    typingTimeoutRef.current = setTimeout(() => {
      handleWidth();
    }, 200);
  };

  const handleWidth = () => {
    if (!sliderContainer.current || !slideContentWrap.current) { return; }
    const slideItems = sliderContainer.current.children;
    // console.log(slideContentWrap.current.offsetWidth);
    slidersLength.current = slideItems.length;
    widthItem.current = slideContentWrap.current.offsetWidth;
    Array.from(slideItems).forEach((item: Element) => {
      if (
        slideContentWrap &&
        slideContentWrap.current &&
        item instanceof HTMLElement
      ) {
        item.style.width = slideContentWrap.current.offsetWidth + 'px';
      }
    });
    sliderContainer.current.style.width =
      widthItem.current * slidersLength.current + 'px';
    sliderContainer.current.style.transition = 'transform 0.4s ease-in-out';
    sliderContainer.current.style.transform =
      'translate3d(' + -widthItem.current * counter.current + 'px, 0px, 0px)';
  };

  const handleTransitionEnd = () => {
    const sliderParent = document.querySelector('.slider-container');
    // tslint:disable-next-line:no-non-null-assertion
    sliderParent!.querySelectorAll('.data-item-youtube').forEach((child) => {
      const iframe = child.querySelector('iframe');
      if (iframe !== null) {
        // var iframeSrc = iframe.src;
        // iframe.src = iframeSrc;
        iframe.contentWindow?.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
      }
    });
    // tslint:disable-next-line:no-non-null-assertion
    sliderParent!.querySelectorAll('.play-video-wrapper').forEach((child) => {
      const video = child.querySelector('video');
      video?.pause();
    });

    if (!sliderContainer.current) { return; }
    if (sliderContainer.current.children[counter.current].id === 'lastClone') {
      sliderContainer.current.style.transition = 'none';
      counter.current = slidersLength.current - 2;
      sliderContainer.current.style.transform =
        'translate3d(' + -widthItem.current * counter.current + 'px, 0px, 0px)';
    }
    if (sliderContainer.current.children[counter.current].id === 'firstClone') {
      sliderContainer.current.style.transition = 'none';
      counter.current = slidersLength.current - counter.current;
      sliderContainer.current.style.transform =
        'translate3d(' + -widthItem.current * counter.current + 'px, 0px, 0px)';
    }
  };

  const prev = () => {
    if (!sliderContainer.current) { return; }
    if (counter.current <= 0) {
      return;
    }
    sliderContainer.current.style.transition = 'transform 0.4s ease-in-out';
    counter.current--;
    sliderContainer.current.style.transform =
      'translate3d(' + -widthItem.current * counter.current + 'px, 0px, 0px)';
    clearVideo();
  };

  const next = () => {
    if (!sliderContainer.current) { return; }
    if (counter.current >= slidersLength.current - 1) {
      return;
    }
    sliderContainer.current.style.transition = 'transform 0.4s ease-in-out';
    counter.current++;
    sliderContainer.current.style.transform =
      'translate3d(' + -widthItem.current * counter.current + 'px, 0px, 0px)';
    clearVideo();
  };

  const handleDots = (index: any, e: OnClick) => {
    e.preventDefault();
    if (infiniteLoop) {
      index++;
    }
    if (counter.current !== index) {
      counter.current = index;
      // tslint:disable-next-line:no-non-null-assertion
      sliderContainer.current!.style.transition = 'transform 0.4s ease-in-out';
      // tslint:disable-next-line:no-non-null-assertion
      sliderContainer.current!.style.transform =
        'translate3d(' + -widthItem.current * counter.current + 'px, 0px, 0px)';
    }
    clearVideo();
  };

  const handleTouchStart = (e: any) => {
    if (!touchPosition.current) { return; }
    const touchDown = e.touches[0].clientX;
    touchPosition.current = touchDown;
  };

  const handleTouchMove = (e: any) => {
    const touchDown = touchPosition.current;
    if (touchDown === null) {
      return;
    }
    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;
    if (diff > 5) {
      next();
    }
    if (diff < -5) {
      prev();
    }
    touchPosition.current = -1; // null
  };

  const clearVideo = () => {
    if (!sliderContainer.current) { return; }
    const tagVideo =
      sliderContainer.current.querySelector('.slider-items > video') ||
      sliderContainer.current.querySelector('.slider-items > iframe');
    if (tagVideo && tagVideo.parentElement) {
      const tagBtnVideo = tagVideo.parentElement.querySelector('.btn-play');
      const tagThumbnail = tagVideo.parentElement.querySelector(
        '.thumbnail-container'
      );
      if (tagVideo) {
        tagVideo.remove();
        tagBtnVideo?.classList.remove('display-none');
        tagThumbnail?.classList.remove('opacity-0');
      }
    }
  };
  return (React.createElement("div", { className: 'slider', ref: slider },
        children.length > 1 && (React.createElement(React.Fragment, null,
            React.createElement("span", { className: 'btn-prev', onClick: prev }, "<"),
            React.createElement("span", { className: 'btn-next', onClick: next }, ">"))),
        React.createElement("div", { className: 'slider-content-wrapper', ref: slideContentWrap, onTouchStart: handleTouchStart, onTouchMove: handleTouchMove },
            React.createElement("div", { className: 'slider-container', ref: sliderContainer, onTransitionEnd: function () { return handleTransitionEnd(); } },
                infiniteLoop && (React.createElement("div", { className: 'slider-items', id: 'lastClone' }, children[children.length - 1])),
                children.map(function (item, index) { return (React.createElement("div", { className: 'slider-items', key: "slider-items-" + index }, item)); }),
                infiniteLoop && (React.createElement("div", { className: 'slider-items', id: 'firstClone' }, children[0]))))));
/*
  return (
    <div className='slider' ref={slider}>
      {children.length > 1 && (
        <>
          <span className='btn-prev' onClick={prev}>
            &lt;
          </span>
          <span className='btn-next' onClick={next}>
            &gt;
          </span>
        </>
      )}
      <div
        className='slider-content-wrapper'
        ref={slideContentWrap}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div
          className='slider-container'
          ref={sliderContainer}
          onTransitionEnd={() => handleTransitionEnd()}
        >
          {infiniteLoop && (
            <div className='slider-items' id='lastClone'>
              {children[children.length - 1]}
            </div>
          )}
          {children.map((item: ReactNode, index: number) => (
            <div className='slider-items' key={`slider-items-${index}`}>
              {item}
            </div>
          ))}
          {infiniteLoop && (
            <div className='slider-items' id='firstClone'>
              {children[0]}
            </div>
          )}
        </div>
      </div>
      {/* <div className='slider-dots'>
        {
           children.map((item, index) => (
              <button key={index} onClick={(e) => handleDots(index,e)}>
                {index}
              </button>
            ))}
      </div> *}
    </div>
  );
  */
}
