import * as React from 'react';
import { useState } from 'react';
import { PixelCrop } from 'react-image-crop';
import CropImage from './CropImage';
import { Loading } from './Loading';
import { StringMap } from './model';
import { dataURLtoFile,  State } from './UploadHook';

type OnClick = React.MouseEvent<HTMLElement, MouseEvent>;
interface Props {
  file: File | undefined;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  upload: () => Promise<void>;
  state: State;
  aspect: number;
  setCompletedCrop: React.Dispatch<React.SetStateAction<PixelCrop | undefined>>;
  setImage: React.Dispatch<React.SetStateAction<HTMLImageElement | undefined>>;
  resource?: StringMap;
}

export const UploadsModal = (props: Props) => {
  const [cropImage, setCropImage] = useState<string>('');
  const [select, setSelect] = useState<boolean>(false);
  const [isCrop, setIsCrop] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState(false);
  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const data = event.target.files;
    if (!data) {
      return;
    }
    const fileUpload = data[0];
    if (fileUpload) {
      props.setFile(fileUpload);
    }
  };
  const handleDelete = () => {
    props.setFile(undefined);
    if (cropImage) {
      setCropImage('');
      setSelect(false);
      setIsCrop(false);
    }
  };

  const handleSelectCropImage = (e: OnClick) => {
    e.preventDefault();
    if (cropImage && props.file) {
      props.setFile(dataURLtoFile(cropImage, props.file.name));
      setIsCrop(true);
      setSelect(true);
    }
  };

  const togglePreview = (e: OnClick) => {
    e.preventDefault();
    setIsPreview(!isPreview);
  };
  return (React.createElement('div', { className: 'upload-modal' },
  React.createElement('div', { className: 'frame' },
      React.createElement('div', { className: 'center' }, props.file && props.file !== null ? (React.createElement(React.Fragment, null,
          React.createElement('p', { className: 'file-name' }, props.file.name),
          React.createElement('button', { onClick: togglePreview }, props.resource ? props.resource.button_preview : 'Preview'),
          React.createElement('div', { className: 'preview-image' }, (props.file.type === 'image/jpeg' || props.file.type === 'image/png') &&
              React.createElement('div', null, select ? (React.createElement('img', { className: 'image-cut', src: URL.createObjectURL(props.file), alt: 'file' })) : (React.createElement(React.Fragment, null,
                  React.createElement(CropImage, { setImage: props.setImage, setCompletedCropHook: props.setCompletedCrop, aspect: props.aspect, image: props.file, setCropImage, isPreview }),
                  React.createElement('button', { onClick (e: OnClick) { return handleSelectCropImage(e); } }, props.resource ? props.resource.button_select : 'Select'))))),
          React.createElement('div', { className: 'row btn-area' },
              props.state.loading ? (React.createElement('div', { className: 'loading col xl5 md5 s5', style: { position: 'relative' } },
                  React.createElement(Loading, null))) : (React.createElement('button', { disabled: props.file.type === 'image' && !isCrop, className: 'btn col xl5 md5 s5', type: 'button', onClick () { return props.upload(); } }, props.resource ? props.resource.button_upload : 'Upload')),
              React.createElement('button', { disabled: props.state.loading, className: 'btn remove col xl5 md5 s5', type: 'button', onClick: handleDelete }, props.resource ? props.resource.button_remove : 'Remove')))) : (React.createElement(React.Fragment, null,
          React.createElement('div', { className: 'title' },
              React.createElement('h1', null, props.resource ? props.resource.drop_file_to_upload : 'Drop file to upload')),
          React.createElement('div', { className: 'dropzone' },
              React.createElement('label', { className: 'area', htmlFor: 'upload' },
                  React.createElement('div', null,
                      React.createElement('img', { alt: 'upload', src: 'http://100dayscss.com/codepen/upload.svg', className: 'upload-icon' }),
                      React.createElement('p', null, props.resource ? props.resource.or_click_here : 'Or Click Here!'),
                      React.createElement('input', { id: 'upload', type: 'file', accept: '*', className: 'upload-input', onChange: handleSelectFile }))))))))));
  /*
  return (
    <div className='upload-modal'>
      <div className='frame'>
        <div className='center'>
          {props.file && props.file !== null ? (
            <>
              <p className='file-name'>{props.file.name}</p>
              <button onClick={togglePreview}>{props.resource ? props.resource.button_preview : 'Preview'}</button>
              <div className='preview-image'>
                {(props.file.type === 'image/jpeg' || props.file.type === 'image/png') &&
                  <div>
                    {
                      select ? (
                        <img className='image-cut' src={URL.createObjectURL(props.file)} alt='file' />
                      ) : (
                        <>
                          <CropImage setImage={props.setImage} setCompletedCropHook={props.setCompletedCrop} aspect={props.aspect} image={props.file} setCropImage={setCropImage} isPreview={isPreview} />
                          <button onClick={(e) => handleSelectCropImage(e)}>{props.resource ? props.resource.button_select : 'Select'}</button>
                        </>
                      )
                    }
                  </div>
                }
              </div>
              <div className='row btn-area'>
                {props.state.loading ? (
                  <div className='loading col xl5 md5 s5' style={{ position: 'relative' }}>
                    <Loading />
                  </div>
                ) : (
                  <button disabled={props.file.type === 'image' && !isCrop} className='btn col xl5 md5 s5' type='button' onClick={() => props.upload()}>
                    {props.resource ? props.resource.button_upload : 'Upload'}
                  </button>
                )}
                <button disabled={props.state.loading} className='btn remove col xl5 md5 s5' type='button' onClick={handleDelete}>
                  {props.resource ? props.resource.button_remove : 'Remove'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className='title'>
                <h1>{props.resource ? props.resource.drop_file_to_upload : 'Drop file to upload'}</h1>
              </div>
              <div className='dropzone'>
                <label className='area' htmlFor='upload'>
                  <div>
                    <img alt='upload' src='http://100dayscss.com/codepen/upload.svg' className='upload-icon' />
                    <p>{props.resource ? props.resource.or_click_here : 'Or Click Here!'}</p>
                    <input id='upload' type='file' accept={`*`} className='upload-input' onChange={handleSelectFile} />
                  </div>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );*/
};
