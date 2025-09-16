import { TestBed } from '@angular/core/testing';

import { SupportGridService } from './support-grid.service';

describe('SupportGridService', () => {
  let service: SupportGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
