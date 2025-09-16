import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocTitileComponent } from './doc-titile.component';

describe('DocTitileComponent', () => {
  let component: DocTitileComponent;
  let fixture: ComponentFixture<DocTitileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocTitileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocTitileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
