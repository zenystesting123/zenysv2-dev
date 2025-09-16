import { Component, OnInit } from '@angular/core';
import { SplashScreenService } from './splash-screen.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {
public opacityChange = 1;
public splashTransition;
public showSplash = true;
readonly ANIMATION_DURATION = 1;

private hideSplashAnimation() {
  this.splashTransition = `opacity ${this.ANIMATION_DURATION}s`;
  this.opacityChange = 0;
  setTimeout(() => {
     this.showSplash = !this.showSplash;
  }, 1000);
}

  constructor(private splashService:SplashScreenService) { }

  ngOnInit(): void {
    this.splashService.subscribe(res => {
      this.hideSplashAnimation();
    });
  }

}
