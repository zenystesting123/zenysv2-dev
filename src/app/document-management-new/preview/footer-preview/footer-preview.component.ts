/*--------------------------------
Description : footer preview
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-footer-preview',
  templateUrl: './footer-preview.component.html',
  styleUrls: ['./footer-preview.component.scss']
})
export class FooterPreviewComponent implements OnInit {

  constructor(public previewService: PreviewService) { }

  ngOnInit(): void {
  }

}
