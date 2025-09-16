/*--------------------------------
Description : invoice doc details preview
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-doc-details-preview-invoice',
  templateUrl: './doc-details-preview-invoice.component.html',
  styleUrls: ['./doc-details-preview-invoice.component.scss']
})
export class DocDetailsPreviewInvoiceComponent implements OnInit {

  constructor(public previewService: PreviewService) { }

  ngOnInit(): void {
  }

}
