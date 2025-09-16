import { TestBed } from '@angular/core/testing';

import { OrganisationDetailsService } from './organisation-details.service';

describe('OrganisationDetailsService', () => {
  let service: OrganisationDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganisationDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
