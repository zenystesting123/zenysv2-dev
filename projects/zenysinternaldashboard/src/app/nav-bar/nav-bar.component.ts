import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(
    private afAuth:AngularFireAuth,
    private router:Router
  ) { }

  ngOnInit(): void {
  }
  logout() {
    this.afAuth.signOut();
    this.router.navigate(['/zenysinternaldashboard/login'])
  }

}
