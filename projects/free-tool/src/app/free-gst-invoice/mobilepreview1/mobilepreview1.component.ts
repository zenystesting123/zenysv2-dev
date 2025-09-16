import { Component, OnInit, ViewChild , ElementRef, Input} from '@angular/core';

@Component({
  selector: 'app-mobilepreview1',
  templateUrl: './mobilepreview1.component.html',
  styleUrls: ['./mobilepreview1.component.scss']
})
export class Mobilepreview1Component implements OnInit {
  prev1:boolean=true;
  prev2:boolean=false;
  prev3:boolean=false;

  @ViewChild('printButton') printButton:ElementRef<HTMLElement>;

  constructor() { }
  

  ngOnInit() {
  }
mobPrev1()
{
this.prev1=true;
this.prev2=false;
this.prev3=false;

}
mobPrev2()
{
this.prev1=false;
this.prev2=true;
this.prev3=false;

}
mobPrev3()
{
this.prev1=false;
this.prev2=false;
this.prev3=true;
}
triggerFalseClick() {
  console.log(this.printButton);
  let el: HTMLElement = this.printButton.nativeElement;
  el.click();
}
OnSave() {
 
}
}
