import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowupTableComponent } from './followup-table.component';

describe('FollowupTableComponent', () => {
  let component: FollowupTableComponent;
  let fixture: ComponentFixture<FollowupTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowupTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
