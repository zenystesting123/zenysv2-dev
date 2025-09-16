import { TestBed } from '@angular/core/testing';

import { TaskboardService } from './taskboard.service';

describe('TaskboardService', () => {
  let service: TaskboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
