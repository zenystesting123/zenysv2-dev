import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingadressAndDocdetailsQuoteComponent } from './billingadress-and-docdetails-quote.component';

describe('BillingadressAndDocdetailsQuoteComponent', () => {
  let component: BillingadressAndDocdetailsQuoteComponent;
  let fixture: ComponentFixture<BillingadressAndDocdetailsQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingadressAndDocdetailsQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingadressAndDocdetailsQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
