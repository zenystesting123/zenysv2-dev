import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExperiencePopupComponent } from './add-experience-popup.component';

describe('AddExperiencePopupComponent', () => {
  let component: AddExperiencePopupComponent;
  let fixture: ComponentFixture<AddExperiencePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExperiencePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExperiencePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
