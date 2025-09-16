import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallViewPopUpComponent } from './call-view-pop-up.component';

describe('CallViewPopUpComponent', () => {
  let component: CallViewPopUpComponent;
  let fixture: ComponentFixture<CallViewPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallViewPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallViewPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
