import { TestBed } from '@angular/core/testing';

import { EstimateListService } from './estimate-list.service';

describe('EstimateListService', () => {
  let service: EstimateListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstimateListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
