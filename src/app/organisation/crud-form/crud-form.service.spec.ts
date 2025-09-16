import { TestBed } from '@angular/core/testing';

import { CrudFormService } from './crud-form.service';

describe('CrudFormService', () => {
  let service: CrudFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
