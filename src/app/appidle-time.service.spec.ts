import { TestBed } from '@angular/core/testing';

import { AppidleTimeService } from './appidle-time.service';

describe('AppidleTimeService', () => {
  let service: AppidleTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppidleTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
