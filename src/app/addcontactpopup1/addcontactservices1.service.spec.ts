import { TestBed } from '@angular/core/testing';

import { Addcontactservices1Service } from './addcontactservices1.service';

describe('Addcontactservices1Service', () => {
  let service: Addcontactservices1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Addcontactservices1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
