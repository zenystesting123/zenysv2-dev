import { TestBed } from '@angular/core/testing';

import { ComposemailService } from './composemail.service';

describe('ComposemailService', () => {
  let service: ComposemailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComposemailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
