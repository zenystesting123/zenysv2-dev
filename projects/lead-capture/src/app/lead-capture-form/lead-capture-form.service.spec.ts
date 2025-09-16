import { TestBed } from '@angular/core/testing';

import { LeadCaptureFormService } from './lead-capture-form.service';

describe('LeadCaptureFormService', () => {
  let service: LeadCaptureFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadCaptureFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
