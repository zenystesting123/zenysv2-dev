import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mobilepreview2Component } from './mobilepreview2.component';

describe('Mobilepreview2Component', () => {
  let component: Mobilepreview2Component;
  let fixture: ComponentFixture<Mobilepreview2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Mobilepreview2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Mobilepreview2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
