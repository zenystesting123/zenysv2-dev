/*--------------------------------
Description : notes preview
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-additional-notes',
  templateUrl: './additional-notes.component.html',
  styleUrls: ['./additional-notes.component.scss']
})
export class AdditionalNotesComponent implements OnInit {

  constructor(public previewService:PreviewService) { }

  ngOnInit(): void {
  }

}
