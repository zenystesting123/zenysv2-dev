import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mobilepreview3Component } from './mobilepreview3.component';

describe('Mobilepreview3Component', () => {
  let component: Mobilepreview3Component;
  let fixture: ComponentFixture<Mobilepreview3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Mobilepreview3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Mobilepreview3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
