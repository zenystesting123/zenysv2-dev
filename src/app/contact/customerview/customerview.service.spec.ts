import { TestBed } from '@angular/core/testing';

import { CustomerviewService } from './customerview.service';

describe('CustomerviewService', () => {
  let service: CustomerviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
