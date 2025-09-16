import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksettingsComponent } from './tasksettings.component';

describe('CustomersettingsComponent', () => {
  let component: TasksettingsComponent;
  let fixture: ComponentFixture<TasksettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
