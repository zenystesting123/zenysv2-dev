import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusScriptComponent } from './status-script.component';

describe('StatusScriptComponent', () => {
  let component: StatusScriptComponent;
  let fixture: ComponentFixture<StatusScriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusScriptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
