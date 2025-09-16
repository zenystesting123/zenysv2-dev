import { TestBed } from '@angular/core/testing';

import { TemplatePrevService } from '../templates/template-prev.service';

describe('TemplatePrevService', () => {
  let service: TemplatePrevService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplatePrevService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
