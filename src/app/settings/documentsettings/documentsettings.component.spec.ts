import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsettingsComponent } from './documentsettings.component';

describe('DocumentsettingsComponent', () => {
  let component: DocumentsettingsComponent;
  let fixture: ComponentFixture<DocumentsettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
