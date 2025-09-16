/*--------------------------------
Description : estimate document details preview
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-doc-detail-preview-estimate',
  templateUrl: './doc-detail-preview-estimate.component.html',
  styleUrls: ['./doc-detail-preview-estimate.component.scss']
})
export class DocDetailPreviewEstimateComponent implements OnInit {

  constructor(public previewService: PreviewService) { }

  ngOnInit(): void {
  }

}
