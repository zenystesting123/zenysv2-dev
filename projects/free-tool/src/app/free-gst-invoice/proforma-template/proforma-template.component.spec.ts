import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaTemplateComponent } from './proforma-template.component';

describe('ProformaTemplateComponent', () => {
  let component: ProformaTemplateComponent;
  let fixture: ComponentFixture<ProformaTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformaTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProformaTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
