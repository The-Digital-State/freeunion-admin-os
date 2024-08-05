import { GeneralImagesType } from 'types';
import { api } from './helper';

export const addGeneralImage = async (image: string | ArrayBuffer): Promise<GeneralImagesType[]> => {
  const response = await api().post(`/upload`, { image });
  return response.data.data;
};
