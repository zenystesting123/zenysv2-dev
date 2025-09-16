import { TestBed } from '@angular/core/testing';

import { MessgaeTemplateService } from './messgae-template.service';

describe('MessgaeTemplateService', () => {
  let service: MessgaeTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessgaeTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
