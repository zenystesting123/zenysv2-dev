import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchtermScriptComponent } from './searchterm-script.component';

describe('SearchtermScriptComponent', () => {
  let component: SearchtermScriptComponent;
  let fixture: ComponentFixture<SearchtermScriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchtermScriptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchtermScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
