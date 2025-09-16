/*--------------------------------
Description : preview template 3
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-preview-doc3',
  templateUrl: './preview-doc3.component.html',
  styleUrls: ['./preview-doc3.component.scss']
})
export class PreviewDoc3Component implements OnInit {

 
  constructor(public previewService:PreviewService) { }

  ngOnInit(): void {
  }

}
