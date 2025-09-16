import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSalesComponent } from './shared-sales.component';

describe('SharedSalesComponent', () => {
  let component: SharedSalesComponent;
  let fixture: ComponentFixture<SharedSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
