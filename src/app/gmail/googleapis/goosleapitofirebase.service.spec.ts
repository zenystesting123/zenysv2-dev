import { TestBed } from '@angular/core/testing';

import { GoosleapitofirebaseService } from './goosleapitofirebase.service';

describe('GoosleapitofirebaseService', () => {
  let service: GoosleapitofirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoosleapitofirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
