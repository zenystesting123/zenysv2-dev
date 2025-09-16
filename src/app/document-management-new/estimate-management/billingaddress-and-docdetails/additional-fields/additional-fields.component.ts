/*------------------------------------------------
Description : For handle additional field display
----------------------------------------------------*/
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EstimateService } from '../../estimate.service';
import { ChangeLogComponent } from 'src/app/change-log/change-log.component';

@Component({
  selector: 'app-additional-fields',
  templateUrl: './additional-fields.component.html',
  styleUrls: ['./additional-fields.component.scss']
})
export class AdditionalFieldsComponent implements OnInit {

  constructor(public estimateService: EstimateService) {}
  //get form frm service
  get form(): FormGroup {
    return this.estimateService.additionalFieldForm;
  }
  ngOnInit(): void {
    //get form values before change
    this.estimateService.prevAdditionalFieldForm = ChangeLogComponent.cloneAbstractControl(this.form);
  }

}
