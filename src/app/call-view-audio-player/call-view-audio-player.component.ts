import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-call-view-audio-player',
  templateUrl: './call-view-audio-player.component.html',
  styleUrls: ['./call-view-audio-player.component.scss'],
})
export class CallViewAudioPlayerComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<CallViewAudioPlayerComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit(): void {
  
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
