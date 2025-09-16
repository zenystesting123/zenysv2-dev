/**
 * Description : for setting table pagination range
 * ****************************************/
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';
import { InvoiceTableService } from './invoice-table.service';

@Injectable({
  providedIn: 'root',
})
export class InvPaginatorIntl extends MatPaginatorIntl {
  constructor(private tableService: InvoiceTableService) {
    super();
  }
  getRangeLabel = (page: number, pageSize: number): string => {
    const start = page * pageSize + 1;
    const end = page * pageSize + this.tableService.invList.data.length;
    if (this.tableService.invList.data.length > 0) {
      return `${start} - ${end} `;
    } else {
      return `0-0 `;
    }
  };
}
