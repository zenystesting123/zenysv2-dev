import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDoc7Component } from './preview-doc7.component';

describe('PreviewDoc7Component', () => {
  let component: PreviewDoc7Component;
  let fixture: ComponentFixture<PreviewDoc7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewDoc7Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDoc7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
