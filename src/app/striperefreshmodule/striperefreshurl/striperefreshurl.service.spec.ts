import { TestBed } from '@angular/core/testing';

import { StriperefreshurlService } from './striperefreshurl.service';

describe('StriperefreshurlService', () => {
  let service: StriperefreshurlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StriperefreshurlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
