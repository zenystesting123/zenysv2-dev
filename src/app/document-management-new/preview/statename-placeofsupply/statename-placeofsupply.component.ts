/*--------------------------------
Description : statename placeofsupply view
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-statename-placeofsupply',
  templateUrl: './statename-placeofsupply.component.html',
  styleUrls: ['./statename-placeofsupply.component.scss']
})
export class StatenamePlaceofsupplyComponent implements OnInit {

  constructor(public previewService:PreviewService) { }

  ngOnInit(): void {
  }

}
