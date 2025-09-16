import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePrev2Component } from './template-prev2.component';

describe('TemplatePrev2Component', () => {
  let component: TemplatePrev2Component;
  let fixture: ComponentFixture<TemplatePrev2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplatePrev2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePrev2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
