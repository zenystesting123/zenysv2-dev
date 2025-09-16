import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleGridComponent } from './sale-grid.component';

describe('SaleGridComponent', () => {
  let component: SaleGridComponent;
  let fixture: ComponentFixture<SaleGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
