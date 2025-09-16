import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDoc1Component } from './preview-doc1.component';

describe('PreviewDoc1Component', () => {
  let component: PreviewDoc1Component;
  let fixture: ComponentFixture<PreviewDoc1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewDoc1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDoc1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
