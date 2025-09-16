import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineAndStagesComponent } from './pipeline-and-stages.component';

describe('PipelineAndStagesComponent', () => {
  let component: PipelineAndStagesComponent;
  let fixture: ComponentFixture<PipelineAndStagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PipelineAndStagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineAndStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
