import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDoc6Component } from './preview-doc6.component';

describe('PreviewDoc6Component', () => {
  let component: PreviewDoc6Component;
  let fixture: ComponentFixture<PreviewDoc6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewDoc6Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewDoc6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
