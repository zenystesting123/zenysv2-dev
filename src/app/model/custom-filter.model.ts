export class PaymentViewSettingsDef {
  public static DATA = [
    {
      "sortOrder": "Asc",
      "sortField": {
        "header": "Date created",
        "type": "date",
        "display": true,
        "columnDef": "createDate",
        "fieldType": "def",
        "ind": 0
      },
      "filters": [],
      "primaryQuery": {
        "selectionArray": [],
        "operator": "This Week",
        "fieldType": "def",
        "comparisonValue": [],
        "queryType": "date",
        "ind": 0,
        "queryField": "createDate",
        "queryName": "Created date"
      },
      "viewName": "Created this week"
    },
    {
      "sortOrder": "Asc",
      "primaryQuery": {
        "queryType": "date",
        "selectionArray": [],
        "ind": 0,
        "operator": "This Month",
        "queryField": "createDate",
        "fieldType": "def",
        "comparisonValue": [],
        "queryName": "Created date"
      },
      "viewName": "Created this month",
      "sortField": {
        "ind": 0,
        "display": true,
        "header": "Date created",
        "columnDef": "createDate",
        "fieldType": "def",
        "type": "date"
      },
      "filters": []
    },
  ]
}
export class PaymentSortingDef {
  public static Data = [
    {
      "header": "Date created",
      "type": "date",
      "display": true,
      "columnDef": "createDate",
      "fieldType": "def",
      "ind": 0
    },
    {
      "header": "Collection created",
      "type": "timestamp",
      "display": true,
      "columnDef": "paymentDate",
      "fieldType": "def",
      "ind": 0
    },
  ]
}
export class DocumentViewSettingsDef {
  public static DATA = [
    {
      "sortOrder": "Asc",
      "sortField": {
        "header": "Date created",
        "type": "date",
        "display": true,
        "columnDef": "docData.createdDate",
        "fieldType": "docData",
        "ind": 0
      },
      "filters": [],
      "primaryQuery": {
        "selectionArray": [],
        "operator": "This Week",
        "fieldType": "def",
        "comparisonValue": [],
        "queryType": "date",
        "ind": 0,
        "queryField": "docData.createdDate",
        "queryName": "Created date"
      },
      "viewName": "Created this week"
    },
    {
      "sortOrder": "Asc",
      "primaryQuery": {
        "queryType": "date",
        "selectionArray": [],
        "ind": 0,
        "operator": "This Month",
        "queryField": "docData.createdDate",
        "fieldType": "def",
        "comparisonValue": [],
        "queryName": "Created date"
      },
      "viewName": "Created this month",
      "sortField": {
        "ind": 0,
        "display": true,
        "header": "Date created",
        "columnDef": "docData.createdDate",
        "fieldType": "docData",
        "type": "date"
      },
      "filters": []
    },
  ]
}
export class DocumentSortingDef {
  public static Data = [
    {
      "header": "Date created",
      "type": "date",
      "display": true,
      "columnDef": "docData.createdDate",
      "fieldType": "docData",
      "ind": 0
    },
    {
      "header": "Document date",
      "type": "timestamp",
      "display": true,
      "columnDef": "docData.docDate",
      "fieldType": "docData",
      "ind": 0
    },
  ]
}
export class FollowupViewSettingsDef {
  public static DATA = [
    {
      "viewName": "Call today",
      "sortOrder": "Desc",
      "filters": [],
      "sortField": {
        "type": "date",
        "fieldType": "def",
        "header": "Call date",
        "columnDef": "callStartDate",
        "ind": 0,
        "display": true
      },
      "primaryQuery": {
        "queryType": "timestamp",
        "queryField": "callStartDate",
        "comparisonValue": [],
        "queryName": "Call date",
        "ind": 0,
        "operator": "Today",
        "selectionArray": [],
        "fieldType": "def"
      }
    },

    {
      "primaryQuery": {
        "fieldType": "def",
        "comparisonValue": [],
        "ind": 0,
        "selectionArray": [],
        "operator": "This Week",
        "queryField": "callStartDate",
        "queryType": "timestamp",
        "queryName": "Call date"
      },
      "sortOrder": "Asc",
      "viewName": "Call this week",
      "filters": [],
      "sortField": {
        "columnDef": "callStartDate",
        "ind": 0,
        "fieldType": "def",
        "display": true,
        "type": "date",
        "header": "Call date"
      }
    },
    {
      "filters": [],
      "viewName": "Call this month",
      "sortField": {
        "ind": 0,
        "columnDef": "callStartDate",
        "header": "Call date",
        "display": true,
        "type": "date",
        "fieldType": "def"
      },
      "primaryQuery": {
        "ind": 0,
        "fieldType": "def",
        "queryName": "Call date",
        "queryType": "timestamp",
        "selectionArray": [],
        "queryField": "callStartDate",
        "comparisonValue": [],
        "operator": "This Month"
      },
      "sortOrder": "Asc"
    },
  ]
}
export class FollowupSortingDef {
  public static Data = [
    {
      columnDef: 'callStartDate',
      header: 'Call date',
      display: true,
      type: 'date',
      fieldType: 'def',
      ind: 0
    }, {
      columnDef: 'dateCreated',
      header: 'Created Date',
      display: true,
      type: 'date',
      fieldType: 'def',
      ind: 0
    },
  ]
}
export class ServiceViewSettingsDef {
  public static DATA = [
    {
      "viewName": "In progress",
      "sortField": {
        "columnDef": "createdDate",
        "header": "Created Date",
        "type": "date",
        "ind": 0,
        "display": false,
        "fieldType": "def"
      },
      "filters": [],
      "sortOrder": "Asc",
      "primaryQuery": {
        "selectionArray": [],
        "queryField": "inPipeline",
        "fieldType": "def",
        "ind": 0,
        "comparisonValue": [
          true
        ],
        "operator": true,
        "queryName": "In Progress",
        "queryType": "boolean"
      }
    },
    {
      "primaryQuery": {
        "queryField": "createdDate",
        "ind": 0,
        "queryName": "Created date",
        "comparisonValue": [],
        "queryType": "date",
        "operator": "This Week",
        "fieldType": "def",
        "selectionArray": []
      },
      "filters": [],
      "viewName": "Created this week",
      "sortField": {
        "header": "Date created",
        "fieldType": "def",
        "columnDef": "createdDate",
        "type": "date",
        "display": true,
        "ind": 0
      },
      "sortOrder": "Asc"
    },
    {
      "filters": [],
      "primaryQuery": {
        "selectionArray": [],
        "queryType": "date",
        "queryName": "Created date",
        "queryField": "createdDate",
        "operator": "This Month",
        "comparisonValue": [],
        "ind": 0,
        "fieldType": "def"
      },
      "sortField": {
        "display": true,
        "ind": 0,
        "header": "Date created",
        "columnDef": "createdDate",
        "fieldType": "def",
        "type": "date"
      },
      "sortOrder": "Asc",
      "viewName": "Created this month"
    },
    {
      "sortField": {
        "fieldType": "def",
        "type": "date",
        "columnDef": "createdDate",
        "header": "Date created",
        "ind": 0,
        "display": true
      },
      "viewName": "Created this month & converted",
      "primaryQuery": {
        "queryType": "date",
        "queryName": "Created date",
        "selectionArray": [],
        "comparisonValue": [],
        "queryField": "createdDate",
        "fieldType": "def",
        "operator": "This Month",
        "ind": 0
      },
      "sortOrder": "Asc",
      "filters": [
        {
          "selectionArray": [],
          "comparisonValue": [
            true
          ],
          "queryField": "won",
          "queryType": "boolean",
          "fieldType": "def",
          "queryName": "Won",
          "ind": 0,
          "operator": true
        }
      ]
    },
    {
      "sortOrder": "Desc",
      "primaryQuery": {
        "comparisonValue": [],
        "ind": 0,
        "queryName": "Created date",
        "operator": "This Month",
        "selectionArray": [],
        "queryField": "createdDate",
        "fieldType": "def",
        "queryType": "date"
      },
      "viewName": "Created this month & lost",
      "sortField": {
        "type": "date",
        "header": "Created Date",
        "display": false,
        "ind": 0,
        "fieldType": "def",
        "columnDef": "createdDate"
      },
      "filters": [
        {
          "operator": true,
          "fieldType": "def",
          "queryType": "boolean",
          "comparisonValue": [
            true
          ],
          "ind": 0,
          "queryField": "lost",
          "queryName": "Lost",
          "selectionArray": []
        }
      ]
    },
    {
      "sortOrder": "Asc",
      "filters": [],
      "primaryQuery": {
        "fieldType": "def",
        "queryName": "Start Date",
        "selectionArray": [],
        "comparisonValue": [],
        "queryField": "startDate",
        "queryType": "timestamp",
        "ind": 0,
        "operator": "This Week"
      },
      "sortField": {
        "fieldType": "def",
        "ind": 0,
        "header": "Created Date",
        "display": false,
        "type": "date",
        "columnDef": "createdDate"
      },
      "viewName": "Starting this week"
    },
    {
      "viewName": "Starting this month",
      "primaryQuery": {
        "ind": 0,
        "queryField": "startDate",
        "fieldType": "def",
        "queryName": "Start Date",
        "operator": "This Month",
        "queryType": "timestamp",
        "selectionArray": [],
        "comparisonValue": []
      },
      "filters": [],
      "sortField": {
        "type": "date",
        "ind": 0,
        "display": false,
        "fieldType": "def",
        "columnDef": "createdDate",
        "header": "Created Date"
      },
      "sortOrder": "Asc"
    },
    {
      "viewName": "Ending this week",
      "sortOrder": "Asc",
      "sortField": {
        "header": "Created Date",
        "type": "date",
        "fieldType": "def",
        "display": false,
        "columnDef": "createdDate",
        "ind": 0
      },
      "primaryQuery": {
        "operator": "This Week",
        "comparisonValue": [],
        "queryType": "timestamp",
        "selectionArray": [],
        "ind": 0,
        "queryName": "End Date",
        "fieldType": "def",
        "queryField": "expCompletionDate"
      },
      "filters": []
    },
    {
      "viewName": "Ending this month",
      "sortOrder": "Asc",
      "primaryQuery": {
        "comparisonValue": [],
        "queryName": "End Date",
        "ind": 0,
        "queryField": "expCompletionDate",
        "selectionArray": [],
        "fieldType": "def",
        "queryType": "timestamp",
        "operator": "This Month"
      },
      "filters": [],
      "sortField": {
        "ind": 0,
        "display": false,
        "type": "date",
        "header": "Created Date",
        "fieldType": "def",
        "columnDef": "createdDate"
      }
    }
  ]
}
export class ExpenseViewSettingsDef {
  public static DATA = [
    {
      "viewName": "Created today",
      "sortOrder": "Desc",
      "filters": [],
      "sortField": {
        "type": "date",
        "fieldType": "def",
        "header": "Created date",
        "columnDef": "date",
        "ind": 0,
        "display": true
      },
      "primaryQuery": {
        "queryType": "date",
        "queryField": "date",
        "comparisonValue": [],
        "queryName": "Created date",
        "ind": 0,
        "operator": "Today",
        "selectionArray": [],
        "fieldType": "def"
      }
    },

    {
      "primaryQuery": {
        "fieldType": "def",
        "comparisonValue": [],
        "ind": 0,
        "selectionArray": [],
        "operator": "This Week",
        "queryField": "date",
        "queryType": "date",
        "queryName": "Created date"
      },
      "sortOrder": "Asc",
      "viewName": "Created this week",
      "filters": [],
      "sortField": {
        "columnDef": "date",
        "ind": 0,
        "fieldType": "def",
        "display": true,
        "type": "date",
        "header": "Created date"
      }
    },
    {
      "filters": [],
      "viewName": "Created this month",
      "sortField": {
        "ind": 0,
        "columnDef": "date",
        "header": "Created date",
        "display": true,
        "type": "date",
        "fieldType": "def"
      },
      "primaryQuery": {
        "ind": 0,
        "fieldType": "def",
        "queryName": "Created date",
        "queryType": "date",
        "selectionArray": [],
        "queryField": "date",
        "comparisonValue": [],
        "operator": "This Month"
      },
      "sortOrder": "Asc"
    },
  ]
}
export class ExpenseSortingDef {
  public static Data = [
    {
      columnDef: 'expenseDate',
      header: 'Expense date',
      display: true,
      type: 'date',
      fieldType: 'def',
      ind: 0
    }, {
      columnDef: 'date',
      header: 'Created Date',
      display: true,
      type: 'date',
      fieldType: 'def',
      ind: 0
    },
  ]
}