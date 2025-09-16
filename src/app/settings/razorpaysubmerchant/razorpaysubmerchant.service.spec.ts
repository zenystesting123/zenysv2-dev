import { TestBed } from '@angular/core/testing';

import { RazorpaysubmerchantService } from './razorpaysubmerchant.service';

describe('RazorpaysubmerchantService', () => {
  let service: RazorpaysubmerchantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RazorpaysubmerchantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
