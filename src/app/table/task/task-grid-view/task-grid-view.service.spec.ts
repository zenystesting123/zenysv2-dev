import { TestBed } from '@angular/core/testing';

import { TaskGridViewService } from './task-grid-view.service';

describe('TaskGridViewService', () => {
  let service: TaskGridViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskGridViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
