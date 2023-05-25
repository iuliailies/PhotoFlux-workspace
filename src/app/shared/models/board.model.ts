import { ResourceID, Timestamp } from './params.model';
import { Photo } from './photo.model';

export interface IPoint {
  x: number;
  y: number;
}

export class Board {
  photos: Photo[][] = [];
  attributes: BoardAttributes;

  constructor(public board: IBoard) {
    this.attributes = JSON.parse(this.board.data) as BoardAttributes;
  }

  get id(): string {
    return this.board.id;
  }

  get name(): string {
    return this.attributes.name;
  }

  get categoryIds(): string[] {
    return this.attributes.data.map((elem) => elem.category);
  }

  get createdAt(): Date {
    return this.board.created_at;
  }

  get updatedAt(): Date {
    return this.board.updated_at;
  }

  get clusters(): Cluster[] {
    return this.attributes.data;
  }
}

export interface IBoard extends ResourceID, Timestamp {
  userId: string;
  data: string;
}

export interface BoardAttributes {
  name: string;
  data: Cluster[];
}

export interface Cluster {
  category: string;
  position: IPoint;
}

const attr: BoardAttributes = {
  name: 'My dummy board',
  data: [
    {
      category: '6ff419e1-3708-4667-b125-269e90895d00',
      position: {
        x: 100,
        y: 100,
      },
    },
  ],
};

export interface GetBoardResponse {
  data: IBoard;
}

export interface ListBoardsResponse {
  data: IBoard[];
}

export interface CreateBoardRequest {
  data: string;
}

export interface CreateBoardResponse {
  data: IBoard;
}

export interface UpdateBoardRequest {
  data: string;
}

export interface UpdateBoardResponse {
  data: string;
}
