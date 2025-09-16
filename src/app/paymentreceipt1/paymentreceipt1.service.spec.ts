import { TestBed } from '@angular/core/testing';

import { Paymentreceipt1Service } from './paymentreceipt1.service';

describe('PaymentreceiptService', () => {
  let service: Paymentreceipt1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Paymentreceipt1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
