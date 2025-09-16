import { TestBed } from '@angular/core/testing';

import { OrganisationSettingService } from './organisation-setting.service';

describe('OrganisationSettingService', () => {
  let service: OrganisationSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganisationSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
