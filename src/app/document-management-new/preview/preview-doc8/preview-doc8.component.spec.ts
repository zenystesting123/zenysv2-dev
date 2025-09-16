import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDoc8Component } from './preview-doc8.component';

describe('PreviewDoc8Component', () => {
  let component: PreviewDoc8Component;
  let fixture: ComponentFixture<PreviewDoc8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewDoc8Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDoc8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
