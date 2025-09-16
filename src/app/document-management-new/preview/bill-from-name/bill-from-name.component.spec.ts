import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillFromNameComponent } from './bill-from-name.component';

describe('BillFromNameComponent', () => {
  let component: BillFromNameComponent;
  let fixture: ComponentFixture<BillFromNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillFromNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillFromNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
