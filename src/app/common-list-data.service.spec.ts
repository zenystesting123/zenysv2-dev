import { TestBed } from '@angular/core/testing';

import { CommonListDataService } from './common-list-data.service';

describe('CommonListDataService', () => {
  let service: CommonListDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonListDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
