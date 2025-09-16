import { TestBed } from '@angular/core/testing';

import { LeadCaptureSettingsService } from './lead-capture-settings.service';

describe('LeadCaptureSettingsService', () => {
  let service: LeadCaptureSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadCaptureSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
