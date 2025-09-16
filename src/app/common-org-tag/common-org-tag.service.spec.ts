import { TestBed } from '@angular/core/testing';

import { CommonOrgTagService } from './common-org-tag.service';

describe('CommonOrgTagService', () => {
  let service: CommonOrgTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonOrgTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
