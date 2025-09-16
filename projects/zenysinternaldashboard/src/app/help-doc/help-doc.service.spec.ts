import { TestBed } from '@angular/core/testing';

import { HelpDocService } from './help-doc.service';

describe('HelpDocService', () => {
  let service: HelpDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelpDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
