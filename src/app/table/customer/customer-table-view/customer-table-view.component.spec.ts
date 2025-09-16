import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTableViewComponent } from './customer-table-view.component';

describe('CustomerTableViewComponent', () => {
  let component: CustomerTableViewComponent;
  let fixture: ComponentFixture<CustomerTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTableViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
