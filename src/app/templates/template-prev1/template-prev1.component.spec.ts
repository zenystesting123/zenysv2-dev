import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePrev1Component } from './template-prev1.component';

describe('TemplatePrev1Component', () => {
  let component: TemplatePrev1Component;
  let fixture: ComponentFixture<TemplatePrev1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplatePrev1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePrev1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
