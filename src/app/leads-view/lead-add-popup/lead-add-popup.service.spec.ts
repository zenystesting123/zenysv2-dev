import { TestBed } from '@angular/core/testing';

import { LeadAddPopupService } from './lead-add-popup.service';

describe('LeadAddPopupService', () => {
  let service: LeadAddPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadAddPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
