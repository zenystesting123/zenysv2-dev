import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatHomeComponent } from './mat-home.component';

describe('MatHomeComponent', () => {
  let component: MatHomeComponent;
  let fixture: ComponentFixture<MatHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
