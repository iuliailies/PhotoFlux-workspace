import {
  RelatedResources,
  ResourceID,
  SelfLink,
  Timestamp,
} from './params.model';

export class Photo {
  file?: File;
  constructor(
    public id: string,
    public attributes: PhotoAttributes,
    public numberStars: number,
    public href: string,
    public categories: string[]
  ) {}

  get link(): string {
    return this.attributes.link;
  }

  get userId(): string {
    return this.attributes.userId;
  }

  get createdAt(): Date {
    return this.attributes.created_at;
  }

  get updatedAt(): Date {
    return this.attributes.updated_at;
  }

  get isUploaded(): boolean {
    return this.attributes.isUploaded;
  }

  set isUploaded(status: boolean) {
    this.attributes.isUploaded = status;
  }
}

export interface Photos {
  data: Photo[];
  numberStars: number;
  numberPhotos: number;
}

export interface PhotoAttributes extends Timestamp {
  link: string;
  userId: string;
  isUploaded: boolean;
}

export interface CreatePhotoRequest {
  category_ids: string[];
}

export interface CreatePhotoResponse {
  data: PhotoData;
}

export interface PhotoData extends ResourceID, SelfLink {
  attributes: PhotoAttributes;
  meta: PhotoMeta;
  relationships: PhotoRelationships;
}

export interface PhotoListItemData extends ResourceID, SelfLink {
  attributes: PhotoAttributes;
  meta: PhotoMeta;
}

export interface PhotoMeta {
  number_stars: number;
  href: string;
}

export interface PhotoListMeta {
  number_stars: number;
  number_photos: number;
}
export interface PhotoRelationships {
  categories: RelatedResources;
}

export interface ListMyPhotoRequest {}

export interface ListMyPhotoResponse {
  data: PhotoListItemData[];
  meta: PhotoListMeta;
  links: SelfLink;
}
