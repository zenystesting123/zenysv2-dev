import { TestBed } from '@angular/core/testing';

import { CustomTableSettingsService } from './custom-table-settings.service';

describe('CustomTableSettingsService', () => {
  let service: CustomTableSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomTableSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
