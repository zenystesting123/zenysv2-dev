# Sales Subcollection Operations Documentation

## Overview
This document provides a comprehensive analysis of all reads and writes to nested subcollection items under the `sales` subcollection under the `users` collection in the Zenys Angular Material application.

## Collection Structure
```
users/{userId}/sales/{saleId}/
├── items/          (Product/Service items)
├── attachments/    (File attachments)
├── documents/      (Generated documents)
└── notes/          (Sales notes)
```

---

## 📝 WRITE OPERATIONS

### 1. Sales Document Operations

#### Create Operations
| File | Method | Operation | Description |
|------|--------|-----------|-------------|
| `src/app/addnewsale1/addnewsale1.service.ts` | `createSale()` | `collection().add()` | Create new sale document |
| `src/app/free-tool/document-form/document-form.service.ts` | `createSale()` | `collection().add()` | Create sale for document |

#### Update Operations
| File | Method | Operation | Description |
|------|--------|-----------|-------------|
| `src/app/addnewsale1/addnewsale1.service.ts` | `updateSale()` | `doc().update()` | Update sale with status change |
| `src/app/addnewsale1/addnewsale1.service.ts` | `updateSaleWithStatus()` | `doc().update()` | Update sale with specific status |
| `src/app/invoice-generator/invoice-generator.service.ts` | `setSaleDocInvValue()` | `doc().update()` | Set invoice values for sale |

### 2. Sales Assignment Operations

| File | Method | Operation | Description |
|------|--------|-----------|-------------|
| `src/app/contact/re-assign-sale/re-assign-sale.service.ts` | `onUpdateSaleMain()` | `doc().update()` | Update sale assignment (main user) |
| `src/app/contact/re-assign-sale/re-assign-sale.service.ts` | `onUpdateSaleSub()` | `doc().update()` | Update sale assignment (sub user) |
| `src/app/contact/customer-details/customer-details.service.ts` | `onUpdateSale()` | `doc().update()` | Update sale assignment |
| `src/app/sales-view/sale/sale.service.ts` | `updateAssignedTo()` | `doc().update()` | Update sale assignment |

### 3. Sales Status & Priority Operations

| File | Method | Operation | Description |
|------|--------|-----------|-------------|
| `src/app/settings/pipeline-and-stages/pipeline-and-stages/pipeline-and-stages.service.ts` | `updateSalesStage()` | `doc().update()` | Update sales stage |
| `src/app/table/sale/sale-grid/sale-grid.service.ts` | `updateStatus()` | `doc().update()` | Update sale status |
| `src/app/sales-view/sale/sale.service.ts` | `updateStatus()` | `doc().update()` | Update sale status |
| `src/app/changesalestatdialog/changesalestat.service.ts` | `updateStatus()` | `doc().update()` | Update sale status |
| `src/app/changesaleprioritydialog/changesalepriority.service.ts` | `updateSalePriority()` | `doc().update()` | Update sale priority |

### 4. Sales Value & Branch Operations

| File | Method | Operation | Description |
|------|--------|-----------|-------------|
| `src/app/sales-view/salesdetails/salesdetails.service.ts` | `updateSaleEstValue()` | `doc().update()` | Update estimated value |
| `src/app/sales-view/salesdetails/salesdetails.service.ts` | `updateBranch()` | `doc().update()` | Update associated branch |
| `src/app/changesalestatdialog/changesalestat.service.ts` | `updateSaleEstValue()` | `doc().update()` | Update estimated value |

---

## 📖 READ OPERATIONS

### Sales Collection Queries

| File | Method | Operation | Description |
|------|--------|-----------|-------------|
| `src/app/table/sale/sale-list/sale-table.service.ts` | `getData()` | `collection().snapshotChanges()` | Get sales with pagination & filters |
| `projects/zenysinternaldashboard/src/app/script-customfields/customfields.service.ts` | `getAllSales()` | `collection().snapshotChanges()` | Get all sales for user |
| `projects/zenysinternaldashboard/src/app/upload-sale/upload-sale.service.ts` | `getSales()` | `collection().snapshotChanges()` | Get sales ordered by date |
| `src/app/settings/subusers/subusers.service.ts` | `getSaleWithSubsuer()` | `collection().snapshotChanges()` | Get sales assigned to subuser |
| `src/app/contact/customer-details/customer-details.service.ts` | `getSales()` | `collection().snapshotChanges()` | Get sales by customer ID |
| `src/app/contact/customerview/customerview.service.ts` | `getSales()` | `collection().snapshotChanges()` | Get sales by customer ID with access rules |

---

## 🔗 NESTED SUBCOLLECTION OPERATIONS

### 1. Items Subcollection (`/sales/{saleId}/items/`)

#### Write Operations
| File | Method | Operation | Description |
|------|--------|-----------|-------------|
| `src/app/sales-view/salesdetails/salesdetails.service.ts` | `addProduct()` | `collection().add()` | Add product to sale |
| `src/app/sales-view/sale/sale.service.ts` | `addProduct()` | `collection().add()` | Add product to sale |
| `src/app/changesalestatdialog/changesalestat.service.ts` | `addProduct()` | `collection().add()` | Add product to sale |
| `src/app/sales-view/salesdetails/salesdetails.service.ts` | `updateProduct()` | `doc().update()` | Update product details |
| `src/app/changesalestatdialog/changesalestat.service.ts` | `updateProduct()` | `doc().update()` | Update product details |
| `src/app/sales-view/salesdetails/salesdetails.service.ts` | `deleteProduct()` | `doc().delete()` | Delete product from sale |
| `src/app/changesalestatdialog/changesalestat.service.ts` | `deleteProduct()` | `doc().delete()` | Delete product from sale |
| `src/app/sales-view/salesdetails/salesdetails.service.ts` | `updateItemField()` | `doc().update()` | Update item additional fields |
| `src/app/settings/status-popup/status-popup.service.ts` | `updateItemAddFields()` | `doc().update()` | Update item additional fields |

