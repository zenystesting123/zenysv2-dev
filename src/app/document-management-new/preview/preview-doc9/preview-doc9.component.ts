/*--------------------------------
Description : preview template 9
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-preview-doc9',
  templateUrl: './preview-doc9.component.html',
  styleUrls: ['./preview-doc9.component.scss']
})
export class PreviewDoc9Component implements OnInit {

 
  constructor(public previewService:PreviewService) { }

  ngOnInit(): void {
  }

}
