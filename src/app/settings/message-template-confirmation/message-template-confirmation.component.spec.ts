import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTemplateConfirmationComponent } from './message-template-confirmation.component';

describe('MessageTemplateConfirmationComponent', () => {
  let component: MessageTemplateConfirmationComponent;
  let fixture: ComponentFixture<MessageTemplateConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageTemplateConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageTemplateConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
