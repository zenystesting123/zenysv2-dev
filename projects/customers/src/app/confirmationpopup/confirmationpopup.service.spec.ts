import { TestBed } from '@angular/core/testing';

import { ConfirmationpopupService } from './confirmationpopup.service';

describe('ConfirmationpopupService', () => {
  let service: ConfirmationpopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmationpopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
