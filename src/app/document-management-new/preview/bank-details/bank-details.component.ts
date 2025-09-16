/*--------------------------------
Description : bank details prevuiew
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent implements OnInit {

  constructor(public previewService:PreviewService) { }

  ngOnInit(): void {
  }

}
