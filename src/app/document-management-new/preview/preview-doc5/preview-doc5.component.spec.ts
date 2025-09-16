import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDoc5Component } from './preview-doc5.component';

describe('PreviewDoc5Component', () => {
  let component: PreviewDoc5Component;
  let fixture: ComponentFixture<PreviewDoc5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewDoc5Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDoc5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
