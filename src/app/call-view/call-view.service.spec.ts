import { TestBed } from '@angular/core/testing';

import { CallViewService } from './call-view.service';

describe('CallViewService', () => {
  let service: CallViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
