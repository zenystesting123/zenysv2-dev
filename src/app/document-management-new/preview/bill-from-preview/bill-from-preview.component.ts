/*--------------------------------
Description : bill from details preview
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-bill-from-preview',
  templateUrl: './bill-from-preview.component.html',
  styleUrls: ['./bill-from-preview.component.scss']
})
export class BillFromPreviewComponent implements OnInit {

  constructor(public previewService: PreviewService) { }

  ngOnInit(): void {
  }

}
