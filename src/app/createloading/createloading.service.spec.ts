import { TestBed } from '@angular/core/testing';

import { CreateloadingService } from './createloading.service';

describe('CreateloadingService', () => {
  let service: CreateloadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateloadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
