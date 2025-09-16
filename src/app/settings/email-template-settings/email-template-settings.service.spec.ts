import { TestBed } from '@angular/core/testing';

import { EmailTemplateSettingsService } from './email-template-settings.service';

describe('EmailTemplateSettingsService', () => {
  let service: EmailTemplateSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailTemplateSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
