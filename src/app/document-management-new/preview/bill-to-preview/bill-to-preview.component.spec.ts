import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillToPreviewComponent } from './bill-to-preview.component';

describe('BillToPreviewComponent', () => {
  let component: BillToPreviewComponent;
  let fixture: ComponentFixture<BillToPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillToPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillToPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
