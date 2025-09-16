import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelDocumentComponent } from './cancel-document.component';

describe('CancelDocumentComponent', () => {
  let component: CancelDocumentComponent;
  let fixture: ComponentFixture<CancelDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
