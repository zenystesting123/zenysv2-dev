//model used for invoicing plan.. Details of sales, services, tasks, followups, status, pipeline, etc removed from table
export const InvoiceTableColumnsInvPlan = [
    {
        columnDef: 'prefixAndDocNumber',
        header: 'Doc Number',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'fname1',
        header: 'First Name',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'sname',
        header: 'Second Name',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'companyName',
        header: 'Company Name',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    // {
    //     columnDef: 'saleTitle',
    //     header: 'Sale Title',
    //     display: true,
    //     type: 'string',
    //     fieldType: 'def',
    //     ind: 0
    // },
    {
        columnDef: 'docDate',
        header: 'Doc date',
        display: true,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'totalInclTax',
        header: 'Amount',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'createdBy',
        header: 'Created By',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },

    {
        columnDef: 'createdDate',
        header: 'Created date',
        display: false,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'statusApproved',
        header: 'Status Approved',
        display: false,
        type: 'boolean',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'state',
        header: 'State',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    }, {
        columnDef: 'district',
        header: 'District',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'cancel',
        header: 'Cancelled',
        display: false,
        type: 'boolean',
        fieldType: 'def',
        ind: 0
    },

    {
        columnDef: 'discountValue',
        header: 'Discount Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'cessValue',
        header: 'Cess Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'sgstValue',
        header: 'Sgst Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'cgstValue',
        header: 'Cgst Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    }, {
        columnDef: 'igstValue',
        header: 'Igst Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    }
    , {
        columnDef: 'vatValue',
        header: 'Vat Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'dueDate',
        header: 'Due date',
        display: false,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },
    // {
    //     columnDef: 'collectedAmount',
    //     header: 'Collected Amount',
    //     display: false,
    //     type: 'number',
    //     fieldType: 'def',
    //     ind: 0
    // },
]
export const EstimateTableColumnsInvPlan = [
    {
        columnDef: 'prefixAndDocNumber',
        header: 'Doc Number',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'fname1',
        header: 'First Name',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'sname',
        header: 'Second Name',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'companyName',
        header: 'Company Name',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    // {
    //     columnDef: 'saleTitle',
    //     header: 'Sale Title',
    //     display: true,
    //     type: 'string',
    //     fieldType: 'def',
    //     ind: 0
    // },
    {
        columnDef: 'docDate',
        header: 'Doc date',
        display: true,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'totalInclTax',
        header: 'Amount',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'createdBy',
        header: 'Created By',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },

    {
        columnDef: 'createdDate',
        header: 'Created date',
        display: false,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'statusApproved',
        header: 'Status Approved',
        display: false,
        type: 'boolean',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'state',
        header: 'State',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    }, {
        columnDef: 'district',
        header: 'District',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'cancel',
        header: 'Cancelled',
        display: false,
        type: 'boolean',
        fieldType: 'def',
        ind: 0
    },

    {
        columnDef: 'discountValue',
        header: 'Discount Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'cessValue',
        header: 'Cess Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'sgstValue',
        header: 'Sgst Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'cgstValue',
        header: 'Cgst Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'igstValue',
        header: 'Igst Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    }
    , {
        columnDef: 'vatValue',
        header: 'Vat Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'docValidity',
        header: 'Validity date',
        display: false,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },
]
export const QuotationTableColumnsInvPlan = [
    {
        columnDef: 'prefixAndDocNumber',
        header: 'Doc Number',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'fname1',
        header: 'First Name',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'sname',
        header: 'Second Name',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'companyName',
        header: 'Company Name',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    // {
    //     columnDef: 'saleTitle',
    //     header: 'Sale Title',
    //     display: true,
    //     type: 'string',
    //     fieldType: 'def',
    //     ind: 0
    // },
    {
        columnDef: 'docDate',
        header: 'Doc date',
        display: true,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'totalInclTax',
        header: 'Amount',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'createdBy',
        header: 'Created By',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },

    {
        columnDef: 'createdDate',
        header: 'Created date',
        display: false,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'statusApproved',
        header: 'Status Approved',
        display: false,
        type: 'boolean',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'state',
        header: 'State',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    }, {
        columnDef: 'district',
        header: 'District',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'cancel',
        header: 'Cancelled',
        display: false,
        type: 'boolean',
        fieldType: 'def',
        ind: 0
    },

    {
        columnDef: 'discountValue',
        header: 'Discount Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'cessValue',
        header: 'Cess Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'sgstValue',
        header: 'Sgst Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'cgstValue',
        header: 'Cgst Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'igstValue',
        header: 'Igst Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    }
    , {
        columnDef: 'vatValue',
        header: 'Vat Value',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'docValidity',
        header: 'Validity date',
        display: false,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },
]
export const CustomerTableColumnsInvPlan = [
    {
        columnDef: 'salutation',
        header: 'Salutation',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'firstName',
        header: 'First Name',
        display: true,
        type: 'string',
        fieldType: 'contact name',
        ind: 0
    },
    {
        columnDef: 'secondName',
        header: 'Second Name',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'surname',
        header: 'Surname',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'companyName',
        header: 'Company Name',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'code',
        header: 'Code',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },

    {
        columnDef: 'contactNo',
        header: 'Contact No',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'dateCreated',
        header: 'Date created',
        display: true,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'priority',
        header: 'Priority',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    // {
    //     columnDef: 'selectedContactPipeline',
    //     header: 'Pipeline',
    //     display: true,
    //     type: 'number',
    //     fieldType: 'def',
    //     ind: 0
    // },
    // {
    //     columnDef: 'aged contact',
    //     header: 'Aged',
    //     display: false,
    //     type: 'string',
    //     fieldType: 'aged',
    //     ind: 0
    // },

    // {
    //     columnDef: 'status',
    //     header: 'Status',
    //     display: true,
    //     type: 'string',
    //     fieldType: 'status def',
    //     ind: 0
    // },

    {
        columnDef: 'assignedToName',
        header: 'Assigned To',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
//     {
//       columnDef: 'associatedBranch',
//       header: 'Branch',
//       display: false,
//       type: 'option',
//       fieldType: 'def',
//       ind: 0
//   },

    {
        columnDef: 'custLeadValue',
        header: 'Lead Source',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'invoicedAmount',
        header: 'Invoiced',
        display: true,
        type: 'number',
        fieldType: 'def',
        ind: 0
    },
    // {
    //     columnDef: 'totalAmountCollected',
    //     header: 'Collected',
    //     display: true,
    //     type: 'number',
    //     fieldType: 'def',
    //     ind: 0
    // },


    {
        columnDef: 'taxId',
        header: 'Tax ID',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },

    {
        columnDef: 'alternateContactNumber',
        header: 'Alt Contact No',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'email',
        header: 'Email',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },



    {
        columnDef: 'billingaddress1',
        header: 'Address Line 1',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'billingaddress2',
        header: 'Address Line 2',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'bpin',
        header: 'PIN/ ZIP code',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'district',
        header: 'District',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'state',
        header: 'State',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'country',
        header: 'Country',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'createdBy',
        header: 'Created by',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'department',
        header: 'Department',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },

    // {
    //     columnDef: 'inPipeline',
    //     header: 'In Pipeline',
    //     display: false,
    //     type: 'boolean',
    //     fieldType: 'def',
    //     ind: 0
    // },
    // {
    //     columnDef: 'won',
    //     header: 'Won',
    //     display: false,
    //     type: 'boolean',
    //     fieldType: 'def',
    //     ind: 0
    // },
    // {
    //     columnDef: 'lost',
    //     header: 'Lost',
    //     display: false,
    //     type: 'boolean',
    //     fieldType: 'def',
    //     ind: 0
    // },
    {
        columnDef: 'sequenceNumber',
        header: 'ID',
        display: false,
        type: 'number',
        fieldType: 'def',
        ind: 0
    },
    // {
    //     columnDef: 'nextFollowupDate',
    //     header: 'Next Followup Date',
    //     display: false,
    //     type: 'date_time',
    //     fieldType: 'def',
    //     ind: 0
    // },
    // {
    //     columnDef: 'previousFollowupDate',
    //     header: 'Previous Followup Date',
    //     display: false,
    //     type: 'date_time',
    //     fieldType: 'def',
    //     ind: 0
    // },
    {
        columnDef: 'lastModifiedDate',
        header: 'Last Modified Date',
        display: false,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },
    // {
    //     columnDef: 'currentStatusDate',
    //     header: 'Current Stage Date',
    //     display: false,
    //     type: 'date',
    //     fieldType: 'def',
    //     ind: 0
    // },
    {
        columnDef: 'lastNoteDate',
        header: 'Last Note Date',
        display: false,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'lastAddedNote',
        header: 'Last Note',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'assignedToDate',
        header: 'Assigned To Date',
        display: false,
        type: 'date',
        fieldType: 'def',
        ind: 0,
      },
];
export const OrgTableColumnsInvPlan = [
  {
      columnDef: 'companyName',
      header: 'Company Name',
      display: true,
      type: 'string',
      fieldType: 'def',
      ind: 0
  },
  {
      columnDef: 'code',
      header: 'Code',
      display: true,
      type: 'string',
      fieldType: 'def',
      ind: 0
  },
  {
      columnDef: 'contactNo',
      header: 'Contact No',
      display: true,
      type: 'string',
      fieldType: 'def',
      ind: 0
  },
  {
      columnDef: 'createdDate',
      header: 'Date created',
      display: true,
      type: 'date',
      fieldType: 'def',
      ind: 0
  },
  {
      columnDef: 'assignedToName',
      header: 'Assigned To',
      display: true,
      type: 'string',
      fieldType: 'def',
      ind: 0
  },
  {
      columnDef: 'invoiced',
      header: 'Invoiced',
      display: true,
      type: 'number',
      fieldType: 'def',
      ind: 0
  },
//   {
//       columnDef: 'collected',
//       header: 'Collected',
//       display: true,
//       type: 'number',
//       fieldType: 'def',
//       ind: 0
//   },


  {
      columnDef: 'taxId',
      header: 'Tax ID',
      display: false,
      type: 'string',
      fieldType: 'def',
      ind: 0
  },
  {
      columnDef: 'email',
      header: 'Email',
      display: false,
      type: 'string',
      fieldType: 'def',
      ind: 0
  },
//   {
//     columnDef: 'associatedBranch',
//     header: 'Branch',
//     display: true,
//     type: 'option',
//     fieldType: 'def',
//     ind: 0
// },
  {
      columnDef: 'billingaddress1',
      header: 'Address Line 1',
      display: false,
      type: 'string',
      fieldType: 'def',
      ind: 0
  },
  {
      columnDef: 'billingaddress2',
      header: 'Address Line 2',
      display: false,
      type: 'string',
      fieldType: 'def',
      ind: 0
  },
  {
      columnDef: 'bpin',
      header: 'PIN/ ZIP code',
      display: false,
      type: 'string',
      fieldType: 'def',
      ind: 0
  },
  {
      columnDef: 'district',
      header: 'District',
      display: false,
      type: 'string',
      fieldType: 'def',
      ind: 0
  },
  {
      columnDef: 'state',
      header: 'State',
      display: false,
      type: 'string',
      fieldType: 'def',
      ind: 0
  },
  {
      columnDef: 'country',
      header: 'Country',
      display: false,
      type: 'string',
      fieldType: 'def',
      ind: 0
  },
  {
      columnDef: 'createdBy',
      header: 'Created by',
      display: false,
      type: 'string',
      fieldType: 'def',
      ind: 0
  },
  {
      columnDef: 'sequenceNumber',
      header: 'ID',
      display: false,
      type: 'number',
      fieldType: 'def',
      ind: 0
  },
  {
    columnDef: 'lastModifiedDate',
    header: 'Last Modified Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0
},
{
    columnDef: 'assignedToDate',
    header: 'Assigned To Date',
    display: false,
    type: 'date',
    fieldType: 'def',
    ind: 0,
  },
];

