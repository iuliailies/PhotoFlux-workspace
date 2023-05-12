import { ResourceID, SelfLink, Timestamp } from './params.model';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAttributes extends Timestamp {
  name: string;
  email: string;
}

export interface UserData extends ResourceID {
  attributes: UserAttributes;
  links: SelfLink;
}

export interface GetUserResponse {
  data: UserData;
}
