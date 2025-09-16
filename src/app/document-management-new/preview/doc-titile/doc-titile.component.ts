/*--------------------------------
Description : doc title preview
-------------------------------- */
import { Component, OnInit } from '@angular/core';
import { PreviewService } from '../preview.service';

@Component({
  selector: 'app-doc-titile',
  templateUrl: './doc-titile.component.html',
  styleUrls: ['./doc-titile.component.scss']
})
export class DocTitileComponent implements OnInit {
  constructor(public previewService: PreviewService) { }

  ngOnInit(): void {
  }

}
