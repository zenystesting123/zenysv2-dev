import { TestBed } from '@angular/core/testing';

import { SearchtermScriptService } from './searchterm-script.service';

describe('SearchtermScriptService', () => {
  let service: SearchtermScriptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchtermScriptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
