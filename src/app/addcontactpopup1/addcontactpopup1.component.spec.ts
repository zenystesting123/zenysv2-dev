import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addcontactpopup1Component } from './addcontactpopup1.component';

describe('Addcontactpopup1Component', () => {
  let component: Addcontactpopup1Component;
  let fixture: ComponentFixture<Addcontactpopup1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Addcontactpopup1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Addcontactpopup1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
