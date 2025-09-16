import { TestBed } from '@angular/core/testing';

import { AddExperienceService } from './add-experience.service';

describe('AddExperienceService', () => {
  let service: AddExperienceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddExperienceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
