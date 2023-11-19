import * as React from 'react';
import { PixelCrop } from 'react-image-crop';
import { FileInfo } from './model';

// const urlGetImg = 'http://localhost:8082/my-profile/image';
export interface State {
  success: boolean;
  loading: boolean;
}

export type UploadType = 'cover' | 'upload' | 'gallery';
interface Props {
  post: <T>(
    url: string,
    obj: any,
    options?:
      | {
        headers?: Headers | undefined;
      }
      | undefined
  ) => Promise<T>;
  setURL?: (u: string) => void;
  type: UploadType;
  url: string;
  id: string;
  aspect: number;
  sizes: number[];
  validateFile?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useUpload = (props: Props) => {
  const [file, setFile] = React.useState<File>();
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>();
  const [image, setImage] = React.useState<HTMLImageElement>();
  const [state, setState] = React.useState<State>({
    success: false,
    loading: false,
  });
  React.useEffect(() => {
    validateFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  React.useEffect(() => {
    console.log('type', props.type);
  }, [props.type]);

  const validateFile = async () => {
    if (props.type === 'gallery') { return; }
    const img = await readFileAsync(file);
    if (!img) { return; }
    for (const size of props.sizes) {
      const height = size / props.aspect;
      if (img.naturalHeight < height || img.naturalWidth < size) {
        if (props.validateFile) {
          props.validateFile(true);
        }
        setFile(undefined);
      }
    }
  };

  const upload = async (id: string): Promise<FileInfo[]> => {
    if (!file) { return []; }
    let fileCustomSizes: File[] = [];
    setState((pre) => ({ ...pre, loading: true }));
    const bodyFormData = new FormData();
    if (props.type !== 'gallery') {
      fileCustomSizes = await resizes(props.sizes);
      bodyFormData.append('files', file);
      fileCustomSizes.forEach((fileCustom) => {
        bodyFormData.append('files', fileCustom);
      });
    } else {
      bodyFormData.append('files', file);
    }

    bodyFormData.append('id', id || '');
    const headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');

    return props
      .post(`${props.url}/${props.id}/${props.type}`, bodyFormData)
      .then(async (res: any) => {
        setState((pre) => ({
          ...pre,
          open: false,
          success: true,
          loading: false,
        }));
        setFile(undefined);
        if (props.setURL) {
          props.setURL(res);
        }
        return res;
      })
      .catch(() => {
        setState((pre) => ({ ...pre, loading: false }));
      });
  };

  function imageInfo(src: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {

      const img = new Image();
      img.onload = (imageEvent) => {
        debugger;
        console.log(img.naturalHeight, img.naturalWidth);
        resolve(img);
      };
      img.onerror = reject;
      // tslint:disable-next-line:no-non-null-assertion
      img.src = src;

    });
  }

  function readFileAsync(fileObj: File | undefined): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = (imageEvent) => {
          resolve(img);
        };
        img.onerror = reject;
        // tslint:disable-next-line:no-non-null-assertion
        img.src = readerEvent.target!.result?.toString() || '';
      };

      reader.onerror = reject;

      if (fileObj) { reader.readAsDataURL(fileObj); }
    });
  }

  const cropImage = async (): Promise<File | undefined> => {
    if (!completedCrop || !file || !image) {
      return;
    }

    // if(!props.isPreview) return
    if (props.aspect === 0) {
      return;
    }
    const canvas: HTMLCanvasElement = document.createElement('canvas');
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
    const imagee = new Image();
    imagee.src = canvas.toDataURL(file?.type);
    const newFile = dataURLtoFile(imagee.src, file?.name ?? '');
    return newFile;
  };

  const resizes = async (sizes: number[]): Promise<File[]> => {
    const croptedFile = await cropImage();
    if (!croptedFile) { return []; }
    const img = await readFileAsync(croptedFile);
    //
    const files: File[] = [];
    sizes.forEach((size) => {
      const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        oc = document.createElement('canvas'),
        octx = oc.getContext('2d');

      canvas.width = size; // destination canvas size
      canvas.height = (canvas.width * img.height) / img.width;
      // var cur = {
      //   width: Math.floor(width * 0.5),
      //   height: Math.floor(height * 0.5),
      // };
      let cur = {
        width: Math.floor(img.width),
        height: Math.floor(img.height),
      };

      oc.width = cur.width;
      oc.height = cur.height;

      // tslint:disable-next-line:no-non-null-assertion
      octx!.drawImage(img, 0, 0, cur.width, cur.height);

      while (cur.width * 0.5 > size) {
        cur = {
          width: Math.floor(cur.width * 0.5),
          height: Math.floor(cur.height * 0.5),
        };
        // tslint:disable-next-line:no-non-null-assertion
        octx!.drawImage(
          oc,
          0,
          0,
          cur.width * 2,
          cur.height * 2,
          0,
          0,
          cur.width,
          cur.height
        );
      }
      // tslint:disable-next-line:no-non-null-assertion
      ctx!.drawImage(
        oc,
        0,
        0,
        cur.width,
        cur.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const imagee = new Image();
      imagee.src = canvas.toDataURL(croptedFile.type);
      const ext = getFileExtension(croptedFile?.name || '');
      const newFile = dataURLtoFile(
        imagee.src,
        removeFileExtension(croptedFile?.name || '') +
        `_${size.toString()}.` +
        ext
      );
      files.push(newFile);
    });
    return files;
  };
  return { file, setFile, state, setState, upload, setCompletedCrop, setImage, imageInfo };
};
/*
export const getImageAvt = async (id: string) => {
  let urlImg = '';
  try {
    const res = await axios.get(urlGetImg + `/${id}`);
    urlImg = res.data;
    return urlImg;
  } catch (e) {
    return urlImg;
  }
};
*/
export const dataURLtoFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/);
  let type = '';
  if (mime) { type = mime[1]; }
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type });
};

export function removeFileExtension(name: string): string {
  const idx: number = name.lastIndexOf('.');
  return idx >= 0 ? name.substring(0, idx) : name;
}

export function appendFileExtension(s: string, ext: string): string {
  return ext.length > 0 ? s + '.' + ext : s;
}

export function getFileExtension(name: string): string {
  const idx: number = name.lastIndexOf('.');
  return idx >= 0 ? name.substring(idx + 1) : '';
}
