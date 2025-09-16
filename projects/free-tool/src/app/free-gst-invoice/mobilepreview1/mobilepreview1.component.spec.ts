import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mobilepreview1Component } from './mobilepreview1.component';

describe('Mobilepreview1Component', () => {
  let component: Mobilepreview1Component;
  let fixture: ComponentFixture<Mobilepreview1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Mobilepreview1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Mobilepreview1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
