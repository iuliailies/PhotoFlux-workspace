import { Component, Input, OnInit } from '@angular/core';
import { Board } from 'src/app/shared/models/board.model';

@Component({
  selector: 'app-board-list-item',
  templateUrl: './board-list-item.component.html',
  styleUrls: ['./board-list-item.component.sass'],
})
export class BoardListItemComponent implements OnInit {
  @Input() board!: Board;

  constructor() {}

  ngOnInit(): void {}
}
