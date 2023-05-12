import { ResourceID, SelfLink, Timestamp } from './params.model';

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryAttributes extends Timestamp {
  name: string;
}

export interface CategoryListItemData extends ResourceID {
  attributes: CategoryAttributes;
  links: SelfLink;
}

export interface ListCategoryResponse {
  data: CategoryListItemData[];
  //TODO: links
}
