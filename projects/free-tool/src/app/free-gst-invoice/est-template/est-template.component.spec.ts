import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstTemplateComponent } from './est-template.component';

describe('EstTemplateComponent', () => {
  let component: EstTemplateComponent;
  let fixture: ComponentFixture<EstTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
