import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-attendance-login',
  templateUrl: './attendance-login.component.html',
  styleUrls: ['./attendance-login.component.scss']
})
export class AttendanceLoginComponent implements OnInit {

  constructor(private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
  }
  logout() {
    this.afAuth.signOut();
  }
}
