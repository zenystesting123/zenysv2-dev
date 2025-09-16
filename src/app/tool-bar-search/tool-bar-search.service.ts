import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Customer, Invoice, Sales, Service } from '../data-models';
@Injectable({
  providedIn: 'root',
})
export class ToolBarSearchService {
  constructor(private db: AngularFirestore) {}
  // for data acces rule is all
  //get customers list
  getCustomers(id: String, searchTerm: string) {
    //search by the first name
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('searchTerm.firstName', '>=', searchTerm)
          .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  getCustomersCompanyName(id: String, searchTerm: string) {
    //search by the company name
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('searchTerm.companyName', '>=', searchTerm)
          .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  getCustomersSecondName(id: String, searchTerm: string) {
    //search by the second name
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('searchTerm.secondName', '>=', searchTerm)
          .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  getCustomersSurname(id: String, searchTerm: string) {
    //search by the second name
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('searchTerm.surname', '>=', searchTerm)
          .where('searchTerm.surname', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  // get sales list
  getSales(id: String, searchTerm: string) {
    //search by the first name
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref
          .where('searchTerm.firstName', '>=', searchTerm)
          .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')

      )
      .snapshotChanges();
  }
    // get service list
    getServices(id: String, searchTerm: string) {
      //search by the first name
      return this.db
        .collection('users/' + id + '/services', (ref) =>
          ref
            .where('searchTerm.firstName', '>=', searchTerm)
            .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')
        )
        .snapshotChanges();
    }
  getSaleCompanyName(id: String, searchTerm: string) {
    //search by the company name
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref
          .where('searchTerm.companyName', '>=', searchTerm)
          .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  getServicesCompanyName(id: String, searchTerm: string) {
    //search by the company name
    return this.db
      .collection('users/' + id + '/services', (ref) =>
        ref
          .where('searchTerm.companyName', '>=', searchTerm)
          .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  getSalesSecondName(id: String, searchTerm: string) {
    //search by the second name
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref
          .where('searchTerm.secondName', '>=', searchTerm)
          .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  getSalesSurname(id: String, searchTerm: string) {
    //search by the second name
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref
          .where('searchTerm.surname', '>=', searchTerm)
          .where('searchTerm.surname', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  getServicesSecondName(id: String, searchTerm: string) {
    //search by the second name
    return this.db
      .collection('users/' + id + '/services', (ref) =>
        ref
          .where('searchTerm.secondName', '>=', searchTerm)
          .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  getServicesSurname(id: String, searchTerm: string) {
    //search by the surname
    return this.db
      .collection('users/' + id + '/services', (ref) =>
        ref
          .where('searchTerm.surname', '>=', searchTerm)
          .where('searchTerm.surname', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  // get quotation list
  getQuotations(id: String, searchTerm: string) {
    //search by the first name
    return this.db
      .collection('users/' + id + '/Quotations', (ref) =>
        ref
          .where('searchTerm.firstName', '>=', searchTerm)
          .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  getQuotationsCompanyName(id: String, searchTerm: string) {
    //search by the company name
    return this.db
      .collection('users/' + id + '/Quotations', (ref) =>
        ref
          .where('searchTerm.companyName', '>=', searchTerm)
          .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  getQuotationsSecondName(id: String, searchTerm: string) {
    //search by the second name
    return this.db
      .collection('users/' + id + '/Quotations', (ref) =>
        ref
          .where('searchTerm.secondName', '>=', searchTerm)
          .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  // get inoice list
  getInvoices(id: String, searchTerm: string) {
    //search by the first name
    return this.db
      .collection('users/' + id + '/Invoices', (ref) =>
        ref
          .where('searchTerm.firstName', '>=', searchTerm)
          .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  getInvoicesCompanyName(id: String, searchTerm: string) {
    //search by the company name
    return this.db
      .collection('users/' + id + '/Invoices', (ref) =>
        ref
          .where('searchTerm.companyName', '>=', searchTerm)
          .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  getInvoicesSecondName(id: String, searchTerm: string) {
    //search by the second name
    return this.db
      .collection('users/' + id + '/Invoices', (ref) =>
        ref
          .where('searchTerm.secondName', '>=', searchTerm)
          .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  // get estimate list
  getEstimates(id: String, searchTerm: string) {
    //search by the first name
    return this.db
      .collection('users/' + id + '/Estimates', (ref) =>
        ref
          .where('searchTerm.firstName', '>=', searchTerm)
          .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  getEstimatesCompanyName(id: String, searchTerm: string) {
    //search by the company name
    return this.db
      .collection('users/' + id + '/Estimates', (ref) =>
        ref
          .where('searchTerm.companyName', '>=', searchTerm)
          .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
  getEstimatesSecondName(id: String, searchTerm: string) {
    //search by the second name
    return this.db
      .collection('users/' + id + '/Estimates', (ref) =>
        ref
          .where('searchTerm.secondName', '>=', searchTerm)
          .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')

      )
      .snapshotChanges();
  }

  //sub user
  // gets customer list
  getCustomersSubUser(id: String, searchTerm: string, userId) {
    //search by the first name
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('searchTerm.firstName', '>=', searchTerm)
          .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')
          .where('assignedTo', '==', userId)
      )
      .snapshotChanges();
  }
  getCustomersCompanyNameSubUser(id: String, searchTerm: string, userId) {
    //search by the company name
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('searchTerm.companyName', '>=', searchTerm)
          .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')
          .where('assignedTo', '==', userId)
      )
      .snapshotChanges();
  }
  getCustomersSecondNameSubUser(id: String, searchTerm: string, userId) {
    //search by the second name
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('searchTerm.secondName', '>=', searchTerm)
          .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')
          .where('assignedTo', '==', userId)
      )
      .snapshotChanges();
  }
  getCustomersSurnameSubUser(id: String, searchTerm: string, userId) {
    //search by the second name
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('searchTerm.surname', '>=', searchTerm)
          .where('searchTerm.surname', '<=', searchTerm + '\uf8ff')
          .where('assignedTo', '==', userId)
      )
      .snapshotChanges();
  }
  // get sales list
  getSalesSubUser(id: String, searchTerm: string, userId) {
    //search by the first name
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref
          .where('searchTerm.firstName', '>=', searchTerm)
          .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')
          .where('assignedTo', '==', userId)
      )
      .snapshotChanges();
  }
  getSaleCompanyNameSubUser(id: String, searchTerm: string, userId) {
    //search by the company name
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref
          .where('searchTerm.companyName', '>=', searchTerm)
          .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')
          .where('assignedTo', '==', userId)
      )
      .snapshotChanges();
  }
  getSalesSecondNameSubUser(id: String, searchTerm: string, userId) {
    //search by the second name
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref
          .where('searchTerm.secondName', '>=', searchTerm)
          .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')
          .where('assignedTo', '==', userId)
      )
      .snapshotChanges();
  }
  getSalesSurnameSubUser(id: String, searchTerm: string, userId) {
    //search by the surname
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref
          .where('searchTerm.surname', '>=', searchTerm)
          .where('searchTerm.surname', '<=', searchTerm + '\uf8ff')
          .where('assignedTo', '==', userId)
      )
      .snapshotChanges();
  }
//service
  getServicesSubUser(id: String, searchTerm: string, userId) {
    //search by the first name
    return this.db
      .collection('users/' + id + '/services', (ref) =>
        ref
          .where('searchTerm.firstName', '>=', searchTerm)
          .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')
          .where('assignedTo', '==', userId)
      )
      .snapshotChanges();
  }
  getServicesCompanyNameSubUser(id: String, searchTerm: string, userId) {
    //search by the company name
    return this.db
      .collection('users/' + id + '/services', (ref) =>
        ref
          .where('searchTerm.companyName', '>=', searchTerm)
          .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')
          .where('assignedTo', '==', userId)
      )
      .snapshotChanges();
  }
  getServicesSecondNameSubUser(id: String, searchTerm: string, userId) {
    //search by the second name
    return this.db
      .collection('users/' + id + '/services', (ref) =>
        ref
          .where('searchTerm.secondName', '>=', searchTerm)
          .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')
          .where('assignedTo', '==', userId)
      )
      .snapshotChanges();
  }
  getServicesSurnameSubUser(id: String, searchTerm: string, userId) {
    //search by the surname
    return this.db
      .collection('users/' + id + '/services', (ref) =>
        ref
          .where('searchTerm.surname', '>=', searchTerm)
          .where('searchTerm.surname', '<=', searchTerm + '\uf8ff')
          .where('assignedTo', '==', userId)
      )
      .snapshotChanges();
  }
  // get quotation list
  // getQuotationsSubUser(id: String, searchTerm: string, userId) {
  //   //search by the first name
  //   return this.db
  //     .collection('users/' + id + '/Quotations', (ref) =>
  //       ref
  //         .where('searchTerm.firstName', '>=', searchTerm)
  //         .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')
  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges();
  // }
  // getQuotationsCompanyNameSubUser(id: String, searchTerm: string, userId) {
  //   //search by the company name
  //   return this.db
  //     .collection('users/' + id + '/Quotations', (ref) =>
  //       ref
  //         .where('searchTerm.companyName', '>=', searchTerm)
  //         .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')
  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges();
  // }
  // getQuotationsSecondNameSubUser(id: String, searchTerm: string, userId) {
  //   //search by the second name
  //   return this.db
  //     .collection('users/' + id + '/Quotations', (ref) =>
  //       ref
  //         .where('searchTerm.secondName', '>=', searchTerm)
  //         .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')

  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges();
  // }
  // get invoice list
  // getInvoicesSubUser(id: String, searchTerm: string, userId) {
  //   //search by the first name
  //   return this.db
  //     .collection('users/' + id + '/Invoices', (ref) =>
  //       ref
  //         .where('searchTerm.firstName', '>=', searchTerm)
  //         .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')

  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges();
  // }
  // getInvoicesCompanyNameSubUser(id: String, searchTerm: string, userId) {
  //   //search by the company name
  //   return this.db
  //     .collection('users/' + id + '/Invoices', (ref) =>
  //       ref
  //         .where('searchTerm.companyName', '>=', searchTerm)
  //         .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')

  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges();
  // }
  // getInvoicesSecondNameSubUser(id: String, searchTerm: string, userId) {
  //   //search by the second name
  //   return this.db
  //     .collection('users/' + id + '/Invoices', (ref) =>
  //       ref
  //         .where('searchTerm.secondName', '>=', searchTerm)
  //         .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')

  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges();
  // }
  // get estimate list
  // getEstimatesSubUser(id: String, searchTerm: string, userId) {
  //   //search by the first name
  //   return this.db
  //     .collection('users/' + id + '/Estimates', (ref) =>
  //       ref
  //         .where('searchTerm.firstName', '>=', searchTerm)
  //         .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')

  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges();
  // }
  // getEstimatesCompanyNameSubUser(id: String, searchTerm: string, userId) {
  //   //search by the company name
  //   return this.db
  //     .collection('users/' + id + '/Estimates', (ref) =>
  //       ref
  //         .where('searchTerm.companyName', '>=', searchTerm)
  //         .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')

  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges();
  // }
  // getEstimatesSecondNameSubUser(id: String, searchTerm: string, userId) {
  //   //search by the second name
  //   return this.db
  //     .collection('users/' + id + '/Estimates', (ref) =>
  //       ref
  //         .where('searchTerm.secondName', '>=', searchTerm)
  //         .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')

  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges();
  // }
  //get customers list with contact number
  getCustomersWithNumber(id: String, searchTerm: string) {
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref.where('contactNo', '==', searchTerm)
      )
      .snapshotChanges();
  }
  getCustomersWithAltNumber(id: String, searchTerm: string) {
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref.where('alternateContactNumber', '==', searchTerm)
      )
      .snapshotChanges();
  }
  //get customers list sub user with contact number
  getSubUserCustomersWithNumber(
    id: String,
    userId: string,
    searchTerm: string
  ) {
    //search by the first name
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('contactNo', '==', searchTerm)
          .where('assignedTo', '==', userId)
      )
      .snapshotChanges();
  }
    //get customers list sub user with contact altnumber
    getSubUserCustomersWithAltNumber(
      id: String,
      userId: string,
      searchTerm: string
    ) {
      //search by the first name
      return this.db
        .collection('users/' + id + '/customers', (ref) =>
          ref
            .where('alternateContactNumber', '==', searchTerm)
            .where('assignedTo', '==', userId)
        )
        .snapshotChanges();
    }
  //get customers list with email
  getCustomersWithEmail(id: String, searchTerm: string) {
    //search by the first name
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref.where('email', '==', searchTerm)
      )
      .snapshotChanges();
  }
  //get customers list sub user with email
  getSubUserCustomersWithEmail(id: String, userId: string, searchTerm: string) {
    //search by the first name
    return this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('email', '==', searchTerm)
          .where('assignedTo', '==', userId)
      )
      .snapshotChanges();
  }
  // gets customer list team
  async getCustomersTeam(
    id: String,
    searchTerm: string,
    userId
  ): Promise<Customer[]> {
    //search by the first name
    return await this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('searchTerm.firstName', '>=', searchTerm)
          .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')

          .where('assignedTo', '==', userId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Customer)
          )
        )
      )
      .toPromise();
  }
  async getCustomersCompanyNameTeam(
    id: String,
    searchTerm: string,
    userId
  ): Promise<Customer[]> {
    //search by the company name
    return await this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('searchTerm.companyName', '>=', searchTerm)
          .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')

          .where('assignedTo', '==', userId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Customer)
          )
        )
      )
      .toPromise();
  }
  async getCustomersSecondNameTeam(
    id: String,
    searchTerm: string,
    userId
  ): Promise<Customer[]> {
    //search by the second name
    return await this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('searchTerm.secondName', '>=', searchTerm)
          .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')

          .where('assignedTo', '==', userId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Customer)
          )
        )
      )
      .toPromise();
  }
  async getCustomersSurnameTeam(
    id: String,
    searchTerm: string,
    userId
  ): Promise<Customer[]> {
    //search by the second name
    return await this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('searchTerm.surname', '>=', searchTerm)
          .where('searchTerm.surname', '<=', searchTerm + '\uf8ff')

          .where('assignedTo', '==', userId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Customer)
          )
        )
      )
      .toPromise();
  }
  // get sales list Team
  async getSalesTeam(id: String, searchTerm: string, userId): Promise<Sales[]> {
    //search by the first name
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref
          .where('searchTerm.firstName', '>=', searchTerm)
          .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')

          .where('assignedTo', '==', userId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Sales)
          )
        )
      )
      .toPromise();
  }
  async getSaleCompanyNameTeam(
    id: String,
    searchTerm: string,
    userId
  ): Promise<Sales[]> {
    //search by the company name
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref
          .where('searchTerm.companyName', '>=', searchTerm)
          .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')

          .where('assignedTo', '==', userId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Sales)
          )
        )
      )
      .toPromise();
  }
  async getSalesSecondNameTeam(
    id: String,
    searchTerm: string,
    userId
  ): Promise<Sales[]> {
    //search by the second name
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref
          .where('searchTerm.secondName', '>=', searchTerm)
          .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')

          .where('assignedTo', '==', userId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Sales)
          )
        )
      )
      .toPromise();
  }
  async getSalesSurnameTeam(
    id: String,
    searchTerm: string,
    userId
  ): Promise<Sales[]> {
    //search by the second name
    return this.db
      .collection('users/' + id + '/sales', (ref) =>
        ref
          .where('searchTerm.surname', '>=', searchTerm)
          .where('searchTerm.surname', '<=', searchTerm + '\uf8ff')

          .where('assignedTo', '==', userId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Sales)
          )
        )
      )
      .toPromise();
  }
  async getServicesTeam(id: String, searchTerm: string, userId): Promise<Service[]> {
    //search by the first name
    return this.db
      .collection('users/' + id + '/services', (ref) =>
        ref
          .where('searchTerm.firstName', '>=', searchTerm)
          .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')

          .where('assignedTo', '==', userId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Service)
          )
        )
      )
      .toPromise();
  }
  async getServicesCompanyNameTeam(
    id: String,
    searchTerm: string,
    userId
  ): Promise<Service[]> {
    //search by the company name
    return this.db
      .collection('users/' + id + '/services', (ref) =>
        ref
          .where('searchTerm.companyName', '>=', searchTerm)
          .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')

          .where('assignedTo', '==', userId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Service)
          )
        )
      )
      .toPromise();
  }
  async getServicesSecondNameTeam(
    id: String,
    searchTerm: string,
    userId
  ): Promise<Service[]> {
    //search by the second name
    return this.db
      .collection('users/' + id + '/services', (ref) =>
        ref
          .where('searchTerm.secondName', '>=', searchTerm)
          .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')

          .where('assignedTo', '==', userId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Service)
          )
        )
      )
      .toPromise();
  }
  async getServicesSurnameTeam(
    id: String,
    searchTerm: string,
    userId
  ): Promise<Service[]> {
    //search by the surname
    return this.db
      .collection('users/' + id + '/services', (ref) =>
        ref
          .where('searchTerm.surname', '>=', searchTerm)
          .where('searchTerm.surname', '<=', searchTerm + '\uf8ff')

          .where('assignedTo', '==', userId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Service)
          )
        )
      )
      .toPromise();
  }
  // get estimate list Team
  // async getEstimatesTeam(
  //   id: String,
  //   searchTerm: string,
  //   userId
  // ): Promise<Invoice[]> {
  //   //search by the first name
  //   return await this.db
  //     .collection('users/' + id + '/Estimates', (ref) =>
  //       ref
  //         .where('searchTerm.firstName', '>=', searchTerm)
  //         .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')

  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges()
  //     .pipe(take(1))
  //     .pipe(
  //       map((actions) =>
  //         actions.map(
  //           (a) =>
  //             ({
  //               id: a.payload.doc.id,
  //               ...(a.payload.doc.data() as {}),
  //             } as Invoice)
  //         )
  //       )
  //     )
  //     .toPromise();
  // }
  // async getEstimatesCompanyNameTeam(
  //   id: String,
  //   searchTerm: string,
  //   userId
  // ): Promise<Invoice[]> {
  //   //search by the company name
  //   return await this.db
  //     .collection('users/' + id + '/Estimates', (ref) =>
  //       ref
  //         .where('searchTerm.companyName', '>=', searchTerm)
  //         .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')

  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges()
  //     .pipe(take(1))
  //     .pipe(
  //       map((actions) =>
  //         actions.map(
  //           (a) =>
  //             ({
  //               id: a.payload.doc.id,
  //               ...(a.payload.doc.data() as {}),
  //             } as Invoice)
  //         )
  //       )
  //     )
  //     .toPromise();
  // }
  // async getEstimatesSecondNameTeam(
  //   id: String,
  //   searchTerm: string,
  //   userId
  // ): Promise<Invoice[]> {
  //   //search by the second name
  //   return await this.db
  //     .collection('users/' + id + '/Estimates', (ref) =>
  //       ref
  //         .where('searchTerm.secondName', '>=', searchTerm)
  //         .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')

  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges()
  //     .pipe(take(1))
  //     .pipe(
  //       map((actions) =>
  //         actions.map(
  //           (a) =>
  //             ({
  //               id: a.payload.doc.id,
  //               ...(a.payload.doc.data() as {}),
  //             } as Invoice)
  //         )
  //       )
  //     )
  //     .toPromise();
  // }
  // get quotation list
  // async getQuotationsTeam(
  //   id: String,
  //   searchTerm: string,
  //   userId
  // ): Promise<Invoice[]> {
  //   //search by the first name
  //   return await this.db
  //     .collection('users/' + id + '/Quotations', (ref) =>
  //       ref
  //         .where('searchTerm.firstName', '>=', searchTerm)
  //         .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')

  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges()
  //     .pipe(take(1))
  //     .pipe(
  //       map((actions) =>
  //         actions.map(
  //           (a) =>
  //             ({
  //               id: a.payload.doc.id,
  //               ...(a.payload.doc.data() as {}),
  //             } as Invoice)
  //         )
  //       )
  //     )
  //     .toPromise();
  // }
  // async getQuotationsCompanyNameTeam(
  //   id: String,
  //   searchTerm: string,
  //   userId
  // ): Promise<Invoice[]> {
  //   //search by the company name
  //   return await this.db
  //     .collection('users/' + id + '/Quotations', (ref) =>
  //       ref
  //         .where('searchTerm.companyName', '>=', searchTerm)
  //         .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')

  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges()
  //     .pipe(take(1))
  //     .pipe(
  //       map((actions) =>
  //         actions.map(
  //           (a) =>
  //             ({
  //               id: a.payload.doc.id,
  //               ...(a.payload.doc.data() as {}),
  //             } as Invoice)
  //         )
  //       )
  //     )
  //     .toPromise();
  // }
  // async getQuotationsSecondNameTeam(
  //   id: String,
  //   searchTerm: string,
  //   userId
  // ): Promise<Invoice[]> {
  //   //search by the second name
  //   return await this.db
  //     .collection('users/' + id + '/Quotations', (ref) =>
  //       ref
  //         .where('searchTerm.secondName', '>=', searchTerm)
  //         .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')

  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges()
  //     .pipe(take(1))
  //     .pipe(
  //       map((actions) =>
  //         actions.map(
  //           (a) =>
  //             ({
  //               id: a.payload.doc.id,
  //               ...(a.payload.doc.data() as {}),
  //             } as Invoice)
  //         )
  //       )
  //     )
  //     .toPromise();
  // }
  // get invoice list
  // async getInvoicesTeam(id: String, searchTerm: string, userId): Promise<Invoice[]>  {
  //   //search by the first name
  //   return await this.db
  //     .collection('users/' + id + '/Invoices', (ref) =>
  //       ref
  //         .where('searchTerm.firstName', '>=', searchTerm)
  //         .where('searchTerm.firstName', '<=', searchTerm + '\uf8ff')

  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges()
  //     .pipe(take(1))
  //     .pipe(
  //       map((actions) =>
  //         actions.map(
  //           (a) =>
  //             ({
  //               id: a.payload.doc.id,
  //               ...(a.payload.doc.data() as {}),
  //             } as Invoice)
  //         )
  //       )
  //     )
  //     .toPromise();
  // }
  // async getInvoicesCompanyNameTeam(id: String, searchTerm: string, userId): Promise<Invoice[]>  {
  //   //search by the company name
  //   return await this.db
  //     .collection('users/' + id + '/Invoices', (ref) =>
  //       ref
  //         .where('searchTerm.companyName', '>=', searchTerm)
  //         .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')

  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges()
  //     .pipe(take(1))
  //     .pipe(
  //       map((actions) =>
  //         actions.map(
  //           (a) =>
  //             ({
  //               id: a.payload.doc.id,
  //               ...(a.payload.doc.data() as {}),
  //             } as Invoice)
  //         )
  //       )
  //     )
  //     .toPromise();
  // }
  // async getInvoicesSecondNameTeam(id: String, searchTerm: string, userId) : Promise<Invoice[]> {
  //   //search by the second name
  //   return await this.db
  //     .collection('users/' + id + '/Invoices', (ref) =>
  //       ref
  //         .where('searchTerm.secondName', '>=', searchTerm)
  //         .where('searchTerm.secondName', '<=', searchTerm + '\uf8ff')

  //         .where('docData.saleAssignedToOwner', '==', userId)
  //     )
  //     .snapshotChanges()
  //     .pipe(take(1))
  //     .pipe(
  //       map((actions) =>
  //         actions.map(
  //           (a) =>
  //             ({
  //               id: a.payload.doc.id,
  //               ...(a.payload.doc.data() as {}),
  //             } as Invoice)
  //         )
  //       )
  //     )
  //     .toPromise();
  // }
    //get customers list sub user with contact number
  async  getTeamCustomersWithNumber (
      id: String,
      userId: string,
      searchTerm: string
    ) : Promise<Customer[]>{
      //search by the first name
      return this.db
        .collection('users/' + id + '/customers', (ref) =>
          ref
            .where('contactNo', '==', searchTerm)
            .where('assignedTo', '==', userId)
        )
        .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Customer)
          )
        )
      )
      .toPromise();
    }
    async  getTeamCustomersWithAltNumber (
      id: String,
      userId: string,
      searchTerm: string
    ) : Promise<Customer[]>{
      //search by the first name
      return this.db
        .collection('users/' + id + '/customers', (ref) =>
          ref
            .where('alternateContactNumber', '==', searchTerm)
            .where('assignedTo', '==', userId)
        )
        .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Customer)
          )
        )
      )
      .toPromise();
    }
     //get customers list sub user with email
 async getTeamCustomersWithEmail(id: String, userId: string, searchTerm: string) : Promise<Customer[]>{
    //search by the first name
    return await this.db
      .collection('users/' + id + '/customers', (ref) =>
        ref
          .where('email', '==', searchTerm)
          .where('assignedTo', '==', userId)
      )
      .snapshotChanges()
      .pipe(take(1))
      .pipe(
        map((actions) =>
          actions.map(
            (a) =>
              ({
                id: a.payload.doc.id,
                ...(a.payload.doc.data() as {}),
              } as Customer)
          )
        )
      )
      .toPromise();
  }
  getOrgWithNumber(id: String, searchTerm: string) {
    return this.db
      .collection('users/' + id + '/Organisations', (ref) =>
        ref.where('contactNo', '==', searchTerm)
      )
      .snapshotChanges();
  }
  getOrgWithEmail(id: String, searchTerm: string) {
    return this.db
      .collection('users/' + id + '/Organisations', (ref) =>
        ref.where('email', '==', searchTerm)
      )
      .snapshotChanges();
  }
  getOrgCompanyName(id: String, searchTerm: string) {
    //search by the company name
    return this.db
      .collection('users/' + id + '/Organisations', (ref) =>
        ref
          .where('searchTerm.companyName', '>=', searchTerm)
          .where('searchTerm.companyName', '<=', searchTerm + '\uf8ff')
      )
      .snapshotChanges();
  }
}
