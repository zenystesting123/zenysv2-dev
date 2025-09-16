import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTemplateTypeSelectComponent } from './message-template-type-select.component';

describe('MessageTemplateTypeSelectComponent', () => {
  let component: MessageTemplateTypeSelectComponent;
  let fixture: ComponentFixture<MessageTemplateTypeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageTemplateTypeSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageTemplateTypeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
