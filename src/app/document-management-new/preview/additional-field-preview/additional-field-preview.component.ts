/*--------------------------------
Description : additional details preview
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-additional-field-preview',
  templateUrl: './additional-field-preview.component.html',
  styleUrls: ['./additional-field-preview.component.scss']
})
export class AdditionalFieldPreviewComponent implements OnInit {

  constructor(public previewService:PreviewService) { }

  ngOnInit(): void {
  }

}
