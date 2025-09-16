import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentnumberingPopupComponent } from './documentnumbering-popup.component';

describe('DocumentnumberingPopupComponent', () => {
  let component: DocumentnumberingPopupComponent;
  let fixture: ComponentFixture<DocumentnumberingPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentnumberingPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentnumberingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
