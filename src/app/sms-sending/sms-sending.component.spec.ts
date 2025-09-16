import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsSendingComponent } from './sms-sending.component';

describe('SmsSendingComponent', () => {
  let component: SmsSendingComponent;
  let fixture: ComponentFixture<SmsSendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsSendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsSendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
