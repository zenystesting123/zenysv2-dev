import { TestBed } from '@angular/core/testing';

import { ChangecuststatService } from './changecuststat.service';

describe('ChangecuststatService', () => {
  let service: ChangecuststatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangecuststatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
