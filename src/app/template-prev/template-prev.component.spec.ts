import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePrevComponent } from './template-prev.component';

describe('TemplatePrevComponent', () => {
  let component: TemplatePrevComponent;
  let fixture: ComponentFixture<TemplatePrevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatePrevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePrevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
