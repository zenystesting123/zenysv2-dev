import { TestBed } from '@angular/core/testing';

import { LeadshareService } from './leadshare.service';

describe('LeadshareService', () => {
  let service: LeadshareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadshareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
