import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadCaptureSettingsComponent } from './lead-capture-settings.component';

describe('LeadCaptureSettingsComponent', () => {
  let component: LeadCaptureSettingsComponent;
  let fixture: ComponentFixture<LeadCaptureSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadCaptureSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadCaptureSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
