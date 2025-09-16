import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAmountDetailsInvoiceComponent } from './billing-amount-details-invoice.component';

describe('BillingAmountDetailsInvoiceComponent', () => {
  let component: BillingAmountDetailsInvoiceComponent;
  let fixture: ComponentFixture<BillingAmountDetailsInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingAmountDetailsInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingAmountDetailsInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
