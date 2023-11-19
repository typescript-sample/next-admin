export interface StringMap {
  [key: string]: string;
}
export interface Thumbnail {
  thumbnail?: string;
  standardThumbnail?: string;
  mediumThumbnail?: string;
  maxresThumbnail?: string;
  hightThumbnail?: string;
}
export interface FileInfo extends Thumbnail {
  source?: string;
  type: string;
  url: string;
}
