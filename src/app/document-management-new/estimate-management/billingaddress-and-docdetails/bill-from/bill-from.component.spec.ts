import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillFromComponent } from './bill-from.component';

describe('BillFromComponent', () => {
  let component: BillFromComponent;
  let fixture: ComponentFixture<BillFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillFromComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
