import { TestBed } from '@angular/core/testing';

import { CustomfieldsService } from './customfields.service';

describe('CustomfieldsService', () => {
  let service: CustomfieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomfieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
