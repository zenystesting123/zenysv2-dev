/**
 * Description : for setting table pagination range
 * ****************************************/
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';
import { FollowupTableService } from './followup-table.service';
import { GridContainerService } from '../grid-container/grid-container.service';

@Injectable({
    providedIn: 'root'
})
export class PaginatorFollowupIntl extends MatPaginatorIntl {
    constructor(private gridContainerService: GridContainerService){
        super();
    }
    getRangeLabel = (page: number, pageSize: number): string => {
        const start = page * pageSize + 1;
        const end = page * pageSize + this.gridContainerService.followupList.data.length;
        if (this.gridContainerService.followupList.data.length > 0) {
            return `${start} - ${end} `;
        }
        else {
            return `0-0 `;
        }
    }
}
