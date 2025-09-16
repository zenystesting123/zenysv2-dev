//model used for lead management plan.. Details of sales, services, sales documents,etc removed from table

export const FollowUpTableColumnsLeadPlan = [
    {
        columnDef: 'customerName',
        header: 'Customer Name',
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
        columnDef: 'callStartDate',
        header: 'Date',
        display: true,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },

    {
        columnDef: 'callStartTime',
        header: 'Scheduled time',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'completedStatus',
        header: 'Completed',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },

    {
        columnDef: 'assignedToName',
        header: 'Assigned To',
        display: true,
        type: 'string',
        ind: 0
    },
    {
        columnDef: 'status',
        header: 'Call status',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'direction',
        header: 'Direction',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'outcome',
        header: 'Outcome',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    // {
    //     columnDef: 'saleTitle',
    //     header: 'Sale Title',
    //     display: false,
    //     type: 'string',
    //     fieldType: 'def',
    //     ind: 0
    // },
    // {
    //     columnDef: 'serviceTitle',
    //     header: 'Service Title',
    //     display: false,
    //     type: 'string',
    //     fieldType: 'def',
    //     ind: 0
    // },

    {
        columnDef: 'callEndDate',
        header: 'End date',
        display: false,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'callEndTime',
        header: 'End time',
        display: false,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'callDuration',
        header: 'Call duration',
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
        columnDef: 'dateCreated',
        header: 'Created date',
        display: false,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },

    {
      columnDef: 'associatedBranch',
      header: 'Branch',
      display: false,
      type: 'option',
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
  {
    columnDef: 'contactNumber',
    header: 'Contact Number',
    display: false,
    type: 'string',
    fieldType: 'def',
    ind: 0,
  },
];
export const TaskTableColumnsLeadPlan = [
    {
        columnDef: 'dueDate',
        header: 'Due date',
        display: true,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'title',
        header: 'Title',
        display: true,
        type: 'number',
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
    {
        columnDef: 'status',
        header: 'Status',
        display: true,
        type: 'string',
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
        columnDef: 'name',
        header: 'First Name',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'lastName',
        header: 'Second Name',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'company',
        header: 'Company Name',
        display: true,
        type: 'number',
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
        columnDef: 'date',
        header: 'Created Date',
        display: false,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },
    // {
    //     columnDef: 'saleTitle',
    //     header: 'Sale Title',
    //     display: false,
    //     type: 'string',
    //     fieldType: 'def',
    //     ind: 0
    // },
    // {
    //     columnDef: 'serviceTitle',
    //     header: 'Service Title',
    //     display: false,
    //     type: 'string',
    //     fieldType: 'def',
    //     ind: 0
    // },

    {
      columnDef: 'associatedBranch',
      header: 'Branch',
      display: false,
      type: 'option',
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
export const CustomerTableColumnsLeadPlan = [

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
    {
        columnDef: 'selectedContactPipeline',
        header: 'Pipeline',
        display: true,
        type: 'number',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'aged contact',
        header: 'Aged',
        display: false,
        type: 'string',
        fieldType: 'aged',
        ind: 0
    },

    {
        columnDef: 'status',
        header: 'Status',
        display: true,
        type: 'string',
        fieldType: 'status def',
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
      columnDef: 'associatedBranch',
      header: 'Branch',
      display: false,
      type: 'option',
      fieldType: 'def',
      ind: 0
  },

    {
        columnDef: 'custLeadValue',
        header: 'Lead Source',
        display: true,
        type: 'string',
        fieldType: 'def',
        ind: 0
    },
    // {
    //     columnDef: 'invoicedAmount',
    //     header: 'Invoiced',
    //     display: true,
    //     type: 'number',
    //     fieldType: 'def',
    //     ind: 0
    // },
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

    {
        columnDef: 'inPipeline',
        header: 'In Pipeline',
        display: false,
        type: 'boolean',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'won',
        header: 'Won',
        display: false,
        type: 'boolean',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'lost',
        header: 'Lost',
        display: false,
        type: 'boolean',
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
        columnDef: 'nextFollowupDate',
        header: 'Next Followup Date',
        display: false,
        type: 'date_time',
        fieldType: 'def',
        ind: 0
    },
    {
        columnDef: 'previousFollowupDate',
        header: 'Previous Followup Date',
        display: false,
        type: 'date_time',
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
        columnDef: 'currentStatusDate',
        header: 'Current Stage Date',
        display: false,
        type: 'date',
        fieldType: 'def',
        ind: 0
    },
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

