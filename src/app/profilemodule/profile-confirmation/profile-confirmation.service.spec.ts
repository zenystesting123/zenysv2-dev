import { TestBed } from '@angular/core/testing';

import { ProfileConfirmationService } from './profile-confirmation.service';

describe('ProfileConfirmationService', () => {
  let service: ProfileConfirmationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileConfirmationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
