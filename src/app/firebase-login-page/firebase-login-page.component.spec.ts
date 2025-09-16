import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirebaseLoginPageComponent } from './firebase-login-page.component';

describe('FirebaseLoginPageComponent', () => {
  let component: FirebaseLoginPageComponent;
  let fixture: ComponentFixture<FirebaseLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirebaseLoginPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirebaseLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
