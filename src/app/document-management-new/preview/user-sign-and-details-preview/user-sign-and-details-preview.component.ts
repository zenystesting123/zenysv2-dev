/*--------------------------------
Description : user sign and designation
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-user-sign-and-details-preview',
  templateUrl: './user-sign-and-details-preview.component.html',
  styleUrls: ['./user-sign-and-details-preview.component.scss']
})
export class UserSignAndDetailsPreviewComponent implements OnInit {

  constructor(public previewService:PreviewService) { }

  ngOnInit(): void {
  }

}
