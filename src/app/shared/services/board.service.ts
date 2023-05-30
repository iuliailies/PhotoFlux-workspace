import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import {
  Board,
  BoardAttributes,
  Cluster,
  CreateBoardResponse,
  GetBoardResponse,
  ListBoardsResponse,
  UpdateBoardResponse,
} from '../models/board.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private requestURL = 'boards/';
  public boardCreated$: Subject<Board> = new Subject<Board>();

  constructor(private http: HttpClient) {}

  listBoards(): Observable<Board[]> {
    return this.http
      .get<ListBoardsResponse>(this.requestURL)
      .pipe(map((resp) => resp.data.map((board) => new Board(board))));
  }

  getBoard(id: string): Observable<Board> {
    return this.http
      .get<GetBoardResponse>(this.requestURL + id)
      .pipe(map((resp) => new Board(resp.data)));
  }

  createBoard(name: string, clusters: Cluster[]): Observable<Board> {
    const req: BoardAttributes = {
      name: name,
      data: clusters,
    };
    return this.http
      .post<CreateBoardResponse>(this.requestURL, { data: JSON.stringify(req) })
      .pipe(map((resp) => new Board(resp.data)));
  }

  updateBoard(id: string, name: string, clusters: Cluster[]): Observable<any> {
    const req: BoardAttributes = {
      name: name,
      data: clusters,
    };
    return this.http.patch<UpdateBoardResponse>(this.requestURL + id, {
      data: JSON.stringify(req),
    });
  }
}
