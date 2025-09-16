import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDoc2Component } from './preview-doc2.component';

describe('PreviewDoc2Component', () => {
  let component: PreviewDoc2Component;
  let fixture: ComponentFixture<PreviewDoc2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewDoc2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDoc2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
