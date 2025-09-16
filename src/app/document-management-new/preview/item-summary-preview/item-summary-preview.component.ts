/*--------------------------------
Description : item summary preview
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-item-summary-preview',
  templateUrl: './item-summary-preview.component.html',
  styleUrls: ['./item-summary-preview.component.scss']
})
export class ItemSummaryPreviewComponent implements OnInit {

  constructor(public previewService:PreviewService) { }

  ngOnInit(): void {
  }

}
