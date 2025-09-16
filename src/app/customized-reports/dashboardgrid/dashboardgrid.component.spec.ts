import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardgridComponent } from './dashboardgrid.component';

describe('DashboardgridComponent', () => {
  let component: DashboardgridComponent;
  let fixture: ComponentFixture<DashboardgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardgridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
