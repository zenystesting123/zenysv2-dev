import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateSettingsComponent } from './email-template-settings.component';

describe('EmailTemplateSettingsComponent', () => {
  let component: EmailTemplateSettingsComponent;
  let fixture: ComponentFixture<EmailTemplateSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailTemplateSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailTemplateSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
