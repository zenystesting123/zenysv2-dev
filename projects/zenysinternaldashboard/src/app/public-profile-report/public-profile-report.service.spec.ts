import { TestBed } from '@angular/core/testing';

import { PublicProfileReportService } from './public-profile-report.service';

describe('PublicProfileReportService', () => {
  let service: PublicProfileReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicProfileReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
