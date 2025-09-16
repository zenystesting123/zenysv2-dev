/**
 * Description : for setting table pagination range
 * ****************************************/
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';
import { TaskTableService } from '../task-list/task-table.service';

@Injectable({
    providedIn: 'root'
})
export class TaskPaginatorIntl extends MatPaginatorIntl {
    constructor(private tableService:TaskTableService){
        super();
    }
    getRangeLabel = (page: number, pageSize: number): string => {
        const start = page * pageSize + 1;
        const end = page * pageSize + this.tableService.taskList.data.length;
        if (this.tableService.taskList.data.length > 0) {
            return `${start} - ${end} `;
        }
        else {
            return `0-0 `;
        }
    }
}
