import { TestBed } from '@angular/core/testing';

import { SupportGridViewService } from './support-grid-view.service';

describe('SupportGridViewService', () => {
  let service: SupportGridViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportGridViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
