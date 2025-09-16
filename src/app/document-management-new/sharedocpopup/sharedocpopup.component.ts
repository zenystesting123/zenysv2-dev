/*----------------------------------------------
Description : popup for share document or not 
-----------------------------------------------*/
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sharedocpopup',
  templateUrl: './sharedocpopup.component.html',
  styleUrls: ['./sharedocpopup.component.scss'],
})
export class SharedocpopupComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<SharedocpopupComponent>) { }

  ngOnInit(): void { }
}
