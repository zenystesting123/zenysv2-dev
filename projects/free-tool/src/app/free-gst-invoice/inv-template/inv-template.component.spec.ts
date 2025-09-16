import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvTemplateComponent } from './inv-template.component';

describe('InvTemplateComponent', () => {
  let component: InvTemplateComponent;
  let fixture: ComponentFixture<InvTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
