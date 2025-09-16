import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAmountDetailsQuoteComponent } from './billing-amount-details-quote.component';

describe('BillingAmountDetailsQuoteComponent', () => {
  let component: BillingAmountDetailsQuoteComponent;
  let fixture: ComponentFixture<BillingAmountDetailsQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingAmountDetailsQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingAmountDetailsQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
