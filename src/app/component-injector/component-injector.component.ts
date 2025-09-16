import {
  Component,
  OnInit,
  ViewChild,
  ComponentFactoryResolver,
} from '@angular/core';
import { DynamicDirective } from '../contact/dynamic.directive';
import { TestComponentComponent } from '../../../projects/test-app/src/app/test-component/test-component.component';
import { AdComponent } from './interface.component';
import { AdItem } from './ad-item';
import { InjectorService } from './injector.service';

@Component({
  selector: 'app-component-injector',
  templateUrl: './component-injector.component.html',
  styleUrls: ['./component-injector.component.scss'],
})
export class ComponentInjectorComponent implements OnInit {
  componentInjected: any;
  constructor(
    private InjectorService: InjectorService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  @ViewChild(DynamicDirective, { static: true }) appDynamic!: DynamicDirective;

  ngOnInit(): void {
    // this.componentInjected = this.InjectorService.getComponent();
    this.loadComponent();
  }
  loadComponent() {
    console.log(this.appDynamic.viewContainerRef);
    const dynamicComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        TestComponentComponent
      );
    const viewContainerRef = this.appDynamic.viewContainerRef;
    // viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent<AdComponent>(
      dynamicComponentFactory
    );
  }
}
