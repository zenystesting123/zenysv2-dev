/**
 * Description : for setting table pagination range
 * ****************************************/
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';
import { SaleTableService } from '../sale-list/sale-table.service';

@Injectable({
    providedIn: 'root'
})
export class SalesPaginatorIntl extends MatPaginatorIntl {
    constructor(private tableService:SaleTableService){
        super();
    }
    getRangeLabel = (page: number, pageSize: number): string => {
        const start = page * pageSize + 1;
        const end = page * pageSize + this.tableService.saleList.data.length;
        if (this.tableService.saleList.data.length > 0) {
            return `${start} - ${end} `;
        }
        else {
            return `0-0 `;
        }
    }
}
