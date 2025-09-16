import { TestBed } from '@angular/core/testing';

import { FieldNameSettingsService } from './field-name-settings.service';

describe('FieldNameSettingsService', () => {
  let service: FieldNameSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldNameSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
