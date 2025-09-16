import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  requiredControl = new FormControl('Initial value', [Validators.required]);

  text1:"nimz";
  contactForm:FormGroup;
  contact={
    name:'',
    text:''
  };
submitted=false;
  constructor() { 
    this.createForm();
  }

  createForm():void{
    this.contactForm=new FormGroup({
      'name':new FormControl(this.contact.name,[
        Validators.required,
        Validators.minLength(2)
      ]),
      'text':new FormControl(this.contact.text, Validators.required)
    })
  }
  ngOnInit(): void {
  }
onSubmit(){
  this.submitted=true;
}
}
