// import { Component, OnInit } from '@angular/core';
import {
  Component,
  OnInit,
  ViewChild,
  ComponentFactoryResolver,
  Input,
  // SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { DynamicDirective } from '../dynamic.directive';
import { TestComponentComponent } from '../test-component/test-component.component';
import { CommonService } from 'src/app/common.service';
import { EnglishChannelContactTab1Component } from '../english-channel-contact-tab1/english-channel-contact-tab1.component';
import { EnglishChannelContactTab2Component } from '../english-channel-contact-tab2/english-channel-contact-tab2.component';
import { EnglishChannelSaleTab1Component } from '../english-channel-sale-tab1/english-channel-sale-tab1.component';
import { MydocumentComponent } from '../english-channel-contact-tab1/mydocument/mydocument.component';
import { AdComponent } from './interface.component';
// import { AdItem } from './ad-item';
import { InjectorService } from './injector.service';

@Component({
  selector: 'app-injector',
  templateUrl: './injector.component.html',
  styleUrls: ['./injector.component.scss'],
})
export class InjectorComponent implements OnInit {
  @Input() data: any;
  componentInjected: any;
  constructor(
    // private InjectorService: InjectorService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private common: CommonService
  ) {
    // console.log(EnglishChannelContactTab1Component);
    // eval('this.loadComponent(EnglishChannelContactTab1Component)');
  }

  @ViewChild(DynamicDirective, { static: true }) appDynamic!: DynamicDirective;
  allComponents: any = {
    EnglishChannelContactTab1Component: MydocumentComponent,
    EnglishChannelContactTab2Component: EnglishChannelContactTab2Component,
    EnglishChannelSaleTab1Component: EnglishChannelSaleTab1Component,
    // ZenysAppCompoenent:ZenysAppComponent
  };

  ngOnInit(): void {
    // this.componentInjected = this.InjectorService.getComponent();
  }
  ngOnChanges(changes: SimpleChanges) {
    // console.log(this.data);
    this.loadComponent(this.allComponents[this.data.component]);
  }
  ngAfterViewInit(): void {
    // console.log(this.data);
    const superUserId = this.common.superUserData.superUserId;
    let string = this.data.component;
    // eval('this.componentReturner(' + string + ')');
    let component = this.allComponents[string];
    this.loadComponent(
      // superUserId,
      // this.data.pageType,
      // this.data.tabValue,
      component
    );
  }
  loadComponent(component) {
    let showComponent = component;

    const dynamicComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(showComponent);
    // console.log(this.appDynamic);
    const viewContainerRef = this.appDynamic.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<any>(
      dynamicComponentFactory
    );
    // console.log(this.data.data);
    componentRef.instance.data = this.data;
  }
}
