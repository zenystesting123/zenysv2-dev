/**
 * Description : for setting table pagination range
 * ****************************************/
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';
import { SupportListService } from '../support-list/support-list.service';

@Injectable({
    providedIn: 'root'
})
export class SupportTablePaginatorIntl extends MatPaginatorIntl {
    constructor(private tableService:SupportListService){
        super();
    }
    getRangeLabel = (page: number, pageSize: number): string => {
        const start = page * pageSize + 1;
        const end = page * pageSize + this.tableService.serviceList.data.length;
        if (this.tableService.serviceList.data.length > 0) {
            return `${start} - ${end} `;
        }
        else {
            return `0-0 `;
        }
    }
}
