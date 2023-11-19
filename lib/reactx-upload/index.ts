import * as React from 'react';
import { FileInfo } from './model';
import { UploadType } from './UploadHook';

import 'reactx-upload/FileUpload.css';
import 'reactx-upload/Uploads.css';
export * from './CropImage';
export * from './Loading';
export * from './model';
export * from './RenderFile';
export * from './UploadHook';
export * from './UploadModal';

export type TypeFile = 'cover' | 'upload' | 'gallery';
export type OnClick = React.MouseEvent<HTMLElement, MouseEvent>;
export interface DragDropProps {
  list: FileInfo[];
  setList: React.Dispatch<React.SetStateAction<FileInfo[] | undefined>>;
  handleDeleteFile: (url: string, type: string) => Promise<void> | void;
  update: (id: string, data: FileInfo[]) => Promise<number>;
  id: string;
}
interface StringMap {
  [key: string]: string;
}
export interface UploadContainerProps {
  setFileGallery?: (data: FileInfo[]) => void;
  type: UploadType;
  resource?: StringMap;
  setURL?: (u: string) => void;
  post: (
    url: string,
    obj: any,
    options?:
      | {
        headers?: Headers | undefined;
      }
      | undefined
  ) => Promise<any>;
  url: string;
  id: string;
  aspect: number;
  sizes: number[];
}

export interface FileUploadProps {
  type?: UploadType;
  post: (
    url: string,
    obj: any,
    options?:
      | {
        headers?: Headers | undefined;
      }
      | undefined
  ) => Promise<any>;
  url: string;
  id: string;
  sizes: number[];
  setGallery?: (file: FileInfo[]) => void;
  getGalllery?: (id: string) => Promise<FileInfo[]>;
  uploadExternalResource: (id: string, videoId: string) => Promise<number>;
  deleteFileYoutube: (id: string, fileUrl: string) => Promise<number>;
  deleteFile: (id: string, fileUrl: string) => Promise<number>;
  update: (id: string, data: FileInfo[]) => Promise<number>;
}
