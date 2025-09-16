import { TestBed } from '@angular/core/testing';

import { SaletabService } from './saletab.service';

describe('SaletabService', () => {
  let service: SaletabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaletabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
