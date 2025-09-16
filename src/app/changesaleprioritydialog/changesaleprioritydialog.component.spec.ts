import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangesaleprioritydialogComponent } from './changesaleprioritydialog.component';

describe('ChangesaleprioritydialogComponent', () => {
  let component: ChangesaleprioritydialogComponent;
  let fixture: ComponentFixture<ChangesaleprioritydialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangesaleprioritydialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangesaleprioritydialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
