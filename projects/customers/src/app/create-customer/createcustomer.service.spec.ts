import { TestBed } from '@angular/core/testing';

import { CreatecustomerService } from './createcustomer.service';

describe('CreatecustomerService', () => {
  let service: CreatecustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatecustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
