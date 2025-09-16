import { TestBed } from '@angular/core/testing';

import { RazorpayservService } from './razorpayserv.service';

describe('RazorpayservService', () => {
  let service: RazorpayservService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RazorpayservService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
