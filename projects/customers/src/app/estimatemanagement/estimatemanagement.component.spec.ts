import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimatemanagementComponent } from './estimatemanagement.component';

describe('EstimatemanagementComponent', () => {
  let component: EstimatemanagementComponent;
  let fixture: ComponentFixture<EstimatemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstimatemanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimatemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
