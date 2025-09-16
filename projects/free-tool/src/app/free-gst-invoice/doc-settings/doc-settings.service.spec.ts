import { TestBed } from '@angular/core/testing';

import { DocSettingsService } from './doc-settings.service';

describe('DocSettingsService', () => {
  let service: DocSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
