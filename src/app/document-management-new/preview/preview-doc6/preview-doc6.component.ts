/*--------------------------------
Description : preview template 6
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-preview-doc6',
  templateUrl: './preview-doc6.component.html',
  styleUrls: ['./preview-doc6.component.scss']
})
export class PreviewDoc6Component implements OnInit {

 
  constructor(public previewService:PreviewService) { }

  ngOnInit(): void {
  }

}
