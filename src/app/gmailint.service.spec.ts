import { TestBed } from '@angular/core/testing';

import { GmailintService } from './gmailint.service';

describe('GmailintService', () => {
  let service: GmailintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GmailintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
