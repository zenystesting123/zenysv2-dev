/*--------------------------------
Description : bill from name preview
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-bill-from-name',
  templateUrl: './bill-from-name.component.html',
  styleUrls: ['./bill-from-name.component.scss']
})
export class BillFromNameComponent implements OnInit {

  constructor(public previewService: PreviewService) { }


  ngOnInit(): void {
  }

}
