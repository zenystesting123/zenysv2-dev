import { TestBed } from '@angular/core/testing';

import { SubusersService } from './subusers.service';

describe('SubusersService', () => {
  let service: SubusersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubusersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
