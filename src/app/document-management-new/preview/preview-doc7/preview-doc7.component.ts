/*--------------------------------
Description : preview template 7
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-preview-doc7',
  templateUrl: './preview-doc7.component.html',
  styleUrls: ['./preview-doc7.component.scss']
})
export class PreviewDoc7Component implements OnInit {

 
  constructor(public previewService:PreviewService) { }

  ngOnInit(): void {
  }
}
