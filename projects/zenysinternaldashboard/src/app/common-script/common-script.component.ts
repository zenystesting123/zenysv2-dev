import { Component, OnInit } from "@angular/core";
import { Customer, Sales, SearchTerm, Service } from "src/app/data-models";
import { CommonScriptService } from "./common-script.service";

@Component({
    selector: 'app-common-script',
    templateUrl: './common-script.component.html',
    styleUrls: ['./common-script.component.scss'],
})
export class CommonScriptComponent implements OnInit {
    constructor(private commonScriptService: CommonScriptService) { }
    ngOnInit() {

    }
    async surnameUpdate(userId: string) {
        let customerList: Customer[] = []
        customerList = await this.commonScriptService.getAllCustomerPromise(
            userId
        );
        console.log(customerList.length)
        for (var element of customerList) {
            console.log('customer id' + element.id)
            let surname: string = '';
            let surnameLowercase: string = '';

            if (element.surname) {
                surname = element.surname;
                surnameLowercase = element.surname.toLowerCase();
            }

            let saleList: Sales[] = []
            saleList = await this.commonScriptService.getAllSalePromise(
                userId, element.id
            );
            console.log('sale length' + saleList.length)
            let serviceList: Service[] = []
            serviceList = await this.commonScriptService.getAllServicePromise(
                userId, element.id
            );
            console.log('service length' + serviceList.length)
            for (var sale of saleList) {

                await this.commonScriptService.updateSaleSeachTerm(userId, sale.id, surname, surnameLowercase)
            }
            for (var service of serviceList) {

                await this.commonScriptService.updateServiceSeachTerm(userId, service.id, surname, surnameLowercase)
            }
           
        };
        console.log('completed')
    }

}