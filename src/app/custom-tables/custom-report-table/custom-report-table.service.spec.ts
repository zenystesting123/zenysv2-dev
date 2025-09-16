import { TestBed } from '@angular/core/testing';

import { CustomReportTableService } from './custom-report-table.service';

describe('CustomReportTableService', () => {
  let service: CustomReportTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomReportTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
