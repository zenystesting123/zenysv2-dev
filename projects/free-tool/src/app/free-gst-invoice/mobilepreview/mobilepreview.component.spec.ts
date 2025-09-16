import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilepreviewComponent } from './mobilepreview.component';

describe('MobilepreviewComponent', () => {
  let component: MobilepreviewComponent;
  let fixture: ComponentFixture<MobilepreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobilepreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilepreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
