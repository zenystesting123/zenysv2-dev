import { TestBed } from '@angular/core/testing';

import { Addnewsale1Service } from './addnewsale1.service';

describe('Addnewsale1Service', () => {
  let service: Addnewsale1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Addnewsale1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
