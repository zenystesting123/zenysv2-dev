import { createComponent } from '@angular/compiler/src/core';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

import { CreateComponent } from './create.component';
import { CreateService } from './create.service';

describe('CreateComponent', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;
  let el: DebugElement;
  beforeEach(async () => {
 
    await TestBed.configureTestingModule({
      declarations: [CreateComponent],
  
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
   // el = fixture.debugElement.query(By.css('nav-link-menu'));
    expect(component).toBeTruthy();
  });
  // it('should use create template', () => {
  //   fixture.detectChanges();
  //   let de:DebugElement;
  //   let el:HTMLElement;
  //   de = fixture.debugElement.query(By.css('h3'));
  //   el=de.nativeElement;
  //   expect(el.textContent).toContain('create');
  // });
});
