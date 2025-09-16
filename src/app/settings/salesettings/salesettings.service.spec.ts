import { TestBed } from '@angular/core/testing';

import { SalesettingsService } from './salesettings.service';

describe('SalesettingsService', () => {
  let service: SalesettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
