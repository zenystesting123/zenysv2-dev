import { TestBed } from '@angular/core/testing';

import { ComposeMailService } from './compose-mail.service';

describe('ComposeMailService', () => {
  let service: ComposeMailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComposeMailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
