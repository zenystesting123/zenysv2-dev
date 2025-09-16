import { Component, OnInit ,ElementRef,ViewChild} from '@angular/core';

@Component({
  selector: 'app-mobilepreview2',
  templateUrl: './mobilepreview2.component.html',
  styleUrls: ['./mobilepreview2.component.scss']
})
export class Mobilepreview2Component implements OnInit {
  prev1:boolean=true;
  prev2:boolean=false;
  prev3:boolean=false;
 

  @ViewChild('printButton') printButton: ElementRef<HTMLElement>;

  constructor() { }

  ngOnInit(): void {
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
    let el: HTMLElement = this.printButton.nativeElement;
    el.click();
  }
  OnSave() {
 
  }
}
