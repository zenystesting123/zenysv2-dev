import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiresviewComponent } from './inquiresview.component';

describe('InquiresviewComponent', () => {
  let component: InquiresviewComponent;
  let fixture: ComponentFixture<InquiresviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquiresviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiresviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
