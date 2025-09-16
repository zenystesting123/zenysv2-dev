import { TestBed } from '@angular/core/testing';
import { SaleGridService } from './sale-grid.service';


describe('SaleGridService', () => {
  let service: SaleGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
