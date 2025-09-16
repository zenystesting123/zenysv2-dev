import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnglishChannelContactTab1Component } from './english-channel-contact-tab1.component';

describe('EnglishChannelContactTab1Component', () => {
  let component: EnglishChannelContactTab1Component;
  let fixture: ComponentFixture<EnglishChannelContactTab1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnglishChannelContactTab1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnglishChannelContactTab1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
