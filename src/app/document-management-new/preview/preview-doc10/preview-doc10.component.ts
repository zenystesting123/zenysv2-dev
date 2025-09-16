/*--------------------------------
Description : preview template 10
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-preview-doc10',
  templateUrl: './preview-doc10.component.html',
  styleUrls: ['./preview-doc10.component.scss']
})
export class PreviewDoc10Component implements OnInit {

  
  constructor(public previewService:PreviewService) { }

  ngOnInit(): void {
  }

}
