import { TestBed } from '@angular/core/testing';

import { NetworkCheckService } from './networkcheck.service';

describe('NetworkcheckService', () => {
  let service: NetworkCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
