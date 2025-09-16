import { TestBed } from '@angular/core/testing';

import { DatacardSettingsService } from './datacard-settings.service';

describe('DatacardSettingsService', () => {
  let service: DatacardSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatacardSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
