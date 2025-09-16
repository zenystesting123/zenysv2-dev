import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotTemplateComponent } from './quot-template.component';

describe('QuotTemplateComponent', () => {
  let component: QuotTemplateComponent;
  let fixture: ComponentFixture<QuotTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
