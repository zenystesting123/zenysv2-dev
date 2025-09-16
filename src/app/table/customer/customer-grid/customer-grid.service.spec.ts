import { TestBed } from '@angular/core/testing';

import { CustomerGridService } from './customer-grid.service';

describe('CustomerGridService', () => {
  let service: CustomerGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
