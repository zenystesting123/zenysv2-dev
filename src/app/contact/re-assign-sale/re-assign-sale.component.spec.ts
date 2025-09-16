import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReAssignSaleComponent } from './re-assign-sale.component';

describe('ReAssignSaleComponent', () => {
  let component: ReAssignSaleComponent;
  let fixture: ComponentFixture<ReAssignSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReAssignSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReAssignSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
