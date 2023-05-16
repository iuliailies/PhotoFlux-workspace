import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDashboardModalComponent } from './create-dashboard-modal.component';

describe('CreateDashboardModalComponent', () => {
  let component: CreateDashboardModalComponent;
  let fixture: ComponentFixture<CreateDashboardModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDashboardModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDashboardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
