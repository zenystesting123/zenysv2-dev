import { TestBed } from '@angular/core/testing';

import { DeleteContactsService } from './delete-contacts.service';

describe('DeleteContactsService', () => {
  let service: DeleteContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteContactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
