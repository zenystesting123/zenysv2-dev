import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadAddPopupComponent } from './lead-add-popup.component';

describe('LeadAddPopupComponent', () => {
  let component: LeadAddPopupComponent;
  let fixture: ComponentFixture<LeadAddPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadAddPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadAddPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
