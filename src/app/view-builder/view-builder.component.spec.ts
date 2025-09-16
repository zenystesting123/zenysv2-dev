import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBuilderComponent } from './view-builder.component';

describe('ViewBuilderComponent', () => {
  let component: ViewBuilderComponent;
  let fixture: ComponentFixture<ViewBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
