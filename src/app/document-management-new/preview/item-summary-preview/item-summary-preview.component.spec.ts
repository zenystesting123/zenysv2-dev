import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSummaryPreviewComponent } from './item-summary-preview.component';

describe('ItemSummaryPreviewComponent', () => {
  let component: ItemSummaryPreviewComponent;
  let fixture: ComponentFixture<ItemSummaryPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemSummaryPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSummaryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
