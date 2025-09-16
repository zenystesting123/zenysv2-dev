/*--------------------------------
Description : preview template 1
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-preview-doc1',
  templateUrl: './preview-doc1.component.html',
  styleUrls: ['./preview-doc1.component.scss']
})
export class PreviewDoc1Component implements OnInit {

  
  constructor(public previewService:PreviewService) { }

  ngOnInit(): void {
  }

}
