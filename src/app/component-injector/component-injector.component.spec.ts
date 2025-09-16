import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentInjectorComponent } from './component-injector.component';

describe('ComponentInjectorComponent', () => {
  let component: ComponentInjectorComponent;
  let fixture: ComponentFixture<ComponentInjectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentInjectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentInjectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
