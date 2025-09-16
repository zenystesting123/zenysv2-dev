import { TestBed } from '@angular/core/testing';

import { EstimateTableService } from './estimate-table.service';

describe('EstimateTableService', () => {
  let service: EstimateTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstimateTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
