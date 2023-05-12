import { Category, CategoryListItemData } from '../models/category.model';

export const generateNewCategory = (resp: CategoryListItemData): Category => {
  const c: Category = {
    id: resp.id,
    name: resp.attributes.name,
    createdAt: resp.attributes.created_at,
    updatedAt: resp.attributes.updated_at,
  };

  return c;
};
