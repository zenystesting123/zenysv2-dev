import { TestBed } from '@angular/core/testing';

import { Expenses1Service } from './expenses1.service';

describe('ExpensesService', () => {
  let service: Expenses1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Expenses1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
