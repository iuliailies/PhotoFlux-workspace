import { Board, IBoard } from '../models/board.model';

export const generateNewBoard = (resp: IBoard): Board => {
  const p = new Photo(
    resp.data.id,
    resp.data.attributes,
    resp.data.meta.number_stars,
    resp.data.meta.href,
    resp.data.relationships.categories.data.map((data) => data.id)
  );

  return p;
};
