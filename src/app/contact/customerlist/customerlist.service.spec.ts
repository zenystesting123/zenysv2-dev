import { TestBed } from '@angular/core/testing';

import { CustomerlistService } from './customerlist.service';

describe('CustomerlistService', () => {
  let service: CustomerlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
