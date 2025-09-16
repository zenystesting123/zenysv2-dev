import { TestBed } from '@angular/core/testing';

import { SharedSalesServService } from './shared-sales-serv.service';

describe('SharedSalesServService', () => {
  let service: SharedSalesServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedSalesServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
