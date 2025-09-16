import { TestBed } from '@angular/core/testing';

import { FollowupTaskCreateService } from './followup-task-create.service';

describe('FollowupTaskCreateService', () => {
  let service: FollowupTaskCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FollowupTaskCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
