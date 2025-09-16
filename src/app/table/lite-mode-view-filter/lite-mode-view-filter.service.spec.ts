import { TestBed } from '@angular/core/testing';

import { LiteModeViewFilterService } from './lite-mode-view-filter.service';

describe('LiteModeViewFilterService', () => {
  let service: LiteModeViewFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiteModeViewFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
