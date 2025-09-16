import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateloadingComponent } from './createloading.component';

describe('CreateloadingComponent', () => {
  let component: CreateloadingComponent;
  let fixture: ComponentFixture<CreateloadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateloadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateloadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
