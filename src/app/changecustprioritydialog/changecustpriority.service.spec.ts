import { TestBed } from '@angular/core/testing';

import { ChangecustpriorityService } from './changecustpriority.service';

describe('ChangecustpriorityService', () => {
  let service: ChangecustpriorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangecustpriorityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
