import { TestBed } from '@angular/core/testing';

import { LeadPurchaseService } from './lead-purchase.service';

describe('LeadPurchaseService', () => {
  let service: LeadPurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadPurchaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
