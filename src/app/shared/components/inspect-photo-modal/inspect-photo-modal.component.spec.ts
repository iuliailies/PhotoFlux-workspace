import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectPhotoModalComponent } from './inspect-photo-modal.component';

describe('InspectPhotoModalComponent', () => {
  let component: InspectPhotoModalComponent;
  let fixture: ComponentFixture<InspectPhotoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InspectPhotoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspectPhotoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
