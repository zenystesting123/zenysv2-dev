import { TestBed } from '@angular/core/testing';

import { RejectleadserviceService } from './rejectleadservice.service';

describe('RejectleadserviceService', () => {
  let service: RejectleadserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RejectleadserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
