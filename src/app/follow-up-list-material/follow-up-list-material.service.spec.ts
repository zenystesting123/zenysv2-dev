import { TestBed } from '@angular/core/testing';

import { FollowUpListMaterialService } from './follow-up-list-material.service';

describe('FollowUpListMaterialService', () => {
  let service: FollowUpListMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FollowUpListMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
