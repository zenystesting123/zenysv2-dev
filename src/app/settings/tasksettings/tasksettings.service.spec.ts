import { TestBed } from '@angular/core/testing';

import { TasksettingsService } from './tasksettings.service';

describe('CustomersettingsService', () => {
  let service: TasksettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasksettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
