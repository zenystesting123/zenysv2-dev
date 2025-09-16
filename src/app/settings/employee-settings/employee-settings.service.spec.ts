import { TestBed } from '@angular/core/testing';

import { EmployeeSettingsService } from './employee-settings.service';

describe('EmployeeSettingsService', () => {
  let service: EmployeeSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
