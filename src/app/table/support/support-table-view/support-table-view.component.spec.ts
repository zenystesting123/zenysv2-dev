import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportTableViewComponent } from './support-table-view.component';

describe('SupportTableViewComponent', () => {
  let component: SupportTableViewComponent;
  let fixture: ComponentFixture<SupportTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportTableViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
