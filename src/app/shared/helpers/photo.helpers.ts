import {
  CreatePhotoResponse,
  Photo,
  PhotoListItemData,
} from '../models/photo.model';

export const generateNewPhoto = (resp: CreatePhotoResponse): Photo => {
  const p = new Photo(
    resp.data.id,
    resp.data.attributes,
    resp.data.meta.number_stars,
    resp.data.meta.href,
    resp.data.relationships.categories.data.map((data) => data.id)
  );

  return p;
};

export const generateNewPhotoFromListItem = (resp: PhotoListItemData): Photo => {
  const p = new Photo(resp.id, resp.attributes, resp.meta.number_stars, resp.meta.href, []);

  return p;
};
