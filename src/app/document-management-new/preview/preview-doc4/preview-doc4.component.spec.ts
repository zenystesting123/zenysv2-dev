import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDoc4Component } from './preview-doc4.component';

describe('PreviewDoc4Component', () => {
  let component: PreviewDoc4Component;
  let fixture: ComponentFixture<PreviewDoc4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewDoc4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDoc4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
