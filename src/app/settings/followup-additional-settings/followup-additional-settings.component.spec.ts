import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowupAdditionalSettingsComponent } from './followup-additional-settings.component';

describe('FollowupAdditionalSettingsComponent', () => {
  let component: FollowupAdditionalSettingsComponent;
  let fixture: ComponentFixture<FollowupAdditionalSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowupAdditionalSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowupAdditionalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
