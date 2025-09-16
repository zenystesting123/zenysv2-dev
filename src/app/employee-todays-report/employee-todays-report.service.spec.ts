import { TestBed } from '@angular/core/testing';

import { EmployeeTodaysReportService } from './employee-todays-report.service';

describe('EmployeeTodaysReportService', () => {
  let service: EmployeeTodaysReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeTodaysReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
