import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudModal1Component} from './crud-modal1.component'

describe('CrudModal1Component', () => {
  let component: CrudModal1Component;
  let fixture: ComponentFixture<CrudModal1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudModal1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudModal1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
