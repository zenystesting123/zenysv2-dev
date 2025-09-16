import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCheckComponent } from './profile-check.component';

describe('ProfileCheckComponent', () => {
  let component: ProfileCheckComponent;
  let fixture: ComponentFixture<ProfileCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
