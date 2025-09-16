/*------------------------------------------------------
Description : Firebase ui is used for the login

--------------------------------------------------------- */
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { CommonService } from '../common.service';
import { takeUntil } from 'rxjs/operators';
import { I } from '@angular/cdk/keycodes';
import { LoginService } from './login.service';
import { InvitationModel } from '../data-models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isMobilesize: boolean = false; // checks for mobile size
  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();
  constructor(
    private titleService: Title,
    private router: Router,
    private commonService: CommonService,
    private serviceInstance: LoginService
  ) {
    this.titleService.setTitle('Zenys login'); // set the title
  }

  ngOnInit(): void {
    // subscribe user details from common service
    this.commonService.userDatas
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((datas) => {
        if (datas) {
          if (datas.authDetails) {
            //get auth datas and if user signed in navigate to home page
            // we have to check in invitation if the user is blocked or if any invitation is pending
            if(datas.userDetails){
              if (datas.userDetails.accessLockAutologout === true) {
                this.router.navigate(['/user-login-locked']);
              }
            }
            this.serviceInstance
              .getInvitations(datas.authDetails.email)
              .pipe(takeUntil(this.onDestroy$))
              .subscribe((inv) => {
                if (inv?.length === 0) {
                  this.router.navigate(['/dash/home']);
                } else {
                  let doc = inv.map((e) => {
                    return {
                      id: e.payload.doc.id,
                      ...(e.payload.doc.data() as {}),
                    } as InvitationModel;
                  });

                  if (doc) {
                    if (doc[0]) {
                      // check for pending invitations
                      if (doc[0].status == 'invited') {
                        this.router.navigate(['/create-sub-profile']);
                      } else {
                        this.router.navigate(['/dash/home']);
                      }
                    }
                  }
                }
              });
          } else {
          }
          this.isMobilesize = datas.isMobileSize; // get mobile size check
        }
      });
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    // on destroy
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
