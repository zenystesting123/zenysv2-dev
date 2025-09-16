import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocDetailsQuoteComponent } from './doc-details-quote.component';

describe('DocDetailsQuoteComponent', () => {
  let component: DocDetailsQuoteComponent;
  let fixture: ComponentFixture<DocDetailsQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocDetailsQuoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocDetailsQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
