import { TestBed } from '@angular/core/testing';

import { OverallserviceService } from './overallservice.service';

describe('OverallserviceService', () => {
  let service: OverallserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverallserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
