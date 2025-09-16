import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseorderTemplateComponent } from './purchaseorder-template.component';

describe('PurchaseorderTemplateComponent', () => {
  let component: PurchaseorderTemplateComponent;
  let fixture: ComponentFixture<PurchaseorderTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseorderTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseorderTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
