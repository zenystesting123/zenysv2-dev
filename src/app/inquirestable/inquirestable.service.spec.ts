import { TestBed } from '@angular/core/testing';

import { InquirestableService } from './inquirestable.service';

describe('InquirestableService', () => {
  let service: InquirestableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InquirestableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
