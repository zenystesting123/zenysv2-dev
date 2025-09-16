/*--------------------------------
Description : logo preview
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-logo-preview',
  templateUrl: './logo-preview.component.html',
  styleUrls: ['./logo-preview.component.scss']
})
export class LogoPreviewComponent implements OnInit {

  constructor(public previewService: PreviewService) { }

  ngOnInit(): void {
  }

}
