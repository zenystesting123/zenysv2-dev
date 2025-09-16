import { TestBed } from '@angular/core/testing';

import { SubUserChatsService } from './sub-user-chats.service';

describe('SubUserChatsService', () => {
  let service: SubUserChatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubUserChatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
