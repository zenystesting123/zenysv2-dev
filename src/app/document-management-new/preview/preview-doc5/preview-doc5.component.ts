/*--------------------------------
Description : preview template 5
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-preview-doc5',
  templateUrl: './preview-doc5.component.html',
  styleUrls: ['./preview-doc5.component.scss']
})
export class PreviewDoc5Component implements OnInit {

  
  constructor(public previewService:PreviewService) { }

  ngOnInit(): void {
  }
}
