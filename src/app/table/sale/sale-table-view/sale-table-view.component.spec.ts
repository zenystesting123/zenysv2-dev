import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleTableViewComponent } from './sale-table-view.component';

describe('SaleTableViewComponent', () => {
  let component: SaleTableViewComponent;
  let fixture: ComponentFixture<SaleTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleTableViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
