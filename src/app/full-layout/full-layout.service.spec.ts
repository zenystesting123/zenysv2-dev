import { TestBed } from '@angular/core/testing';

import { FullLayoutService } from './full-layout.service';

describe('FullLayoutService', () => {
  let service: FullLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FullLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
