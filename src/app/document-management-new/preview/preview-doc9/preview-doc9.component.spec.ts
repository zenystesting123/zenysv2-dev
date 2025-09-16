import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDoc9Component } from './preview-doc9.component';

describe('PreviewDoc9Component', () => {
  let component: PreviewDoc9Component;
  let fixture: ComponentFixture<PreviewDoc9Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewDoc9Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDoc9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
