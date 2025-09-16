import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleCustomViewSelectComponent } from './sale-custom-view-select.component';

describe('SaleCustomViewSelectComponent', () => {
  let component: SaleCustomViewSelectComponent;
  let fixture: ComponentFixture<SaleCustomViewSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleCustomViewSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleCustomViewSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
