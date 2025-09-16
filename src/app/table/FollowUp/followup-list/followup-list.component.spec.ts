import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowupListComponent } from './followup-list.component';

describe('FollowupListComponent', () => {
  let component: FollowupListComponent;
  let fixture: ComponentFixture<FollowupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowupListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
