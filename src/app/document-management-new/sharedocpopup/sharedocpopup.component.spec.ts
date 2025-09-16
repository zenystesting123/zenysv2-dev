import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedocpopupComponent } from './sharedocpopup.component';

describe('SharedocpopupComponent', () => {
  let component: SharedocpopupComponent;
  let fixture: ComponentFixture<SharedocpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedocpopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedocpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
