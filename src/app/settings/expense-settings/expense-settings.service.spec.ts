import { TestBed } from '@angular/core/testing';

import { ExpenseSettingsService } from './expense-settings.service';

describe('ExpenseSettingsService', () => {
  let service: ExpenseSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
