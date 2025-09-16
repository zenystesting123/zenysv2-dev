import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePrev3Component } from './template-prev3.component';

describe('TemplatePrev3Component', () => {
  let component: TemplatePrev3Component;
  let fixture: ComponentFixture<TemplatePrev3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplatePrev3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePrev3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
