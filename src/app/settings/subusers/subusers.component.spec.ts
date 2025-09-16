import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubusersComponent } from './subusers.component';

describe('SubusersComponent', () => {
  let component: SubusersComponent;
  let fixture: ComponentFixture<SubusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubusersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
