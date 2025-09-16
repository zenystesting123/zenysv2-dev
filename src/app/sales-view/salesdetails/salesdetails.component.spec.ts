import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesdetailsComponent } from './salesdetails.component';

describe('SalesdetailsComponent', () => {
  let component: SalesdetailsComponent;
  let fixture: ComponentFixture<SalesdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
