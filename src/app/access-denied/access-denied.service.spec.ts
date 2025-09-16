import { TestBed } from '@angular/core/testing';

import { AccessDeniedService } from './access-denied.service';

describe('AccessDeniedService', () => {
  let service: AccessDeniedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessDeniedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
