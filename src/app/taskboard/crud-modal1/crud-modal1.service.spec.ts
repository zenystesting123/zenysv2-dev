import { TestBed } from '@angular/core/testing';

import { CrudModal1Service } from './crud-modal1.service';

describe('CrudModalService', () => {
  let service: CrudModal1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudModal1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
