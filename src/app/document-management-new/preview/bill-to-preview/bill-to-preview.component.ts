/*--------------------------------
Description : bill to preview
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-bill-to-preview',
  templateUrl: './bill-to-preview.component.html',
  styleUrls: ['./bill-to-preview.component.scss']
})
export class BillToPreviewComponent implements OnInit {

  constructor(public previewService: PreviewService) { }

  ngOnInit(): void {
  }

}
