import { TestBed } from '@angular/core/testing';

import { ChangesalestatService } from './changesalestat.service';

describe('ChangesalestatService', () => {
  let service: ChangesalestatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangesalestatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
