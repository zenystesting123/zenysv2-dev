import { TestBed } from '@angular/core/testing';

import { PurchasedleadsserviceService } from './purchasedleadsservice.service';

describe('PurchasedleadsserviceService', () => {
  let service: PurchasedleadsserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchasedleadsserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
