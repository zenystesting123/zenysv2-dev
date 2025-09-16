import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductModel } from 'src/app/data-models';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductSearchService {
  isLoading: boolean = true;
  options: BehaviorSubject<Product[]> = new BehaviorSubject([]);
  constructor(private firestore: AngularFirestore,) {

  }
  getproductsFromDb(superUserId, _onDestroy) {
    this.firestore
      .collection('users/' + superUserId + '/products', (ref) => ref)
      .snapshotChanges()
      .pipe(takeUntil(_onDestroy))
      .subscribe((products) => {
        let newproducts = products.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as ProductModel;
        });
        // push products to product search list with id and product name
        let list: Product[] = [];
        newproducts.forEach((element) => {
          list.push({
            id: element.id,
            itemName: element.prodName,
            description: element.prodDes,
            unit: element.unit,
            hsnCode: element.hsnCode,
            rate: element.unitPrice,
            discountPercentage: element.discount,
            sgstPercentage: element.sgst,
            cgstPercentage: element.cgst,
            igstPercentage: element.igst,
            vatPercentage: element.vatRate,
          });
        });
        this.options.next(list)
        this.isLoading = false;
      });
  }
}
