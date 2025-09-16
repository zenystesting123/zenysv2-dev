import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingaddressAndDocdetailsComponent } from './billingaddress-and-docdetails.component';

describe('BillingaddressAndDocdetailsComponent', () => {
  let component: BillingaddressAndDocdetailsComponent;
  let fixture: ComponentFixture<BillingaddressAndDocdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingaddressAndDocdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingaddressAndDocdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
