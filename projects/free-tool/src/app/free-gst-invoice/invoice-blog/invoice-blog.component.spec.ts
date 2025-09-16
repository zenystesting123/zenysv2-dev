import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceBlogComponent } from './invoice-blog.component';

describe('InvoiceBlogComponent', () => {
  let component: InvoiceBlogComponent;
  let fixture: ComponentFixture<InvoiceBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceBlogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
