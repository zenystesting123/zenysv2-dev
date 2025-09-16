import { v4 as uuidv4 } from 'uuid';
export class Pipelines {
  pipelineName: string;
  pipelineId: number;
  pipelineStages: PipelineStages[];
}
export class PipelineStages {
  name: string;
  age: number;
  stageId: string;
}
export class DefaultCustomerPipelines {
  public static customerPipelines: Array<Pipelines> = [
    {
      pipelineName: 'PipeLine 1',
      pipelineId: Math.floor(Date.now() * Math.random()),
      pipelineStages: [
        {
          name: 'Lead',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Prospect',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Opportunity',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Customer-Won',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Lost/Rejected',
          age: 5,
          stageId: uuidv4(),
        },
      ],
    },
    {
      pipelineName: 'PipeLine 2',
      pipelineId: Math.floor(Date.now() * Math.random()),
      pipelineStages: [
        {
          name: 'Lead',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Prospect',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Opportunity',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Customer-Won',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Lost/Rejected',
          age: 5,
          stageId: uuidv4(),
        },
      ],
    },
    {
      pipelineName: 'PipeLine 3',
      pipelineId: Math.floor(Date.now() * Math.random()),
      pipelineStages: [
        {
          name: 'Lead',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Prospect',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Opportunity',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Customer-Won',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Lost/Rejected',
          age: 5,
          stageId: uuidv4(),
        },
      ],
    },
    {
      pipelineName: 'PipeLine 4',
      pipelineId: Math.floor(Date.now() * Math.random()),
      pipelineStages: [
        {
          name: 'Lead',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Prospect',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Opportunity',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Customer-Won',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Lost/Rejected',
          age: 5,
          stageId: uuidv4(),
        },
      ],
    },
    {
      pipelineName: 'PipeLine 5',
      pipelineId: Math.floor(Date.now() * Math.random()),
      pipelineStages: [
        {
          name: 'Lead',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Prospect',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Opportunity',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Customer-Won',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Lost/Rejected',
          age: 5,
          stageId: uuidv4(),
        },
      ],
    },
  ];
}
export class customerPipelines {
  customerPipelines: Pipelines[];
}
export class salePipelines {
  salePipelines: Pipelines[];
}
export class servicePipelines {
  servicePipelines: Pipelines[];
}
export class statusModel {
  name: string;
  stageId: string;
}
export class DefaultSalePipelines {
  public static salePipelines: Array<Pipelines> = [
    {
      pipelineName: 'PipeLine 1',
      pipelineId: Math.floor(Date.now() * Math.random()),
      pipelineStages: [
        {
          name: 'Inquiry',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Opportunity',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Confirmed',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Sale-Completed',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Lost/Dropped',
          age: 5,
          stageId: uuidv4(),
        },
      ],
    },
    {
      pipelineName: 'PipeLine 2',
      pipelineId: Math.floor(Date.now() * Math.random()),
      pipelineStages: [
        {
          name: 'Inquiry',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Opportunity',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Confirmed',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Sale-Completed',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Lost/Dropped',
          age: 5,
          stageId: uuidv4(),
        },
      ],
    },
    {
      pipelineName: 'PipeLine 3',
      pipelineId: Math.floor(Date.now() * Math.random()),
      pipelineStages: [
        {
          name: 'Inquiry',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Opportunity',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Confirmed',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Sale-Completed',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Lost/Dropped',
          age: 5,
          stageId: uuidv4(),
        },
      ],
    },
    {
      pipelineName: 'PipeLine 4',
      pipelineId: Math.floor(Date.now() * Math.random()),
      pipelineStages: [
        {
          name: 'Inquiry',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Opportunity',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Confirmed',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Sale-Completed',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Lost/Dropped',
          age: 5,
          stageId: uuidv4(),
        },
      ],
    },
    {
      pipelineName: 'PipeLine 5',
      pipelineId: Math.floor(Date.now() * Math.random()),
      pipelineStages: [
        {
          name: 'Inquiry',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Opportunity',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Confirmed',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Sale-Completed',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Lost/Dropped',
          age: 5,
          stageId: uuidv4(),
        },
      ],
    },
  ];
}
export class DefaultServicePipelines {
  public static servicePipelines: Array<Pipelines> = [
    {
      pipelineName: 'PipeLine 1',
      pipelineId: Math.floor(Date.now() * Math.random()),
      pipelineStages: [
        {
          name: 'New',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Waiting on Contact',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Waiting on us',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Completed',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Lost/Dropped',
          age: 5,
          stageId: uuidv4(),
        },
      ],
    },
    {
      pipelineName: 'PipeLine 2',
      pipelineId: Math.floor(Date.now() * Math.random()),
      pipelineStages: [
        {
          name: 'New',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Waiting on Contact',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Waiting on us',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Completed',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Lost/Dropped',
          age: 5,
          stageId: uuidv4(),
        },
      ],
    },
    {
      pipelineName: 'PipeLine 3',
      pipelineId: Math.floor(Date.now() * Math.random()),
      pipelineStages: [
        {
          name: 'New',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Waiting on Contact',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Waiting on us',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Completed',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Lost/Dropped',
          age: 5,
          stageId: uuidv4(),
        },
      ],
    },
    {
      pipelineName: 'PipeLine 4',
      pipelineId: Math.floor(Date.now() * Math.random()),
      pipelineStages: [
        {
          name: 'New',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Waiting on Contact',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Waiting on us',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Completed',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Lost/Dropped',
          age: 5,
          stageId: uuidv4(),
        },
      ],
    },
    {
      pipelineName: 'PipeLine 5',
      pipelineId: Math.floor(Date.now() * Math.random()),
      pipelineStages: [
        {
          name: 'New',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Waiting on Contact',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Waiting on us',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Completed',
          age: 5,
          stageId: uuidv4(),
        },
        {
          name: 'Lost/Dropped',
          age: 5,
          stageId: uuidv4(),
        },
      ],
    },
  ];
}
export class overSeasPipelineCust{
  public static customerPipelines: Array<Pipelines> = [
  {
    pipelineName: 'Direct',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Lead',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Inquiry',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Doc Collection',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Application',
        age: 5,
        stageId: uuidv4(),
      },
      {
        age: 5,
        name: 'CAS Processing',
        stageId: uuidv4(),
      },
      {
        age: 5,
        name: 'Visa Processing',
        stageId: uuidv4(),
      },
      {
        name: 'Completed',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Rejected',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'B2B Ref',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        age: 5,
        name: 'Application',
        stageId: uuidv4(),
      },
      {
        name: 'CAS Processing',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Customer-Won',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Rejected',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'PipeLine 3',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Lead',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Prospect',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Customer-Won',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Rejected',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'PipeLine 4',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Lead',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Prospect',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Customer-Won',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Rejected',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'PipeLine 5',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Lead',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Prospect',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Customer-Won',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Rejected',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
]};

export class overSeasPipelineSale {
  public static salePipelines: Array<Pipelines> = [
  {
    pipelineName: 'UK Appln',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Initiated',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Processing',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Offer Issued',
        age: 5,
        stageId: uuidv4(),
      },
      {
        age: 5,
        name: 'Offer Accepted',
        stageId: uuidv4(),
      },
      {
        name: 'Fee Payment',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Deferred',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Refund',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'CAS Processing',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'CAS Issued',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Dropped',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'Training',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Inquiry',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Fee-payment',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Sale-Completed',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Dropped',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'PipeLine 3',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Inquiry',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Confirmed',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Sale-Completed',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Dropped',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'PipeLine 4',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Inquiry',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Confirmed',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Sale-Completed',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Dropped',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'PipeLine 5',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Inquiry',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Confirmed',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Sale-Completed',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Dropped',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
]
};

export class realEstPipelineCust{
  public static customerPipelines: Array<Pipelines> = [
  {
    pipelineName: 'Property Buyer',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Lead',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Prospect',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Visit',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Registration',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Completed',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Rejected',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'Land Owners',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Lead',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Prospect',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Site Visit',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Document verification',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Legal opinion',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Registration',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Completed',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Rejected',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'PipeLine 3',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Lead',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Prospect',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Customer-Won',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Rejected',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'PipeLine 4',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Lead',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Prospect',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Customer-Won',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Rejected',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'PipeLine 5',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Lead',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Prospect',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Customer-Won',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Rejected',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
]};
export class realEstPipelineSale{
  public static salePipelines: Array<Pipelines> = [
  {
    pipelineName: 'Property Sale',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Document Collection',
        age: 5,
        stageId: uuidv4(),
      },
      {
        age: 5,
        name: 'Loan Processing',
        stageId: uuidv4(),
      },
      {
        age: 5,
        name: 'Deed Preparation',
        stageId: uuidv4(),
      },
      {
        age: 5,
        name: 'Registration',
        stageId: uuidv4(),
      },
      {
        age: 5,
        name: 'Handover',
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Dropped',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'Land Purchase',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Document Collection',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Legal verification',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Agreement prep',
        age: 5,
        stageId: uuidv4(),
      },
      {
        age: 5,
        name: 'Token Advance',
        stageId: uuidv4(),
      },
      {
        age: 5,
        name: 'Registration',
        stageId: uuidv4(),
      },
      {
        age: 5,
        name: 'Completed',
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Dropped',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'PipeLine 3',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Inquiry',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Confirmed',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Sale-Completed',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Dropped',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'PipeLine 4',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Inquiry',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Confirmed',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Sale-Completed',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Dropped',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'PipeLine 5',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Inquiry',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Confirmed',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Sale-Completed',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Dropped',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
]};

export class teleMarkPipelineCust{
  public static customerPipelines: Array<Pipelines> = [
  {
    pipelineName: 'PipeLine 1',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Lead',
        age: 5,
        stageId: uuidv4(),
      },
      {
        age: 5,
        name: 'Contacting',
        stageId: uuidv4(),
      },
      {
        name: 'Interested',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Customer-Won',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Rejected',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'PipeLine 2',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Lead',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Prospect',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Customer-Won',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Rejected',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'PipeLine 3',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Lead',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Prospect',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Customer-Won',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Rejected',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'PipeLine 4',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Lead',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Prospect',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Customer-Won',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Rejected',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
  {
    pipelineName: 'PipeLine 5',
    pipelineId: Math.floor(Date.now() * Math.random()),
    pipelineStages: [
      {
        name: 'Lead',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Prospect',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Opportunity',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Customer-Won',
        age: 5,
        stageId: uuidv4(),
      },
      {
        name: 'Lost/Rejected',
        age: 5,
        stageId: uuidv4(),
      },
    ],
  },
]};
