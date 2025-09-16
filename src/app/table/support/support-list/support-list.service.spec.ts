import { TestBed } from '@angular/core/testing';

import { SupportListService } from './support-list.service';

describe('SupportListService', () => {
  let service: SupportListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
