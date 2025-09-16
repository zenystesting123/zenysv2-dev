import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskTableViewComponent } from './task-table-view.component';

describe('TaskTableViewComponent', () => {
  let component: TaskTableViewComponent;
  let fixture: ComponentFixture<TaskTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskTableViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
