import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardListItemComponent } from './board-list-item.component';

describe('BoardListItemComponent', () => {
  let component: BoardListItemComponent;
  let fixture: ComponentFixture<BoardListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
