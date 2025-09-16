import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Preview3Component } from './preview3.component';

describe('Preview3Component', () => {
  let component: Preview3Component;
  let fixture: ComponentFixture<Preview3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Preview3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Preview3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
