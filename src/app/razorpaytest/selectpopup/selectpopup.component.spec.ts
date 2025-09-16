import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectpopupComponent } from './selectpopup.component';

describe('SelectpopupComponent', () => {
  let component: SelectpopupComponent;
  let fixture: ComponentFixture<SelectpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectpopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
