import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimateManagementComponent } from './estimate-management.component';

describe('EstimateManagementComponent', () => {
  let component: EstimateManagementComponent;
  let fixture: ComponentFixture<EstimateManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimateManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimateManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
