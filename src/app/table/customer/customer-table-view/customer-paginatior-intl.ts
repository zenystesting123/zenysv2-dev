/**
 * Description : for setting table pagination range
 * ****************************************/
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';
import { TableService } from '../customer-list/table.service';

@Injectable({
    providedIn: 'root'
})
export class CustomerPaginatorIntl extends MatPaginatorIntl {
    constructor(private tableService:TableService){
        super();
    }
    getRangeLabel = (page: number, pageSize: number): string => {
        const start = page * pageSize + 1;
        const end = page * pageSize + this.tableService.customerList.data.length;
        if (this.tableService.customerList.data.length > 0) {
            return `${start} - ${end} `;
        }
        else {
            return `0-0 `;
        }
    }
}
