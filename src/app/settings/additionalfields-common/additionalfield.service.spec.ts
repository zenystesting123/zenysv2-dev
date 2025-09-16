import { TestBed } from '@angular/core/testing';

import { AdditionalfieldService } from './additionalfield.service';

describe('AdditionalfieldService', () => {
  let service: AdditionalfieldService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdditionalfieldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
