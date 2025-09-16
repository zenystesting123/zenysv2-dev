import { TestBed } from '@angular/core/testing';

import { FollowupTableService } from './followup-table.service';

describe('FollowupTableService', () => {
  let service: FollowupTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FollowupTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
