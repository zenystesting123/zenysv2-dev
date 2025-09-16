import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboradpageComponent } from './dashboradpage.component';

describe('DashboradpageComponent', () => {
  let component: DashboradpageComponent;
  let fixture: ComponentFixture<DashboradpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboradpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboradpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
