import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowupTaskCreateComponent } from './followup-task-create.component';

describe('FollowupTaskCreateComponent', () => {
  let component: FollowupTaskCreateComponent;
  let fixture: ComponentFixture<FollowupTaskCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowupTaskCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowupTaskCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
