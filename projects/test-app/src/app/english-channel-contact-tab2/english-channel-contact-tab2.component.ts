import {
  Component,
  DoCheck,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/common.service';
import { AddExperiencePopupComponent } from './add-experience-popup/add-experience-popup.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AddExperienceService } from './add-experience.service';
@Component({
  selector: 'app-english-channel-contact-tab2',
  templateUrl: './english-channel-contact-tab2.component.html',
  styleUrls: ['./english-channel-contact-tab2.component.scss'],
})
export class EnglishChannelContactTab2Component implements OnInit, OnChanges {
  customerDetails: any;
  @Input() data: any;

  // @Input('data') data: any;
  private onDestroy$: Subject<void> = new Subject<void>();
  superUserId: any;
  custId: string;
  allAcademics: any;
  allExperience: any;
  displayedColumns1: string[] = [
    'class',
    'boardName',
    'percentage',
    'year',
    'comments',
    'edit/delete',
  ];
  displayedColumns2: string[] = [
    'organizationName',
    'startDate',
    'endDate',
    'position',
    'comments',
    'edit/delete',
  ];

  constructor(
    private common: CommonService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private serv: AddExperienceService
  ) {
    // console.log(this.customerDetailsObservable);
    this.superUserId = this.common.superUserData.superUserId;
    route.params.pipe(takeUntil(this.onDestroy$)).subscribe((val) => {
      // console.log(val);
      //Section 1: Get the information passed on to the module using router link
      this.custId = this.route.snapshot.paramMap.get('custId');
    });
  }

  ngOnInit(): void {
    // console.log(this.data);
    this.customerDetails = this.data.data;
    this.allAcademics = !!this.customerDetails.academicDetails
      ? this.customerDetails.academicDetails
      : [];
    this.allExperience = !!this.customerDetails.organizations
      ? this.customerDetails.organizations
      : [];
    // console.log(this.allAcademics);
  }

  createEditExperience(type, scenario, data, index) {
    // console.log(data);
    // console.log(index);

    let dialogRef = this.dialog.open(AddExperiencePopupComponent, {
      // height: '400px',
      width: '600px',
      data: { type: type, scenario: scenario, data },
    });
    dialogRef.afterClosed().subscribe((data) => {
      // console.log(data);
      if (!!data) {
        if (type == 'academics') {
          //save as academics
          const academics = this.allAcademics;
          if (scenario == 'create') academics.push(data.value);
          if (scenario == 'edit') academics[index] = data.value;
          if (scenario == 'delete' && data == 'Yes') {
            // console.log('delete' + index);
            academics.splice(index, 1);
          }
          this.serv.updateCust(this.superUserId, this.custId, {
            academicDetails: academics,
          });
          // console.log(this.allAcademics);
        } else if (type == 'workExp') {
          //save as workExp
          const experience = this.allExperience;
          if (scenario == 'create') experience.push(data.value);
          if (scenario == 'edit') experience[index] = data.value;
          if (scenario == 'delete' && data == 'Yes')
            experience.splice(index, 1);
          this.serv.updateCust(this.superUserId, this.custId, {
            organizations: experience,
          });
        }
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    console.log(changes.test);
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
