import { TestBed } from '@angular/core/testing';

import { ProfileEditComponentService } from './profile-edit-component.service';

describe('ProfileEditComponentService', () => {
  let service: ProfileEditComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileEditComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
