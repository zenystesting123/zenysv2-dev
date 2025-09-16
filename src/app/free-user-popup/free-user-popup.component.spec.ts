import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeUserPopupComponent } from './free-user-popup.component';

describe('FreeUserPopupComponent', () => {
  let component: FreeUserPopupComponent;
  let fixture: ComponentFixture<FreeUserPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeUserPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeUserPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
