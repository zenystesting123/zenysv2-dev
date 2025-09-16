import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReceiptListComponent } from './payment-receipt-list.component';

describe('PaymentReceiptListComponent', () => {
  let component: PaymentReceiptListComponent;
  let fixture: ComponentFixture<PaymentReceiptListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentReceiptListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentReceiptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
