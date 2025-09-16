import { TestBed } from '@angular/core/testing';

import { AddNewServiceService } from './add-new-service.service';

describe('AddNewServiceService', () => {
  let service: AddNewServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddNewServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
