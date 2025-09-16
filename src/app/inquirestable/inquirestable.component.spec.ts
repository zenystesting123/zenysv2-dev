import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquirestableComponent } from './inquirestable.component';

describe('InquirestableComponent', () => {
  let component: InquirestableComponent;
  let fixture: ComponentFixture<InquirestableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquirestableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquirestableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
