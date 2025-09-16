/**
 * Description : for setting table pagination range
 * ****************************************/
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';
import { QuotationTableService } from './quotation-table.service';

@Injectable({
    providedIn: 'root'
})
export class PaginatorQuotationIntl extends MatPaginatorIntl {
    constructor(private tableService:QuotationTableService){
        super();
    }
    getRangeLabel = (page: number, pageSize: number): string => {
        const start = page * pageSize + 1;
        const end = page * pageSize + this.tableService.quotationList.data.length;
        if (this.tableService.quotationList.data.length > 0) {
            return `${start} - ${end} `;
        }
        else {
            return `0-0 `;
        }
    }
}