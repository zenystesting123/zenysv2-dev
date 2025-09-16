import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSearchPopUpComponent } from './customer-search-pop-up.component';

describe('CustomerSearchPopUpComponent', () => {
  let component: CustomerSearchPopUpComponent;
  let fixture: ComponentFixture<CustomerSearchPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSearchPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSearchPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
