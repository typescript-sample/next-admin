import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';

export interface CropImageProps {
  image: File;
  setCropImage: React.Dispatch<React.SetStateAction<string>>;
  isPreview: boolean;
  aspect: number;
  setCompletedCropHook: React.Dispatch<React.SetStateAction<PixelCrop | undefined>>;
  setImage: React.Dispatch<React.SetStateAction<HTMLImageElement | undefined>>;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 100,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function CropImage(props: CropImageProps) {
  const [upImg, setUpImg] = useState<any>();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale] = useState(1);
  const [rotate] = useState(0);
  useEffect(() => {
    onSelectFile(props.image);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelectFile = (file: Blob) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => setUpImg(reader.result));
    reader.readAsDataURL(file);
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (props.aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, props.aspect));
    }
  }

  React.useEffect(() => {
    props.setCompletedCropHook(completedCrop);
    props.setImage(imgRef.current ?? undefined);
    cropImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedCrop, props.isPreview]);

  const cropImage = () => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }
    if (!props.isPreview) { return; }
    const image: HTMLImageElement = imgRef.current as any;
    const canvas: HTMLCanvasElement = previewCanvasRef.current as any;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) { return; }
    const pixelRatio = window.devicePixelRatio;

    canvas.width = completedCrop.width * pixelRatio;
    canvas.height = completedCrop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
  };
  return (React.createElement('div', { className: 'Crop-Image' },
  React.createElement(ReactCrop, { aspect: props.aspect, crop, onChange (_, percentCrop) { return setCrop(percentCrop); }, onComplete (c) { return setCompletedCrop(c); } },
      React.createElement('img', { ref: imgRef, src: upImg, alt: '', onLoad: onImageLoad, style: { transform: 'scale(' + scale + ') rotate(' + rotate + 'deg)' } })),
  React.createElement('div', { style: { display: props.isPreview ? 'block' : 'none' } },
      React.createElement('canvas', { ref: previewCanvasRef, style: {
              width: Math.round(completedCrop && completedCrop.width ? completedCrop.width : 0),
              height: Math.round(completedCrop && completedCrop.height ? completedCrop.height : 0),
          } }))));
/*
  return (
    <div className='Crop-Image'>
      <ReactCrop
        aspect={props.aspect}
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={(c: PixelCrop) => setCompletedCrop(c)}
      >
        <img
          ref={imgRef}
          src={upImg}
          alt=''
          onLoad={onImageLoad}
          style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
        />
      </ReactCrop>

      <div style={{ display: props.isPreview ? 'block' : 'none' }}>
        <canvas
          ref={previewCanvasRef}
          style={{
            width: Math.round(
              completedCrop && completedCrop.width ? completedCrop.width : 0
            ),
            height: Math.round(
              completedCrop && completedCrop.height ? completedCrop.height : 0
            ),
          }}
        />
      </div>
    </div>
  );*/
}
