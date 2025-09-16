import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.scss']
})
export class HomeContentComponent implements OnInit {
  panelOpenState = false;
  constructor(private titleService: Title,  private router: Router,  private analytics: AngularFireAnalytics,) {
    this.titleService.setTitle(" Free online GST invoice generator | Download excel format");

  }

  ngOnInit(): void {

  }
  onLogIn(){
    this.analytics.logEvent('btn_signup_freetool');
    //this.router.navigate(['/login'])
  }

}
