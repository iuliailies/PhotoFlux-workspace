import { CreatePhotoResponse, Photo } from '../models/photo.model';

export const generateNewPhoto = (resp: CreatePhotoResponse): Photo => {
  const p = new Photo(
    resp.data.id,
    resp.data.attributes,
    resp.data.meta.number_stars,
    resp.data.relationships.categories.data.map((data) => data.id)
  );

  return p;
};
