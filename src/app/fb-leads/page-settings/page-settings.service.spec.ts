import { TestBed } from '@angular/core/testing';

import { PageSettingsService } from './page-settings.service';

describe('PageSettingsService', () => {
  let service: PageSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
