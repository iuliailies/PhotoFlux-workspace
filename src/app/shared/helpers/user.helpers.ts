import { GetUserResponse, User } from '../models/user.model';

export const generateNewUser = (resp: GetUserResponse): User => {
  const u: User = {
    id: resp.data.id,
    name: resp.data.attributes.name,
    email: resp.data.attributes.email,
    createdAt: resp.data.attributes.created_at,
    updatedAt: resp.data.attributes.updated_at,
  };
  return u;
};
