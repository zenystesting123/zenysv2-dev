import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerListGridViewComponent } from './customer-list-grid-view.component';

describe('CustomerListGridViewComponent', () => {
  let component: CustomerListGridViewComponent;
  let fixture: ComponentFixture<CustomerListGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerListGridViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerListGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
