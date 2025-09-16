import { TestBed } from '@angular/core/testing';

import { FollowupListService } from './followup-list.service';

describe('FollowupListService', () => {
  let service: FollowupListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FollowupListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
