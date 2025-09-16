import { TestBed } from '@angular/core/testing';

import { OrganisationListService } from './organisation-list.service';

describe('OrganisationListService', () => {
  let service: OrganisationListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganisationListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
