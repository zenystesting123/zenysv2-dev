import { TestBed } from '@angular/core/testing';

import { StripeCheckoutLinkService } from './stripe-checkout-link.service';

describe('StripeCheckoutLinkService', () => {
  let service: StripeCheckoutLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeCheckoutLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
