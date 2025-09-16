import { TestBed } from '@angular/core/testing';

import { ZenysmainaccountService } from './zenysmainaccount.service';

describe('ZenysmainaccountService', () => {
  let service: ZenysmainaccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZenysmainaccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
