import { TestBed } from '@angular/core/testing';

import { InquiresviewService } from './inquiresview.service';

describe('InquiresviewService', () => {
  let service: InquiresviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InquiresviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
