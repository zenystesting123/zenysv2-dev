import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillFromPreviewComponent } from './bill-from-preview.component';

describe('BillFromPreviewComponent', () => {
  let component: BillFromPreviewComponent;
  let fixture: ComponentFixture<BillFromPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillFromPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillFromPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
