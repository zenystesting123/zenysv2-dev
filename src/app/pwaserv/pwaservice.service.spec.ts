import { TestBed } from '@angular/core/testing';

import { PwaserviceService } from './pwaservice.service';

describe('PwaserviceService', () => {
  let service: PwaserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PwaserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
