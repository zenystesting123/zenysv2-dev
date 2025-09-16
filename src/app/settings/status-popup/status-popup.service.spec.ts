import { TestBed } from '@angular/core/testing';

import { StatusPopupService } from './status-popup.service';

describe('StatusPopupService', () => {
  let service: StatusPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
