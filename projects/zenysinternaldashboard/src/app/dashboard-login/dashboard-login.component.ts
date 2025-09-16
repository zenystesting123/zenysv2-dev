import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard-login',
  templateUrl: './dashboard-login.component.html',
  styleUrls: ['./dashboard-login.component.scss']
})
export class DashboardLoginComponent implements OnInit {

  constructor(private afAuth:AngularFireAuth) { }

  ngOnInit(): void {
  }
  logout() {
    this.afAuth.signOut();
  }
}
