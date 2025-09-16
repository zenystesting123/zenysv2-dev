import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangecustprioritydialogComponent } from './changecustprioritydialog.component';

describe('ChangecustprioritydialogComponent', () => {
  let component: ChangecustprioritydialogComponent;
  let fixture: ComponentFixture<ChangecustprioritydialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangecustprioritydialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangecustprioritydialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
