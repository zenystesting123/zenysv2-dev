import { TestBed } from '@angular/core/testing';

import { PaymentReceiptListService } from './payment-receipt-list.service';

describe('PaymentReceiptListService', () => {
  let service: PaymentReceiptListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentReceiptListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
