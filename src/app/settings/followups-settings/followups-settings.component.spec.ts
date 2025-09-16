import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowupsSettingsComponent } from './followups-settings.component';

describe('FollowupsSettingsComponent', () => {
  let component: FollowupsSettingsComponent;
  let fixture: ComponentFixture<FollowupsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowupsSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowupsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
