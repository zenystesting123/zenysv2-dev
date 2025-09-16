/**
 * Description : for setting table pagination range
 * ****************************************/
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';
import { EstimateTableService } from './estimate-table.service';

@Injectable({
    providedIn: 'root'
})
export class PaginatorEstimateIntl extends MatPaginatorIntl {
    constructor(private tableService:EstimateTableService){
        super();
    }
    getRangeLabel = (page: number, pageSize: number): string => {
        const start = page * pageSize + 1;
        const end = page * pageSize + this.tableService.estimateList.data.length;
        if (this.tableService.estimateList.data.length > 0) {
            return `${start} - ${end} `;
        }
        else {
            return `0-0 `;
        }
    }
}