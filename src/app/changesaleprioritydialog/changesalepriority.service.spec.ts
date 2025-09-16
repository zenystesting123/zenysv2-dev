import { TestBed } from '@angular/core/testing';

import { ChangesalepriorityService } from './changesalepriority.service';

describe('ChangesalepriorityService', () => {
  let service: ChangesalepriorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangesalepriorityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
