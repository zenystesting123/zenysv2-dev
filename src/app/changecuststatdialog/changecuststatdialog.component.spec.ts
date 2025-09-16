import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangecuststatdialogComponent } from './changecuststatdialog.component';

describe('ChangecuststatdialogComponent', () => {
  let component: ChangecuststatdialogComponent;
  let fixture: ComponentFixture<ChangecuststatdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangecuststatdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangecuststatdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
