export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type GeneralImagesType = {
  file_name?: string;
  mime_type: string;
  size: number;
  thumbnail: string;
  uuid: string;
};
