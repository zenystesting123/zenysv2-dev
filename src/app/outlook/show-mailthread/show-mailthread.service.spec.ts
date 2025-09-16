import { TestBed } from '@angular/core/testing';

import { ShowMailthreadService } from './show-mailthread.service';

describe('ShowMailthreadService', () => {
  let service: ShowMailthreadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowMailthreadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
