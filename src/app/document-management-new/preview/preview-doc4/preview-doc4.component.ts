/*--------------------------------
Description : preview template 4
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-preview-doc4',
  templateUrl: './preview-doc4.component.html',
  styleUrls: ['./preview-doc4.component.scss']
})
export class PreviewDoc4Component implements OnInit {

  constructor(public previewService:PreviewService) { }

  ngOnInit(): void {
  }

}
