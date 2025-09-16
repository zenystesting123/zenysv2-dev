/*--------------------------------
Description : preview template 2
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-preview-doc2',
  templateUrl: './preview-doc2.component.html',
  styleUrls: ['./preview-doc2.component.scss']
})
export class PreviewDoc2Component implements OnInit {

 
  constructor(public previewService:PreviewService) { }

  ngOnInit(): void {
  }

}
