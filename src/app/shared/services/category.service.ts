import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, ListCategoryResponse } from '../models/category.model';
import { Observable, map } from 'rxjs';
import { generateNewCategory } from '../helpers/category.helpers';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private requestURL = 'categories/';

  constructor(private http: HttpClient) {}

  listCategories(): Observable<Category[]> {
    return this.http
      .get<ListCategoryResponse>(this.requestURL)
      .pipe(map((resp) => resp.data.map((elem) => generateNewCategory(elem))));
  }
}
