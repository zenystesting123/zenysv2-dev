/*------------------------------------------------------
Description : if a subuser exceeded maximum number of permitted auto logouts, login is disabled
              and route to this page to show this message

--------------------------------------------------------- */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from '../common.service';
import { AccessDeniedService } from './access-denied.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss'],
})
export class AccessDeniedComponent implements OnInit {
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(
    private commonService: CommonService,
    private serviceInstance: AccessDeniedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('ng on init')
    // subscribe user details from common service
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((datas) => {
        if (datas) {
          if (datas.authDetails) {
            // we have to check in invitation if the user is blocked or unblocked
            if(datas.userDetails.accessLockAutologout === false){
              this.router.navigate(['/dash/home']);
            }
          }else{
            this.router.navigate([''])
          }
        }
      });
  }
}
