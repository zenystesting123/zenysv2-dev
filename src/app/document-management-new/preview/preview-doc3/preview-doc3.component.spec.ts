import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDoc3Component } from './preview-doc3.component';

describe('PreviewDoc3Component', () => {
  let component: PreviewDoc3Component;
  let fixture: ComponentFixture<PreviewDoc3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewDoc3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDoc3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
