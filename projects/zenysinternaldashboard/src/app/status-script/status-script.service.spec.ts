import { TestBed } from '@angular/core/testing';

import { StatusScriptService } from './status-script.service';

describe('StatusScriptService', () => {
  let service: StatusScriptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusScriptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
