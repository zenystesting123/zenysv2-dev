import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageAutumationCreateComponent } from './stage-autumation-create.component';

describe('StageAutumationCreateComponent', () => {
  let component: StageAutumationCreateComponent;
  let fixture: ComponentFixture<StageAutumationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StageAutumationCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StageAutumationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
