import { TestBed } from '@angular/core/testing';

import { EmployeeMonthlyReportService } from './employee-monthly-report.service';

describe('EmployeeMonthlyReportService', () => {
  let service: EmployeeMonthlyReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeMonthlyReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
