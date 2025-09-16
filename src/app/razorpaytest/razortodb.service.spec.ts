import { TestBed } from '@angular/core/testing';

import { RazortodbService } from './razortodb.service';

describe('RazortodbService', () => {
  let service: RazortodbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RazortodbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
