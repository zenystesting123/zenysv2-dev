import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudServiceComponent } from './crud-service.component';

describe('CrudServiceComponent', () => {
  let component: CrudServiceComponent;
  let fixture: ComponentFixture<CrudServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
