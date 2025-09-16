import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEditComponentComponent } from './profile-edit-component.component';

describe('ProfileEditComponentComponent', () => {
  let component: ProfileEditComponentComponent;
  let fixture: ComponentFixture<ProfileEditComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileEditComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEditComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
