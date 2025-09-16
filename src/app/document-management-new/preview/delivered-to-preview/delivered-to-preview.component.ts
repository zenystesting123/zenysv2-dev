/*--------------------------------
Description : delivered to preview
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-delivered-to-preview',
  templateUrl: './delivered-to-preview.component.html',
  styleUrls: ['./delivered-to-preview.component.scss']
})
export class DeliveredToPreviewComponent implements OnInit {

  constructor(public previewService:PreviewService) { }

  ngOnInit(): void {
  }

}
