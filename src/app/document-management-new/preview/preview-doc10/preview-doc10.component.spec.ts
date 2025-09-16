import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDoc10Component } from './preview-doc10.component';

describe('PreviewDoc10Component', () => {
  let component: PreviewDoc10Component;
  let fixture: ComponentFixture<PreviewDoc10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewDoc10Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDoc10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