#### Read Operations
| File | Method | Operation | Description |
|------|--------|-----------|-------------|
| `src/app/settings/status-popup/status-popup.service.ts` | `getItemsWithAddFields()` | `collection().snapshotChanges()` | Get items with additional fields |

### 2. Attachments Subcollection (`/sales/{saleId}/attachments/`)

#### Write Operations
| File | Method | Operation | Description |
|------|--------|-----------|-------------|
| `src/app/sales-view/salesdetails/salesdetails.service.ts` | `addAttachment()` | `collection().add()` | Add attachment to sale |
| `src/app/sales-view/salesdetails/salesdetails.service.ts` | `updateAttachmentShareStatus()` | `doc().update()` | Update attachment share status |
| `src/app/confirmationpopup/confirmationpopup.service.ts` | `deleteAttachment()` | `doc().delete()` | Delete attachment |

#### Read Operations
| File | Method | Operation | Description |
|------|--------|-----------|-------------|
| `src/app/sales-view/salesdetails/salesdetails.service.ts` | `getAttachments()` | `collection().snapshotChanges()` | Get attachments ordered by date |

### 3. Documents Subcollection (`/sales/{saleId}/documents/`)

#### Read Operations
| File | Method | Operation | Description |
|------|--------|-----------|-------------|
| `src/app/sales-view/salesdetails/salesdetails.service.ts` | `getDocuments()` | `collection().snapshotChanges()` | Get generated documents |

### 4. Notes Subcollection (`/sales/{saleId}/notes/`)

#### Write Operations
| File | Method | Operation | Description |
|------|--------|-----------|-------------|
| `src/app/sales-view/salesdetails/salesdetails.service.ts` | `writeNote()` | `collection().add()` | Add note to sale |

---

## 📊 Summary Statistics

- **Total Sales Document Operations**: 15+ write operations, 6+ read operations
- **Total Items Subcollection Operations**: 8+ write operations, 1+ read operation  
- **Total Attachments Subcollection Operations**: 3+ write operations, 1+ read operation
- **Total Documents Subcollection Operations**: 0 write operations, 1+ read operation
- **Total Notes Subcollection Operations**: 1+ write operation, 0 read operations

## 🔍 Key Patterns Found

1. **Most Active Subcollection**: `items` (products/services)
2. **Most Common Operation**: `update()` on sales documents
3. **Primary Use Case**: CRM sales pipeline management
4. **Data Access Patterns**: Role-based access (main user vs sub users)
5. **Nested Structure**: 4 levels deep (`users/{userId}/sales/{saleId}/subcollection/{itemId}`)

## 🏗️ Architecture Notes

### Data Flow
1. **Sales Creation**: New sales are created at the main collection level
2. **Item Management**: Products/services are managed in the `items` subcollection
3. **File Management**: Attachments are stored in the `attachments` subcollection
4. **Document Generation**: Generated documents are stored in the `documents` subcollection
5. **Note Taking**: Sales notes are stored in the `notes` subcollection

### Security Considerations
- All operations are scoped to the user's own sales collection
- Sub-user access is controlled through assignment fields
- Data access rules are implemented for different user roles

### Performance Considerations
- Pagination is implemented for large sales collections
- Queries are optimized with proper indexing
- Snapshot changes are used for real-time updates

---

## 📝 Code Examples

### Creating a Sale
```typescript
// From addnewsale1.service.ts
createSale(id, datePlaced, firstName, secondName, surname, companyName, assignedToName, form, sid, stages, updateDate, fieldArray, searchTerm, saleSequenceNumber, inPipeline, won, lost, changeLog) {
  return this.db.collection('users/' + sid + '/sales').add({
    ...form,
    createdDate: datePlaced,
    firstName: firstName,
    secondName: secondName,
    surname: surname,
    companyName: companyName,
    assignedToName: assignedToName,
    customerId: id,
    collectedAmount: 0,
    additionalFieldsArr: fieldArray,
    currentStatusDate: updateDate,
    searchTerm: searchTerm,
    sequenceNumber: saleSequenceNumber,
    stageHistory: stages,
    inPipeline,
    won,
    lost,
    changeLog,
    lastModifiedDate: new Date().getTime(),
    assignedToDate: new Date().getTime(),
  });
}
```

### Adding a Product to Sale
```typescript
// From salesdetails.service.ts
addProduct(sid, saleId, newProduct) {
  return this.db
    .collection('users/' + sid + '/sales/' + saleId + '/items')
    .add({ ...newProduct });
}
```

### Getting Sales with Filters
```typescript
// From sale-table.service.ts
getData(superUserId, userId, selectedPipelineNameArray) {
  return this.afs
    .collection('users/' + superUserId + '/sales', (ref) => {
      return ref
        .where('assignedTo', '==', userId)
        .where('inPipeline', '==', true)
        .where('selectedSalePipeline', 'in', selectedPipelineNameArray)
        .orderBy('createdDate', 'desc')
        .limit(this.pageSize + 1);
    })
    .snapshotChanges();
}
```

---

*This documentation was generated on: $(date)*
*Last updated: $(date)*
