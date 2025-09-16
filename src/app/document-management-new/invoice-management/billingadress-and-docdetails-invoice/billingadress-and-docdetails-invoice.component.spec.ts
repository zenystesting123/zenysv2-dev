import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingadressAndDocdetailsInvoiceComponent } from './billingadress-and-docdetails-invoice.component';

describe('BillingadressAndDocdetailsInvoiceComponent', () => {
  let component: BillingadressAndDocdetailsInvoiceComponent;
  let fixture: ComponentFixture<BillingadressAndDocdetailsInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingadressAndDocdetailsInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingadressAndDocdetailsInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
