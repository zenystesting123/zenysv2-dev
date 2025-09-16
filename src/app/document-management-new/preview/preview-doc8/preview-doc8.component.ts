/*--------------------------------
Description : preview template 8
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-preview-doc8',
  templateUrl: './preview-doc8.component.html',
  styleUrls: ['./preview-doc8.component.scss']
})
export class PreviewDoc8Component implements OnInit {

  
  constructor(public previewService:PreviewService) { }

  ngOnInit(): void {
  }

}
