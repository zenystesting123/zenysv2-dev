/*--------------------------------
Description : quotation doc details preview
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-doc-details-preview-quotation',
  templateUrl: './doc-details-preview-quotation.component.html',
  styleUrls: ['./doc-details-preview-quotation.component.scss']
})
export class DocDetailsPreviewQuotationComponent implements OnInit {

  constructor(public previewService: PreviewService) { }

  ngOnInit(): void {
  }

}
