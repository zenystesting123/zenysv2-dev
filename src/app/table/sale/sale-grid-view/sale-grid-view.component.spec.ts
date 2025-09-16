import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleGridViewComponent } from './sale-grid-view.component';

describe('SaleGridViewComponent', () => {
  let component: SaleGridViewComponent;
  let fixture: ComponentFixture<SaleGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleGridViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
