import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Preview4Component } from './preview4.component';

describe('Preview4Component', () => {
  let component: Preview4Component;
  let fixture: ComponentFixture<Preview4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Preview4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Preview4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
