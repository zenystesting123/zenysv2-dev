import { TestBed } from '@angular/core/testing';

import { FirebaseLoginPageService } from './firebase-login-page.service';

describe('FirebaseLoginPageService', () => {
  let service: FirebaseLoginPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseLoginPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
