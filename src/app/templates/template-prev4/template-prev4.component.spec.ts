import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePrev4Component } from './template-prev4.component';

describe('TemplatePrev4Component', () => {
  let component: TemplatePrev4Component;
  let fixture: ComponentFixture<TemplatePrev4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplatePrev4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePrev4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
