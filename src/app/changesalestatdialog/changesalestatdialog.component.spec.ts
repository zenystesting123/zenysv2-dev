import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangesalestatdialogComponent } from './changesalestatdialog.component';

describe('ChangesalestatdialogComponent', () => {
  let component: ChangesalestatdialogComponent;
  let fixture: ComponentFixture<ChangesalestatdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangesalestatdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangesalestatdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
