import { Component, Input, OnInit } from '@angular/core';
import { Board } from 'src/app/shared/models/board.model';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-board-list-item',
  templateUrl: './board-list-item.component.html',
  styleUrls: ['./board-list-item.component.sass'],
})
export class BoardListItemComponent implements OnInit {
  @Input() board!: Board;

  constructor() {}

  ngOnInit(): void {}

  get updatedAtFromNow(): string {
    return formatDistanceToNow(new Date(this.board.updatedAt)) + ' ago';
  }
}
