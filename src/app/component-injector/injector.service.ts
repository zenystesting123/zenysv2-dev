import { Injectable } from '@angular/core';
// import { HeroJobAdComponent } from './hero-job-ad.component';

// import { HeroProfileComponent } from './hero-profile.component';
import { AdItem } from './ad-item';
import { TestComponentComponent } from 'projects/test-app/src/app/test-component/test-component.component';
@Injectable({
  providedIn: 'root',
})
export class InjectorService {
  constructor() {}
  getComponent() {
    return new AdItem(TestComponentComponent, { name: 'Test', bio: 'Test' });
  }
}
