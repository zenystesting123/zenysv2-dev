import { TestBed } from '@angular/core/testing';

import { EstimatemanagementService } from './estimatemanagement.service';

describe('EstimatemanagementService', () => {
  let service: EstimatemanagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstimatemanagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
