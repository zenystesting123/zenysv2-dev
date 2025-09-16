import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePrev5Component } from './template-prev5.component';

describe('TemplatePrev5Component', () => {
  let component: TemplatePrev5Component;
  let fixture: ComponentFixture<TemplatePrev5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplatePrev5Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePrev5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
