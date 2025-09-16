import { TestBed } from '@angular/core/testing';

import { CustomerListGridViewService } from './customer-list-grid-view.service';

describe('CustomerListGridViewService', () => {
  let service: CustomerListGridViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerListGridViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
