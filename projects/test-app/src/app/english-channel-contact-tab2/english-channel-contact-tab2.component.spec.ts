import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishChannelContactTab2Component } from './english-channel-contact-tab2.component';

describe('EnglishChannelContactTab2Component', () => {
  let component: EnglishChannelContactTab2Component;
  let fixture: ComponentFixture<EnglishChannelContactTab2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnglishChannelContactTab2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishChannelContactTab2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
