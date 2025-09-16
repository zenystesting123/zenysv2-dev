import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseSettingsComponent } from './expense-settings.component';

describe('ExpenseSettingsComponent', () => {
  let component: ExpenseSettingsComponent;
  let fixture: ComponentFixture<ExpenseSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpenseSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
