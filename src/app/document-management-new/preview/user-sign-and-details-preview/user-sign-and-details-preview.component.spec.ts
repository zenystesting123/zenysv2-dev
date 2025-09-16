import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSignAndDetailsPreviewComponent } from './user-sign-and-details-preview.component';

describe('UserSignAndDetailsPreviewComponent', () => {
  let component: UserSignAndDetailsPreviewComponent;
  let fixture: ComponentFixture<UserSignAndDetailsPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSignAndDetailsPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSignAndDetailsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
