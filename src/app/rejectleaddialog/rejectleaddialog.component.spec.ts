import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectleaddialogComponent } from './rejectleaddialog.component';

describe('RejectleaddialogComponent', () => {
  let component: RejectleaddialogComponent;
  let fixture: ComponentFixture<RejectleaddialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectleaddialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectleaddialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
