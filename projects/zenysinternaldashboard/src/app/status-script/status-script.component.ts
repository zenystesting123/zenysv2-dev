import { Component, HostListener, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { stagesModel } from './status-script.model';
import { StatusScriptService } from './status-script.service';
import * as firebase from 'firebase';
import {
  Branch,
  Customer,
  FollowUps,
  ProductInSaleModel,
  Profile,
  Sales,
  Service,
  StageHistoryModel,
  SubUsers,
  Task,
} from 'src/app/data-models';
import { takeUntil } from 'rxjs/operators';
import { Pipelines } from 'src/app/model/pipeline.modal';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-status-script',
  templateUrl: './status-script.component.html',
  styleUrls: ['./status-script.component.scss'],
})
export class StatusScriptComponent implements OnInit {
  fire = firebase.default.firestore();
  userRef = this.fire.collection('users');

  selectedUser: any = null;
  items: Array<stagesModel> = [];
  updateuserLevele = false;
  updateCustColl = false;
  updateSaleColl = false;
  customerLength = 0;
  saleLength = 0;
  customer: Customer[] = null;
  sales: Sales[] = null;
  itemsSale: ProductInSaleModel[] = [];
  services: Service[] = null;
  customerWonStatus = '';
  customerLostStatus = '';
  saleWonStatus = '';
  saleLostStatus = '';
  serviceWonStatus = null;
  serviceLostStatus = null;
  customerInPipeline = false;
  customerWon = false;
  customerLost = false;
  saleInPipeline = false;
  saleWon = false;
  saleLost = false;
  serviceInPipeline = false;
  serviceWon = false;
  serviceLost = false;
  profiles = [];
  pipelineNameArray: Array<string> = [];
  wonArrayCust: Array<string> = [];
  lostArrayCust: Array<string> = [];
  wonArraySale: Array<string> = [];
  lostArraySale: Array<string> = [];
  wonArrayService: Array<string> = [];
  lostArrayService: Array<string> = [];

  branches: Branch[] = [];
  associatedBranch = 'NA';
  associatedBranchKochi = '';
  associatedBranchCalicut = '';
  tasks: Task[] = [];
  followUps: FollowUps[] = [];
  subUsers: SubUsers[] = [];

  customerPipelines: Pipelines[] = []; //customer pipelines in new foermat
  customerPipeline: any; //a duplicate variable
  updatedCount = 0; //count pipeline updation
  servicePipelines: Pipelines[] = []; //service pipelines in new format
  salePipelines: Pipelines[] = []; //sale pipelines in new format

  /** Subject that emits when the component has been destroyed. */
  private onDestroy$: Subject<void> = new Subject<void>();

  constructor(private serviceInstance: StatusScriptService) {}

  ngOnInit(): void {}

  // add pipelines collection under user with pipelineNamesCustomer, contact stus arrays
  async updateAtUserCollection(userId) {
    // get current customer pipelines and statuses
    await this.getSingleUser(userId);

    let pipelineStage1;
    let pipelineStage2;
    let pipelineStage3;
    let pipelineStage4;
    let pipelineStage5;
    let pipelineStage1Sale;
    let pipelineStage2Sale;
    let pipelineStage3Sale;
    let pipelineStage4Sale;
    let pipelineStage5Sale;
    let pipelineStage1Support;
    let pipelineStage2Support;
    let pipelineStage3Support;
    let pipelineStage4Support;
    let pipelineStage5Support;

    // create pipelineStages object corresponding to each statuses

    pipelineStage1 = this.selectedUser.contactStatus.map((v) => ({
      ...v,
      stageId: uuidv4(),
    }));

    pipelineStage2 = this.selectedUser.contactStatusAddOne.map((v) => ({
      ...v,
      stageId: uuidv4(),
    }));

    pipelineStage3 = this.selectedUser.contactStatusAddTwo.map((v) => ({
      ...v,
      stageId: uuidv4(),
    }));

    pipelineStage4 = this.selectedUser.contactStatusAddThree.map((v) => ({
      ...v,
      stageId: uuidv4(),
    }));

    pipelineStage5 = this.selectedUser.contactStatusAddFour.map((v) => ({
      ...v,
      stageId: uuidv4(),
    }));

    pipelineStage1Sale = this.selectedUser.saleStages.map((v) => ({
      ...v,
      stageId: uuidv4(),
    }));

    pipelineStage2Sale = this.selectedUser.saleStagesAddOne.map((v) => ({
      ...v,
      stageId: uuidv4(),
    }));

    pipelineStage3Sale = this.selectedUser.saleStagesAddTwo.map((v) => ({
      ...v,
      stageId: uuidv4(),
    }));

    pipelineStage4Sale = this.selectedUser.saleStagesAddThree.map((v) => ({
      ...v,
      stageId: uuidv4(),
    }));

    pipelineStage5Sale = this.selectedUser.saleStagesAddFour.map((v) => ({
      ...v,
      stageId: uuidv4(),
    }));

    pipelineStage1Support = this.selectedUser.serviceStages.map((v) => ({
      ...v,
      stageId: uuidv4(),
    }));

    pipelineStage2Support = this.selectedUser.serviceStagesAddOne.map((v) => ({
      ...v,
      stageId: uuidv4(),
    }));

    pipelineStage3Support = this.selectedUser.serviceStagesAddTwo.map((v) => ({
      ...v,
      stageId: uuidv4(),
    }));

    pipelineStage4Support = this.selectedUser.serviceStagesAddThree.map(
      (v) => ({
        ...v,
        stageId: uuidv4(),
      })
    );

    pipelineStage5Support = this.selectedUser.serviceStagesAddFour.map((v) => ({
      ...v,
      stageId: uuidv4(),
    }));

    // populate customer pipeline local variable with data
    this.customerPipelines = [
      {
        pipelineName: this.selectedUser.pipelineNamesCustomer[0],
        pipelineId: Math.floor(Date.now() * Math.random()),
        pipelineStages: pipelineStage1,
      },
      {
        pipelineName: this.selectedUser.pipelineNamesCustomer[1],
        pipelineId: Math.floor(Date.now() * Math.random()),
        pipelineStages: pipelineStage2,
      },
      {
        pipelineName: this.selectedUser.pipelineNamesCustomer[2],
        pipelineId: Math.floor(Date.now() * Math.random()),
        pipelineStages: pipelineStage3,
      },
      {
        pipelineName: this.selectedUser.pipelineNamesCustomer[3],
        pipelineId: Math.floor(Date.now() * Math.random()),
        pipelineStages: pipelineStage4,
      },
      {
        pipelineName: this.selectedUser.pipelineNamesCustomer[4],
        pipelineId: Math.floor(Date.now() * Math.random()),
        pipelineStages: pipelineStage5,
      },
    ];

    const customerPipelines = {
      customerPipelines: this.customerPipelines,
    };

    const salePipelines = {
      salePipelines: [
        {
          pipelineName: this.selectedUser.pipelineNamesSales[0],
          pipelineId: Math.floor(Date.now() * Math.random()),
          pipelineStages: pipelineStage1Sale,
        },
        {
          pipelineName: this.selectedUser.pipelineNamesSales[1],
          pipelineId: Math.floor(Date.now() * Math.random()),
          pipelineStages: pipelineStage2Sale,
        },
        {
          pipelineName: this.selectedUser.pipelineNamesSales[2],
          pipelineId: Math.floor(Date.now() * Math.random()),
          pipelineStages: pipelineStage3Sale,
        },
        {
          pipelineName: this.selectedUser.pipelineNamesSales[3],
          pipelineId: Math.floor(Date.now() * Math.random()),
          pipelineStages: pipelineStage4Sale,
        },
        {
          pipelineName: this.selectedUser.pipelineNamesSales[4],
          pipelineId: Math.floor(Date.now() * Math.random()),
          pipelineStages: pipelineStage5Sale,
        },
      ],
    };

    const servicePipelines = {
      servicePipelines: [
        {
          pipelineName: this.selectedUser.pipelineNamesService[0],
          pipelineId: Math.floor(Date.now() * Math.random()),
          pipelineStages: pipelineStage1Support,
        },
        {
          pipelineName: this.selectedUser.pipelineNamesService[1],
          pipelineId: Math.floor(Date.now() * Math.random()),
          pipelineStages: pipelineStage2Support,
        },
        {
          pipelineName: this.selectedUser.pipelineNamesService[2],
          pipelineId: Math.floor(Date.now() * Math.random()),
          pipelineStages: pipelineStage3Support,
        },
        {
          pipelineName: this.selectedUser.pipelineNamesService[3],
          pipelineId: Math.floor(Date.now() * Math.random()),
          pipelineStages: pipelineStage4Support,
        },
        {
          pipelineName: this.selectedUser.pipelineNamesService[4],
          pipelineId: Math.floor(Date.now() * Math.random()),
          pipelineStages: pipelineStage5Support,
        },
      ],
    };

    this.serviceInstance
      .updatePipeLinenames(userId, 'Customer', customerPipelines)
      .then((resp1) => {
        console.log(
          'customerPipelines document added in pipelines Collection at user level,'
        );
        this.serviceInstance.updatePipeLinenames(
          userId,
          'Sales',
          salePipelines
        );
      })
      .then((resp2) => {
        console.log(
          'salePipelines document added in pipelines Collection at user level,'
        );
        this.serviceInstance.updatePipeLinenames(
          userId,
          'Service',
          servicePipelines
        );
      })
      .then((resp) => {
        console.log(
          'servicePipelines document added in pipelines Collection at user level,updating at contact collection starts'
        );
        this.updateAtContactCollection(userId);
      })
      .catch((err) => {
        console.log('pipeline and stage updation at user level failed', err);
      });
  }

  // update contact status, pipeline and stageHistory of added contacts
  async updateAtContactCollection(userId) {
    // keep a count of updated records
    this.updatedCount = 0;

    // fetch all contacts
    let allCustomers = await this.serviceInstance.getAllCustomers(userId);
    console.log('all customer count', allCustomers.length);

    for (let i = 0; i < allCustomers.length; i++) {
      // find stageId and PipelineId corresonding to status and selectedContactPipeline fields
      if (allCustomers[i].selectedContactPipeline === 0) {
        // pipelineId to replace
        const pipelineId = this.customerPipelines[0].pipelineId;

        // search for stageId with contact status
        var result = this.customerPipelines[0].pipelineStages?.filter((obj) => {
          return obj.name === allCustomers[i].status;
        }); //result holds statusObject

        // stageId to replace
        const stageId = result[0]?.stageId;
        let stageHistory: StageHistoryModel;
        // statusHistory to replace
        if (allCustomers[i].stageHistory) {
          if (allCustomers[i].stageHistory.length > 0) {
            stageHistory = {
              date: allCustomers[i].stageHistory[
                allCustomers[i].stageHistory.length - 1
              ].date ? allCustomers[i].stageHistory[
                allCustomers[i].stageHistory.length - 1
              ].date : new Date().getTime(), // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          } else {
            stageHistory = {
              date: allCustomers[i].stageHistory?.date ? allCustomers[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
        } else {
          stageHistory = {
            date: new Date().getTime(),  // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
        }

        // update in DB
        this.serviceInstance
          .updateContactStatus(
            userId,
            allCustomers[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            this.updatedCount++;
            console.log(
              'updated',
              this.updatedCount,
              'of total',
              allCustomers.length
            );
            if (i === allCustomers.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
      } else if (allCustomers[i].selectedContactPipeline === 1) {
        // pipelineId to replace
        const pipelineId = this.customerPipelines[1].pipelineId;

        // search for stageId with contact status
        var result = this.customerPipelines[1].pipelineStages?.filter((obj) => {
          return obj.name === allCustomers[i].status;
        }); //result holds statusObject

        // stageId to replace
        const stageId = result[0]?.stageId;

        // statusHistory to replace
        let stageHistory: StageHistoryModel;
        // statusHistory to replace
        if (allCustomers[i].stageHistory) {
          if (allCustomers[i].stageHistory.length > 0) {
            stageHistory = {
              date: allCustomers[i].stageHistory[
                allCustomers[i].stageHistory.length - 1
              ].date ? allCustomers[i].stageHistory[
                allCustomers[i].stageHistory.length - 1
              ].date : new Date().getTime(), // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          } else {
            stageHistory = {
              date: allCustomers[i].stageHistory?.date ? allCustomers[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
        } else {
          stageHistory = {
            date: new Date().getTime(),  // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
        }

        // update in DB
        this.serviceInstance
          .updateContactStatus(
            userId,
            allCustomers[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            this.updatedCount++;
            console.log(
              'updated',
              this.updatedCount,
              'of total',
              allCustomers.length
            );
            if (i === allCustomers.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
      } else if (allCustomers[i].selectedContactPipeline === 2) {
        // pipelineId to replace
        const pipelineId = this.customerPipelines[2].pipelineId;

        // search for stageId with contact status
        var result = this.customerPipelines[2].pipelineStages?.filter((obj) => {
          return obj.name === allCustomers[i].status;
        }); //result holds statusObject

        // stageId to replace
        const stageId = result[0]?.stageId;

        // statusHistory to replace
        let stageHistory: StageHistoryModel;
        // statusHistory to replace
        if (allCustomers[i].stageHistory) {
          if (allCustomers[i].stageHistory.length > 0) {
            stageHistory = {
              date: allCustomers[i].stageHistory[
                allCustomers[i].stageHistory.length - 1
              ].date ? allCustomers[i].stageHistory[
                allCustomers[i].stageHistory.length - 1
              ].date : new Date().getTime(), // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          } else {
            stageHistory = {
              date: allCustomers[i].stageHistory?.date ? allCustomers[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
        } else {
          stageHistory = {
            date: new Date().getTime(),  // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
        }

        // update in DB
        this.serviceInstance
          .updateContactStatus(
            userId,
            allCustomers[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            this.updatedCount++;
            console.log(
              'updated',
              this.updatedCount,
              'of total',
              allCustomers.length
            );
            if (i === allCustomers.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
      } else if (allCustomers[i].selectedContactPipeline === 3) {
        // pipelineId to replace
        const pipelineId = this.customerPipelines[3].pipelineId;

        // search for stageId with contact status
        var result = this.customerPipelines[3].pipelineStages?.filter((obj) => {
          return obj.name === allCustomers[i].status;
        }); //result holds statusObject

        // stageId to replace
        const stageId = result[0]?.stageId;

        // statusHistory to replace
        let stageHistory: StageHistoryModel;
        // statusHistory to replace
        if (allCustomers[i].stageHistory) {
          if (allCustomers[i].stageHistory.length > 0) {
            stageHistory = {
              date: allCustomers[i].stageHistory[
                allCustomers[i].stageHistory.length - 1
              ].date ? allCustomers[i].stageHistory[
                allCustomers[i].stageHistory.length - 1
              ].date : new Date().getTime(), // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          } else {
            stageHistory = {
              date: allCustomers[i].stageHistory?.date ? allCustomers[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
        } else {
          stageHistory = {
            date: new Date().getTime(),  // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
        }
        // update in DB
        this.serviceInstance
          .updateContactStatus(
            userId,
            allCustomers[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            this.updatedCount++;
            console.log(
              'updated',
              this.updatedCount,
              'of total',
              allCustomers.length
            );
            if (i === allCustomers.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
      } else if (allCustomers[i].selectedContactPipeline === 4) {
        // pipelineId to replace
        const pipelineId = this.customerPipelines[4].pipelineId;

        // search for stageId with contact status
        var result = this.customerPipelines[4].pipelineStages?.filter((obj) => {
          return obj.name === allCustomers[i].status;
        }); //result holds statusObject

        // stageId to replace
        const stageId = result[0]?.stageId;

        // statusHistory to replace
        let stageHistory: StageHistoryModel;
        // statusHistory to replace
        if (allCustomers[i].stageHistory) {
          if (allCustomers[i].stageHistory.length > 0) {
            stageHistory = {
              date: allCustomers[i].stageHistory[
                allCustomers[i].stageHistory.length - 1
              ].date ? allCustomers[i].stageHistory[
                allCustomers[i].stageHistory.length - 1
              ].date : new Date().getTime(), // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          } else {
            stageHistory = {
              date: allCustomers[i].stageHistory?.date ? allCustomers[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
        } else {
          stageHistory = {
            date: new Date().getTime(),  // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
        }

        // update in DB
        this.serviceInstance
          .updateContactStatus(
            userId,
            allCustomers[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            this.updatedCount++;
            console.log(
              'updated',
              this.updatedCount,
              'of total',
              allCustomers.length
            );
            if (i === allCustomers.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
      } else if (
        allCustomers[i].selectedContactPipeline ===
          this.customerPipeline[0].pipelineId ||
        allCustomers[i].selectedContactPipeline ===
          this.customerPipeline[1].pipelineId ||
        allCustomers[i].selectedContactPipeline ===
          this.customerPipeline[2].pipelineId ||
        allCustomers[i].selectedContactPipeline ===
          this.customerPipeline[3].pipelineId ||
        allCustomers[i].selectedContactPipeline ===
          this.customerPipeline[4].pipelineId
      ) {
        // do nothing
        console.log('if5');
        this.updatedCount++;
      } else {
        console.log('contacts without selectedContactPipeline field');
        console.log(
          'customer',
          allCustomers[i].firstName,
          allCustomers[i].secondName,
          allCustomers[i].id
        );
        // pipelineId to replace
        const pipelineId = this.customerPipeline[0].pipelineId;

        // search for stageId with contact status
        const result = this.customerPipeline[0].pipelineStages?.filter((obj) => {
          return obj.name === allCustomers[i].status;
        }); //result holds statusObject

        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;

          // statusHistory to replace
          if (allCustomers[i].stageHistory) {
            if (allCustomers[i].stageHistory.length > 0) {
              stageHistory = {
                date: allCustomers[i].stageHistory[
                  allCustomers[i].stageHistory.length - 1
                ].date ? allCustomers[i].stageHistory[
                  allCustomers[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            } else {
              stageHistory = {
                date: allCustomers[i].stageHistory?.date ? allCustomers[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          } else {
            stageHistory = {
              date: new Date().getTime(),  // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
        } else {
          stageId = this.customerPipeline[0].pipelineStages[0].stageId;
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
        }

        // update in DB
        this.serviceInstance
          .updateContactStatus(
            userId,
            allCustomers[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            this.updatedCount++;
            console.log(
              'updated',
              this.updatedCount,
              'of total',
              allCustomers.length
            );
            if (i === allCustomers.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
      }
    }
  }
  async updateAtSUbUsers(userId) {
    await this.getSubUsers(userId);
    console.log(this.subUsers);
    if (this.subUsers?.length > 0) {
      for (let i = 0; i < this.subUsers.length; i++) {
        await this.updateAtUserCollection(this.subUsers[i].userId).then(
          (resp) => {
            console.log('updating', i + 1, 'subuser of', this.subUsers.length);
          }
        );
      }
    }
  }

  // to run in superUser
  async updateContacts(userId) {
    await this.getCustomerPipelines(userId);
    // keep a count of updated records
    this.updatedCount = 0;

    // fetch all contacts
    let allCustomers = await this.serviceInstance.getAllCustomers(userId);
    console.log('all customer count', allCustomers.length);

    for (let i = 0; i < allCustomers.length; i++) {
      // find stageId and PipelineId corresonding to status and selectedContactPipeline fields
      if (allCustomers[i].selectedContactPipeline === 0) {
        console.log('if1', allCustomers[i].firstName, this.customerPipeline[0]);
        // pipelineId to replace
        const pipelineId = this.customerPipeline[0].pipelineId;
        console.log(pipelineId);

        // search for stageId with contact status
        var result = this.customerPipeline[0].pipelineStages?.filter((obj) => {
          return obj.name === allCustomers[i].status;
        }); //result holds statusObject
        console.log(result);
        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          console.log('result');
          // stageId to replace
          stageId = result[0]?.stageId;
          console.log('stageId', stageId);

          // statusHistory to replace
          if (allCustomers[i].stageHistory) {
            if (allCustomers[i].stageHistory.length > 0) {
              stageHistory = {
                date: allCustomers[i].stageHistory[
                  allCustomers[i].stageHistory.length - 1
                ].date ? allCustomers[i].stageHistory[
                  allCustomers[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            } else {
              stageHistory = {
                date: allCustomers[i].stageHistory?.date ? allCustomers[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          } else {
            stageHistory = {
              date: new Date().getTime(),  // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
          console.log('stageHistory', stageHistory);
        } else {
          console.log('result else');
          stageId = this.customerPipeline[0].pipelineStages[0].stageId;
          console.log('stageId', stageId);
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
          console.log('stageHistory', stageHistory);
        }

        // update in DB
        this.serviceInstance
          .updateContactStatus(
            userId,
            allCustomers[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            this.updatedCount++;
            console.log(
              'updated',
              this.updatedCount,
              'of total',
              allCustomers.length
            );
            if (i === allCustomers.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
      } else if (allCustomers[i].selectedContactPipeline === 1) {
        console.log('if2');
        // pipelineId to replace
        const pipelineId = this.customerPipeline[1].pipelineId;

        // search for stageId with contact status
        var result = this.customerPipeline[1].pipelineStages?.filter((obj) => {
          return obj.name === allCustomers[i].status;
        }); //result holds statusObject

        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;

          // statusHistory to replace
          if (allCustomers[i].stageHistory) {
            if (allCustomers[i].stageHistory.length > 0) {
              stageHistory = {
                date: allCustomers[i].stageHistory[
                  allCustomers[i].stageHistory.length - 1
                ].date ? allCustomers[i].stageHistory[
                  allCustomers[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            } else {
              stageHistory = {
                date: allCustomers[i].stageHistory?.date ? allCustomers[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          } else {
            stageHistory = {
              date: new Date().getTime(),  // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
        } else {
          stageId = this.customerPipeline[1].pipelineStages[0].stageId;
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
        }

        // update in DB
        this.serviceInstance
          .updateContactStatus(
            userId,
            allCustomers[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            this.updatedCount++;
            console.log(
              'updated',
              this.updatedCount,
              'of total',
              allCustomers.length
            );
            if (i === allCustomers.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
      } else if (allCustomers[i].selectedContactPipeline === 2) {
        console.log('if3');
        // pipelineId to replace
        const pipelineId = this.customerPipeline[2].pipelineId;

        // search for stageId with contact status
        var result = this.customerPipeline[2].pipelineStages?.filter((obj) => {
          return obj.name === allCustomers[i].status;
        }); //result holds statusObject

        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;

          // statusHistory to replace
          if (allCustomers[i].stageHistory) {
            if (allCustomers[i].stageHistory.length > 0) {
              stageHistory = {
                date: allCustomers[i].stageHistory[
                  allCustomers[i].stageHistory.length - 1
                ].date ? allCustomers[i].stageHistory[
                  allCustomers[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            } else {
              stageHistory = {
                date: allCustomers[i].stageHistory?.date ? allCustomers[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          } else {
            stageHistory = {
              date: new Date().getTime(),  // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
        } else {
          stageId = this.customerPipeline[2].pipelineStages[0].stageId;
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
        }

        // update in DB
        this.serviceInstance
          .updateContactStatus(
            userId,
            allCustomers[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            this.updatedCount++;
            console.log(
              'updated',
              this.updatedCount,
              'of total',
              allCustomers.length
            );
            if (i === allCustomers.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
      } else if (allCustomers[i].selectedContactPipeline === 3) {
        console.log('if4');
        // pipelineId to replace
        const pipelineId = this.customerPipeline[3].pipelineId;

        // search for stageId with contact status
        var result = this.customerPipeline[3].pipelineStages?.filter((obj) => {
          return obj.name === allCustomers[i].status;
        }); //result holds statusObject

        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;

          // statusHistory to replace
          if (allCustomers[i].stageHistory) {
            if (allCustomers[i].stageHistory.length > 0) {
              stageHistory = {
                date: allCustomers[i].stageHistory[
                  allCustomers[i].stageHistory.length - 1
                ].date ? allCustomers[i].stageHistory[
                  allCustomers[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            } else {
              stageHistory = {
                date: allCustomers[i].stageHistory?.date ? allCustomers[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          } else {
            stageHistory = {
              date: new Date().getTime(),  // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
        } else {
          stageId = this.customerPipeline[3].pipelineStages[0].stageId;
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
        }

        // update in DB
        this.serviceInstance
          .updateContactStatus(
            userId,
            allCustomers[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            this.updatedCount++;
            console.log(
              'updated',
              this.updatedCount,
              'of total',
              allCustomers.length
            );
            if (i === allCustomers.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
      } else if (allCustomers[i].selectedContactPipeline === 4) {
        // pipelineId to replace
        const pipelineId = this.customerPipeline[4].pipelineId;

        // search for stageId with contact status
        var result = this.customerPipeline[4].pipelineStages?.filter((obj) => {
          return obj.name === allCustomers[i].status;
        }); //result holds statusObject

        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;

          // statusHistory to replace
          if (allCustomers[i].stageHistory) {
            if (allCustomers[i].stageHistory.length > 0) {
              stageHistory = {
                date: allCustomers[i].stageHistory[
                  allCustomers[i].stageHistory.length - 1
                ].date ? allCustomers[i].stageHistory[
                  allCustomers[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            } else {
              stageHistory = {
                date: allCustomers[i].stageHistory?.date ? allCustomers[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          } else {
            stageHistory = {
              date: new Date().getTime(),  // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
        } else {
          stageId = this.customerPipeline[4].pipelineStages[0].stageId;
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
        }

        // update in DB
        this.serviceInstance
          .updateContactStatus(
            userId,
            allCustomers[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            this.updatedCount++;
            console.log(
              'updated',
              this.updatedCount,
              'of total',
              allCustomers.length
            );
            if (i === allCustomers.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
      } else if (
        allCustomers[i].selectedContactPipeline ===
          this.customerPipeline[0].pipelineId ||
        allCustomers[i].selectedContactPipeline ===
          this.customerPipeline[1].pipelineId ||
        allCustomers[i].selectedContactPipeline ===
          this.customerPipeline[2].pipelineId ||
        allCustomers[i].selectedContactPipeline ===
          this.customerPipeline[3].pipelineId ||
        allCustomers[i].selectedContactPipeline ===
          this.customerPipeline[4].pipelineId
      ) {
        // do nothing
        console.log('if5');
        this.updatedCount++;
      } else {
        console.log('else');
        console.log('contacts without selectedContactPipeline field');
        console.log(
          'customer',
          allCustomers[i].firstName,
          allCustomers[i].secondName,
          allCustomers[i].id
        );
        // pipelineId to replace
        const pipelineId = this.customerPipeline[0].pipelineId;

        // search for stageId with contact status
        var result = this.customerPipeline[0].pipelineStages?.filter((obj) => {
          return obj.name === allCustomers[i].status;
        }); //result holds statusObject

        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;

          // statusHistory to replace
          if (allCustomers[i].stageHistory) {
            if (allCustomers[i].stageHistory.length > 0) {
              stageHistory = {
                date: allCustomers[i].stageHistory[
                  allCustomers[i].stageHistory.length - 1
                ].date ? allCustomers[i].stageHistory[
                  allCustomers[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            } else {
              stageHistory = {
                date: allCustomers[i].stageHistory?.date ? allCustomers[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          } else {
            stageHistory = {
              date: new Date().getTime(),  // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
        } else {
          stageId = this.customerPipeline[0].pipelineStages[0].stageId;
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
        }

        // update in DB
        this.serviceInstance
          .updateContactStatus(
            userId,
            allCustomers[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            this.updatedCount++;
            console.log(
              'updated',
              this.updatedCount,
              'of total',
              allCustomers.length
            );
            if (i === allCustomers.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
        if (i === allCustomers.length - 1) {
          console.log('contact updation completed, start updation at subusers');
        }
      }
    }
  }

  getCustomerPipelines(userId) {
    return new Promise<void>((resolve) => {
      this.serviceInstance
        .getCustomerPipeline(userId)
        .subscribe((customerPipelines) => {
          console.log(customerPipelines);
          this.customerPipeline = customerPipelines.customerPipelines;
          resolve();
        });
    });
  }

  async updateProducts(userId) {
    await this.getAllSales(userId);
    console.log(this.sales);
    for (const sale of this.sales) {
      this.serviceInstance
        .checkItemsCollection(userId, sale.id)
        .toPromise()
        .then(async (res) => {
          if (res.size && res.size > 0) {
            await this.getAllItems(userId, sale.id);
            console.log('sale Title', sale.saleTitle);

            let itemsArray = <ProductInSaleModel>{};
            console.log(this.itemsSale);
            this.itemsSale.forEach((doc, index) => {
              itemsArray[index] = {
                prodName: doc.prodName,
                hsnCode: doc.hsnCode ? doc.hsnCode : '',
                prodDes: doc.prodDes,
                currency: doc.currency,
                unitPrice: doc.unitPrice,
                unit: doc.unit,
                quantity: doc.quantity,
                discount: doc.discount,
                cgst: doc.cgst,
                sgst: doc.sgst,
                igst: doc.igst,
                vatRate: doc.vatRate,
                taxType: doc.taxType,
                productId: doc.id,
                prodCategory: doc.prodCategory ? doc.prodCategory : '',
                additionalFieldsArr: doc.additionalFieldsArr
                  ? doc.additionalFieldsArr
                  : null,
              };
            });
            console.log('items field', itemsArray);
            this.serviceInstance.onUpdateSaleItem(userId, sale.id, itemsArray);
          }
        });
    }
  }

  async updateStatus(userId) {
    this.updateuserLevele = true;
    console.log(userId);

    // fetch single user
    await this.getSingleUser(userId);
    this.wonArrayCust = [];
    this.lostArrayCust = [];
    this.wonArraySale = [];
    this.lostArraySale = [];
    this.wonArrayService = [];
    this.lostArrayService = [];

    // customer starts here

    const custPipeLineArr1 = this.selectedUser.contactStatus.map(
      ({ name }) => name
    );

    this.wonArrayCust.push(custPipeLineArr1[custPipeLineArr1.length - 2]);
    this.lostArrayCust.push(custPipeLineArr1[custPipeLineArr1.length - 1]);

    const custPipeLineArr2 = this.selectedUser.contactStatusAddOne.map(
      ({ name }) => name
    );

    this.wonArrayCust.push(custPipeLineArr2[custPipeLineArr2.length - 2]);
    this.lostArrayCust.push(custPipeLineArr2[custPipeLineArr2.length - 1]);

    const custPipeLineArr3 = this.selectedUser.contactStatusAddTwo.map(
      ({ name }) => name
    );

    this.wonArrayCust.push(custPipeLineArr3[custPipeLineArr3.length - 2]);
    this.lostArrayCust.push(custPipeLineArr3[custPipeLineArr3.length - 1]);

    const custPipeLineArr4 = this.selectedUser.contactStatusAddThree.map(
      ({ name }) => name
    );

    this.wonArrayCust.push(custPipeLineArr4[custPipeLineArr4.length - 2]);
    this.lostArrayCust.push(custPipeLineArr4[custPipeLineArr4.length - 1]);

    const custPipeLineArr5 = this.selectedUser.contactStatusAddFour.map(
      ({ name }) => name
    );

    this.wonArrayCust.push(custPipeLineArr5[custPipeLineArr5.length - 2]);
    this.lostArrayCust.push(custPipeLineArr5[custPipeLineArr5.length - 1]);

    // customer ends here

    // sale starts here
    const salePipeLineArr1 = this.selectedUser.saleStages.map(
      ({ name }) => name
    );

    this.wonArraySale.push(salePipeLineArr1[salePipeLineArr1.length - 2]);
    this.lostArraySale.push(salePipeLineArr1[salePipeLineArr1.length - 1]);

    const salePipeLineArr2 = this.selectedUser.saleStagesAddOne.map(
      ({ name }) => name
    );

    this.wonArraySale.push(salePipeLineArr2[salePipeLineArr2.length - 2]);
    this.lostArraySale.push(salePipeLineArr2[salePipeLineArr2.length - 1]);

    const salePipeLineArr3 = this.selectedUser.saleStagesAddTwo.map(
      ({ name }) => name
    );

    this.wonArraySale.push(salePipeLineArr3[salePipeLineArr3.length - 2]);
    this.lostArraySale.push(salePipeLineArr3[salePipeLineArr3.length - 1]);

    const salePipeLineArr4 = this.selectedUser.saleStagesAddThree.map(
      ({ name }) => name
    );

    this.wonArraySale.push(salePipeLineArr4[salePipeLineArr4.length - 2]);
    this.lostArraySale.push(salePipeLineArr4[salePipeLineArr4.length - 1]);

    const salePipeLineArr5 = this.selectedUser.saleStagesAddFour.map(
      ({ name }) => name
    );

    this.wonArraySale.push(salePipeLineArr5[salePipeLineArr5.length - 2]);
    this.lostArraySale.push(salePipeLineArr5[salePipeLineArr5.length - 1]);
    // sale ends here

    // service starts here
    const servicePipeLineArr1 = this.selectedUser.serviceStages.map(
      ({ name }) => name
    );

    this.wonArrayService.push(
      servicePipeLineArr1[servicePipeLineArr1.length - 2]
    );
    this.lostArrayService.push(
      servicePipeLineArr1[servicePipeLineArr1.length - 1]
    );

    const servicePipeLineArr2 = this.selectedUser.serviceStagesAddOne.map(
      ({ name }) => name
    );

    this.wonArrayService.push(
      servicePipeLineArr2[servicePipeLineArr2.length - 2]
    );
    this.lostArrayService.push(
      servicePipeLineArr2[servicePipeLineArr2.length - 1]
    );

    const servicePipeLineArr3 = this.selectedUser.serviceStagesAddTwo.map(
      ({ name }) => name
    );

    this.wonArrayService.push(
      servicePipeLineArr3[servicePipeLineArr3.length - 2]
    );
    this.lostArrayService.push(
      servicePipeLineArr3[servicePipeLineArr3.length - 1]
    );

    const servicePipeLineArr4 = this.selectedUser.serviceStagesAddThree.map(
      ({ name }) => name
    );

    this.wonArrayService.push(
      servicePipeLineArr4[servicePipeLineArr4.length - 2]
    );
    this.lostArrayService.push(
      servicePipeLineArr4[servicePipeLineArr4.length - 1]
    );

    const servicePipeLineArr5 = this.selectedUser.serviceStagesAddFour.map(
      ({ name }) => name
    );

    this.wonArrayService.push(
      servicePipeLineArr5[servicePipeLineArr5.length - 2]
    );
    this.lostArrayService.push(
      servicePipeLineArr5[servicePipeLineArr5.length - 1]
    );

    // service ends here

    // console.log(this.selectedUser);
    // this.customerWonStatus = this.selectedUser.custStatus[this.selectedUser.custStatus.length - 2];
    // this.customerLostStatus = this.selectedUser.custStatus[this.selectedUser.custStatus.length - 1];
    // this.saleWonStatus = this.selectedUser.saleStatus[this.selectedUser.saleStatus.length - 2];
    // this.saleLostStatus = this.selectedUser.saleStatus[this.selectedUser.saleStatus.length - 1];
    // this.serviceWonStatus = this.selectedUser.serviceStages[this.selectedUser.serviceStages.length - 2];
    // this.serviceLostStatus = this.selectedUser.serviceStages[this.selectedUser.serviceStages.length - 1];
    // console.log(this.customerWonStatus, this.customerLostStatus, this.saleWonStatus, this.saleLostStatus)

    // // data transformation of contact status and age to Array of objects
    // let items = [];
    // this.selectedUser.custStatus.forEach((ele, i) => {
    //   items[i] = {
    //     name: ele,
    //     age: this.selectedUser.custStatusAge[i]
    //       ? this.selectedUser.custStatusAge[i]
    //       : 5,
    //   };
    // });

    // // data transformation of sale status and age to Array of objects
    // let itemsSale = [];
    // this.selectedUser.saleStatus.forEach((ele, i) => {
    //   itemsSale[i] = {
    //     name: ele,
    //     age: this.selectedUser.saleStatusAge[i]
    //       ? this.selectedUser.saleStatusAge[i]
    //       : 5,
    //   };
    // });

    // update contact status and sale stages at user level
    // await this.updateUserLev(userId, items, itemsSale);

    // get customers
    this.updateCustColl = true;
    await this.getAllCustomers(userId);
    console.log('customer length', this.customer.length);
    console.log('customer updation starting');
    //console.log(this.customer);
    this.customer.forEach((eleCust) => {
      if (this.wonArrayCust.includes(eleCust.status)) {
        this.customerWon = true;
        this.customerLost = false;
        this.customerInPipeline = false;
      } else if (this.lostArrayCust.includes(eleCust.status)) {
        this.customerWon = false;
        this.customerLost = true;
        this.customerInPipeline = false;
      } else {
        this.customerWon = false;
        this.customerLost = false;
        this.customerInPipeline = true;
      }
      this.serviceInstance.onUpdateCustomer(
        userId,
        eleCust.id,
        this.customerInPipeline,
        this.customerWon,
        this.customerLost
      );
    }); //update in customer collection
    this.updateCustColl = false;
    console.log('customer updation completed');

    // update in services
    await this.getAllServices(userId);
    console.log('service lengtg', this.services.length);
    console.log('service updation start');
    //console.log(this.sales);
    this.services.forEach((eleService) => {
      if (this.wonArrayService.includes(eleService.servicesStage)) {
        this.serviceWon = true;
        this.serviceLost = false;
        this.serviceInPipeline = false;
      } else if (this.lostArrayService.includes(eleService.servicesStage)) {
        this.serviceWon = false;
        this.serviceLost = true;
        this.serviceInPipeline = false;
      } else {
        this.serviceWon = false;
        this.serviceLost = false;
        this.serviceInPipeline = true;
      }
      this.serviceInstance.onUpdateService(
        userId,
        eleService.id,
        this.serviceInPipeline,
        this.serviceWon,
        this.serviceLost
      );
    }); //update in sale collection
    console.log('service updation completed');

    // update in Sales
    this.updateSaleColl = true;

    await this.getAllSales(userId);
    console.log('sale lengtg', this.sales.length);
    console.log('sale updation start');
    //console.log(this.sales);
    this.sales.forEach((eleSale) => {
      if (this.wonArraySale.includes(eleSale.salesStage)) {
        this.saleWon = true;
        this.saleLost = false;
        this.saleInPipeline = false;
      } else if (this.lostArraySale.includes(eleSale.salesStage)) {
        this.saleWon = false;
        this.saleLost = true;
        this.saleInPipeline = false;
      } else {
        this.saleWon = false;
        this.saleLost = false;
        this.saleInPipeline = true;
      }
      this.serviceInstance.onUpdateSale(
        userId,
        eleSale.id,
        this.saleInPipeline,
        this.saleWon,
        this.saleLost
      );
    }); //update in sale collection
    console.log('sale updation completed');
    this.updateSaleColl = false;
  }

  getSingleUser(userId) {
    return new Promise<void>((resolve) => {
      this.serviceInstance.getSingleUser(userId).subscribe((singleUser) => {
        console.log(singleUser);
        this.selectedUser = singleUser;
        resolve();
      });
    });
  }

  updateUserLev(userId, items, itemsSale) {
    return new Promise<void>((resolve) => {
      // update contact status and sale stages at user level
      this.serviceInstance.updateUser(userId, items, itemsSale).then((resp) => {
        console.log('user upadtion completed');
        this.updateuserLevele = false;
        resolve();
      });
    });
  }

  getAllCustomers(userId) {
    return new Promise<void>((resolve) => {
      this.serviceInstance
        .getAllCustomer(userId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.customer = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Customer;
          });
          resolve();
        });
    });
  }

  getBranches(userId) {
    return new Promise<void>((resolve) => {
      this.serviceInstance
        .getBranches(userId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.branches = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Branch;
          });
          resolve();
        });
    });
  }

  getSubUsers(userId) {
    return new Promise<void>((resolve) => {
      this.serviceInstance
        .getSubUsers(userId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.subUsers = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as SubUsers;
          });
          resolve();
        });
    });
  }

  getAllSales(userId) {
    return new Promise<void>((resolve) => {
      this.serviceInstance
        .getAllSale(userId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.sales = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Sales;
          });
          resolve();
        });
    });
  }

  getAllItems(userId, saleId) {
    return new Promise<void>((resolve) => {
      this.serviceInstance
        .getSaleProducts(userId, saleId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.itemsSale = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as ProductInSaleModel;
          });
          resolve();
        });
    });
  }

  getAllServices(userId) {
    return new Promise<void>((resolve) => {
      this.serviceInstance
        .getAllService(userId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.services = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Service;
          });
          resolve();
        });
    });
  }

  getAllTasks(userId) {
    return new Promise<void>((resolve) => {
      this.serviceInstance
        .getTasks(userId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.tasks = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as Task;
          });
          resolve();
        });
    });
  }

  getAllFollowUps(userId) {
    return new Promise<void>((resolve) => {
      this.serviceInstance
        .getFollowUps(userId)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          this.followUps = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as FollowUps;
          });
          resolve();
        });
    });
  }

  async updateFieldsInProfiles(userId) {
    await this.getAllProfiles(userId);
    console.log(this.profiles);
    console.log('profile length', this.profiles?.length);
    if (this.profiles?.length >= 3) {
      this.profiles.forEach((ele) => {
        this.serviceInstance.onUpdateProfile(userId, ele.id);
      }); //update in sale collection
      console.log('profile updation completed');
    }
  }
  async updateReAssignAndDataAccessRule(userId) {
    await this.getAllProfiles(userId);
    console.log(this.profiles);
    console.log('profile length', this.profiles?.length);
    if (this.profiles?.length >= 3) {
      this.profiles.forEach((ele) => {
        this.serviceInstance.onUpdateProfile2(
          userId,
          ele.id,
          ele.dialogdataAccessRule
        );
      }); //update in sale collection
      console.log('profile updation completed');
    }
  }
  getAllProfiles(userId) {
    return new Promise<void>(async (resolve) => {
      (await this.serviceInstance.getAllProfile(userId))
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((data) => {
          let defProfiles = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as {}),
            } as {};
          });
          if (defProfiles?.length >= 3) {
            this.profiles = defProfiles;
            resolve();
          }
        });
    });
  }

  // 23/08/2022 - function to add associatedBranch

  // 1. we have to add branches under subusers
  // 2. we have to configure branches to subusers
  // 3. then run script

  async addAssociatedBranch(userId) {
    // additionalField index check
    await this.getSingleUser(userId);
    console.log(this.selectedUser);

    // Get the index of the object in the array
    const indexOfObject = this.selectedUser.customFieldsContact.findIndex(
      (obj) => {
        if (obj.fieldName === 'Branch') {
          return true;
        }
        return false;
      }
    );
    console.log('index of Branches', indexOfObject);

    // get subusers to get the branch asssociated with subusers for task case
    await this.getSubUsers(userId);
    console.log('Subusers length', this.subUsers.length);

    // get all branches and find branchId corresponding to Calicut and Kochi
    await this.getBranches(userId);
    console.log(this.branches);
    if (this.branches?.length > 0) {
      for (let k = 0; k < this.branches.length; k++) {
        if (this.branches[k].name === 'Cochin') {
          this.associatedBranchKochi = this.branches[k].id;
        } else if (this.branches[k].name === 'Calicut') {
          this.associatedBranchCalicut = this.branches[k].id;
        }
      }
    }
    console.log('calicut branchId', this.associatedBranchCalicut);
    console.log('kochi branchId', this.associatedBranchKochi);

    // 1.update in customer collection
    await this.getAllCustomers(userId);
    console.log('customer length', this.customer.length);
    console.log('customer updation starting');

    this.customer.forEach((eleCust) => {
      if (
        eleCust.additionalFieldsArr &&
        eleCust.additionalFieldsArr[indexOfObject + ''] &&
        eleCust.additionalFieldsArr[indexOfObject + ''].fieldValue === 'Calicut'
      ) {
        this.serviceInstance.onUpdateCustomerBranch(
          userId,
          eleCust.id,
          this.associatedBranchCalicut
        ); //update in customer collection
      } else if (
        eleCust.additionalFieldsArr &&
        eleCust.additionalFieldsArr[indexOfObject + ''] &&
        eleCust.additionalFieldsArr[indexOfObject + ''].fieldValue === 'Kochi'
      ) {
        this.serviceInstance.onUpdateCustomerBranch(
          userId,
          eleCust.id,
          this.associatedBranchKochi
        ); //update in customer collection
      } else {
        this.serviceInstance.onUpdateCustomerBranch(
          userId,
          eleCust.id,
          this.associatedBranch
        ); //update in customer collection
      }
    });
    console.log('customer updation completed');

    // 2.update in sale collection
    await this.getAllSales(userId);
    console.log('sales length', this.sales.length);
    console.log('sales updation starting');

    this.sales.forEach((eleSale) => {
      let assBranch = this.customer.find(
        (item) => item.id === eleSale.customerId
      ).additionalFieldsArr
        ? this.customer.find((item) => item.id === eleSale.customerId)
            .additionalFieldsArr[indexOfObject + '']?.fieldValue
        : '';

      console.log(assBranch);

      if (assBranch && assBranch === 'Calicut') {
        this.serviceInstance.onUpdateSaleBranch(
          userId,
          eleSale.id,
          this.associatedBranchCalicut
        ); //update in sale collection
      } else if (assBranch && assBranch === 'Kochi') {
        this.serviceInstance.onUpdateSaleBranch(
          userId,
          eleSale.id,
          this.associatedBranchKochi
        ); //update in sale collection
      } else {
        this.serviceInstance.onUpdateSaleBranch(
          userId,
          eleSale.id,
          this.associatedBranch
        ); //update in sale collection
      }
    });
    console.log('sale updation completed');

    // 3.update in service collection
    await this.getAllServices(userId);
    console.log('services length', this.services.length);
    console.log('services updation starting');

    this.services.forEach((eleSale) => {
      let assBranch = this.customer.find(
        (item) => item.id === eleSale.customerId
      ).additionalFieldsArr
        ? this.customer.find((item) => item.id === eleSale.customerId)
            .additionalFieldsArr[indexOfObject + '']?.fieldValue
        : '';

      console.log(assBranch);

      if (assBranch && assBranch === 'Calicut') {
        this.serviceInstance.onUpdateSupportBranch(
          userId,
          eleSale.id,
          this.associatedBranchCalicut
        ); //update in service collection
      } else if (assBranch && assBranch === 'Kochi') {
        this.serviceInstance.onUpdateSupportBranch(
          userId,
          eleSale.id,
          this.associatedBranchKochi
        ); //update in service collection
      } else {
        this.serviceInstance.onUpdateSupportBranch(
          userId,
          eleSale.id,
          this.associatedBranch
        ); //update in service collection
      }
    });
    console.log('service updation completed');

    // 4.update in followups collection
    await this.getAllFollowUps(userId);
    console.log('followups length', this.followUps.length);
    console.log('followUps updation starting');

    this.followUps.forEach((eleSale) => {
      let assBranch = this.customer.find(
        (item) => item.id === eleSale.customerId
      )?.additionalFieldsArr
        ? this.customer.find((item) => item.id === eleSale.customerId)
            ?.additionalFieldsArr[indexOfObject + '']?.fieldValue
        : '';

      console.log(assBranch);

      if (assBranch && assBranch === 'Calicut') {
        this.serviceInstance.onUpdateFollBranch(
          userId,
          eleSale.id,
          this.associatedBranchCalicut
        ); //update in followUps collection
      } else if (assBranch && assBranch === 'Kochi') {
        this.serviceInstance.onUpdateFollBranch(
          userId,
          eleSale.id,
          this.associatedBranchKochi
        ); //update in followUps collection
      } else {
        this.serviceInstance.onUpdateFollBranch(
          userId,
          eleSale.id,
          this.associatedBranch
        ); //update in followUps collection
      }
    });
    console.log('followUps updation completed');

    // 5.update in task collection
    await this.getAllTasks(userId);
    console.log('tasks length', this.tasks.length);
    console.log('task updation starting');

    this.tasks.forEach((eleSale) => {
      let assBranch = eleSale.customerId
        ? this.customer.find((item) => item.id === eleSale.customerId)
            .additionalFieldsArr
          ? this.customer.find((item) => item.id === eleSale.customerId)
              .additionalFieldsArr[indexOfObject + '']?.fieldValue
          : ''
        : '';

      console.log(assBranch);

      if (assBranch && assBranch === 'Calicut') {
        this.serviceInstance.onUpdateTaskBranch(
          userId,
          eleSale.id,
          this.associatedBranchCalicut
        ); //update in task collection
      } else if (assBranch && assBranch === 'Kochi') {
        this.serviceInstance.onUpdateTaskBranch(
          userId,
          eleSale.id,
          this.associatedBranchKochi
        ); //update in task collection
      } else {
        // find branch corresponding to assignedto user
        let assocBranch = this.subUsers.find(
          (subuser) => subuser.userId === eleSale.assignedTo
        )?.branchId;
        console.log(assocBranch);

        if (assocBranch) {
          this.serviceInstance.onUpdateTaskBranch(
            userId,
            eleSale.id,
            assocBranch
          ); //update in task collection
        } else {
          const aBranch = this.branches.find(
            (item) => item.name === 'Calicut'
          ).id;

          this.serviceInstance.onUpdateTaskBranch(userId, eleSale.id, aBranch); //update in task collection
        }
      }
    });
    console.log('task updation completed');
  }
  // on destroy
  @HostListener('window:beforeunload')
  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  // to run in superUser
  async updateServicePipelineAndStatus(userId) {
    await this.getServicePipelines(userId);
    // keep a count of updated records
    let updatedServiceCount = 0;

    // fetch all contacts
    let allServices = await this.serviceInstance.getAllServiceForPipeline(
      userId
    );
    console.log('all service count', allServices.length);

    for (let i = 0; i < allServices.length; i++) {
      // find stageId and PipelineId corresonding to status and selectedServPipeline fields
      if (allServices[i].selectedServPipeline === 0) {
        console.log('first pipeline');
        // pipelineId to replace
        const pipelineId = this.servicePipelines[0].pipelineId;
        console.log('first pipeline id' + pipelineId);

        // search for stageId with contact status
        var result = this.servicePipelines[0].pipelineStages?.filter((obj) => {
          return obj.name === allServices[i].servicesStage;
        }); //result holds statusObject
        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;
          console.log('stageId', stageId);

          // statusHistory to replace
          if(allServices[i].stageHistory){
            if(allServices[i].stageHistory.length>0){
              stageHistory = {
                date: allServices[i].stageHistory[
                  allServices[i].stageHistory.length - 1
                ].date ? allServices[i].stageHistory[
                  allServices[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }else{
              stageHistory = {
                date: allServices[i].stageHistory?.date ? allServices[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          }else{
            stageHistory = {
              date: new Date().getTime(), // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }

          console.log('stageHistory', stageHistory);
        } else {
          console.log('no status else');
          stageId = this.servicePipelines[0].pipelineStages[0].stageId;
          console.log('stageId', stageId);
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
          console.log('stageHistory', stageHistory);
        }

        // update in DB
        this.serviceInstance
          .updateServicePipelineAndStatus(
            userId,
            allServices[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            updatedServiceCount++;
            console.log(
              'updated',
              updatedServiceCount,
              'of total',
              allServices.length
            );
            if (i === allServices.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
      } else if (allServices[i].selectedServPipeline === 1) {
        console.log('second pipeline');
        // pipelineId to replace
        const pipelineId = this.servicePipelines[1].pipelineId;
        console.log('second pipeline id' + pipelineId);
        // search for stageId with contact status
        var result = this.servicePipelines[1].pipelineStages?.filter((obj) => {
          return obj.name === allServices[i].servicesStage;
        }); //result holds statusObject

        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;
          console.log('stageId', stageId);
          // statusHistory to replace
          if(allServices[i].stageHistory){
            if(allServices[i].stageHistory.length>0){
              stageHistory = {
                date: allServices[i].stageHistory[
                  allServices[i].stageHistory.length - 1
                ].date ? allServices[i].stageHistory[
                  allServices[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }else{
              stageHistory = {
                date: allServices[i].stageHistory?.date ? allServices[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          }else{
            stageHistory = {
              date: new Date().getTime(), // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
          console.log('stageHistory', stageHistory);
        } else {
          stageId = this.servicePipelines[1].pipelineStages[0].stageId;
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
          console.log('stageId', stageId);
          console.log('stageHistory', stageHistory);
        }

        // update in DB
        this.serviceInstance
          .updateServicePipelineAndStatus(
            userId,
            allServices[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            updatedServiceCount++;
            console.log(
              'updated',
              updatedServiceCount,
              'of total',
              allServices.length
            );
            if (i === allServices.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
      } else if (allServices[i].selectedServPipeline === 2) {
        console.log('third pipeline');
        // pipelineId to replace
        const pipelineId = this.servicePipelines[2].pipelineId;
        console.log('third pipeline id' + pipelineId);
        // search for stageId with contact status
        var result = this.servicePipelines[2].pipelineStages?.filter((obj) => {
          return obj.name === allServices[i].servicesStage;
        }); //result holds statusObject

        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;

          // statusHistory to replace
          if(allServices[i].stageHistory){
            if(allServices[i].stageHistory.length>0){
              stageHistory = {
                date: allServices[i].stageHistory[
                  allServices[i].stageHistory.length - 1
                ].date ? allServices[i].stageHistory[
                  allServices[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }else{
              stageHistory = {
                date: allServices[i].stageHistory?.date ? allServices[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          }else{
            stageHistory = {
              date: new Date().getTime(), // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
          console.log('stageId', stageId);
          console.log('stageHistory', stageHistory);
        } else {
          stageId = this.servicePipelines[2].pipelineStages[0].stageId;
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
          console.log('stageId', stageId);
          console.log('stageHistory', stageHistory);
        }

        // update in DB
        this.serviceInstance
          .updateServicePipelineAndStatus(
            userId,
            allServices[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            updatedServiceCount++;
            console.log(
              'updated',
              updatedServiceCount,
              'of total',
              allServices.length
            );
            if (i === allServices.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
      } else if (allServices[i].selectedServPipeline === 3) {
        console.log('fourth pipeline');
        // pipelineId to replace
        const pipelineId = this.servicePipelines[3].pipelineId;
        console.log('first pipeline id' + pipelineId);
        // search for stageId with contact status
        var result = this.servicePipelines[3].pipelineStages?.filter((obj) => {
          return obj.name === allServices[i].servicesStage;
        }); //result holds statusObject

        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;

          // statusHistory to replace
          if(allServices[i].stageHistory){
            if(allServices[i].stageHistory.length>0){
              stageHistory = {
                date: allServices[i].stageHistory[
                  allServices[i].stageHistory.length - 1
                ].date ? allServices[i].stageHistory[
                  allServices[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }else{
              stageHistory = {
                date: allServices[i].stageHistory?.date ? allServices[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          }else{
            stageHistory = {
              date: new Date().getTime(), // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
          console.log('stageId', stageId);
          console.log('stageHistory', stageHistory);
        } else {
          stageId = this.servicePipelines[3].pipelineStages[0].stageId;
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
          console.log('stageId', stageId);
          console.log('stageHistory', stageHistory);
        }

        // update in DB
        this.serviceInstance
          .updateServicePipelineAndStatus(
            userId,
            allServices[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            updatedServiceCount++;
            console.log(
              'updated',
              updatedServiceCount,
              'of total',
              allServices.length
            );
            if (i === allServices.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
      } else if (allServices[i].selectedServPipeline === 4) {
        console.log('fifth pipeline id');
        // pipelineId to replace
        const pipelineId = this.servicePipelines[4].pipelineId;
        console.log('fifth pipeline id' + pipelineId);
        // search for stageId with contact status
        var result = this.servicePipelines[4].pipelineStages?.filter((obj) => {
          return obj.name === allServices[i].servicesStage;
        }); //result holds statusObject

        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;

          // statusHistory to replace
          if(allServices[i].stageHistory){
            if(allServices[i].stageHistory.length>0){
              stageHistory = {
                date: allServices[i].stageHistory[
                  allServices[i].stageHistory.length - 1
                ].date ? allServices[i].stageHistory[
                  allServices[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }else{
              stageHistory = {
                date: allServices[i].stageHistory?.date ? allServices[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          }else{
            stageHistory = {
              date: new Date().getTime(), // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
          console.log('stageId', stageId);
          console.log('stageHistory', stageHistory);
        } else {
          stageId = this.servicePipelines[4].pipelineStages[0].stageId;
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
          console.log('stageId', stageId);
          console.log('stageHistory', stageHistory);
        }

        // update in DB
        this.serviceInstance
          .updateServicePipelineAndStatus(
            userId,
            allServices[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            updatedServiceCount++;
            console.log(
              'updated',
              updatedServiceCount,
              'of total',
              allServices.length
            );
            if (i === allServices.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
      } else if (
        allServices[i].selectedServPipeline ===
          this.servicePipelines[0].pipelineId ||
        allServices[i].selectedServPipeline ===
          this.servicePipelines[1].pipelineId ||
        allServices[i].selectedServPipeline ===
          this.servicePipelines[2].pipelineId ||
        allServices[i].selectedServPipeline ===
          this.servicePipelines[3].pipelineId ||
        allServices[i].selectedServPipeline ===
          this.servicePipelines[4].pipelineId
      ) {
        // do nothing
        console.log('if5');
      } else {
        console.log('else');
        updatedServiceCount++;
        console.log('contacts without selectedServPipeline field');
        console.log(
          'customer',
          allServices[i].firstName,
          allServices[i].secondName,
          allServices[i].id
        );
        // pipelineId to replace
        const pipelineId = this.servicePipelines[0].pipelineId;

        // search for stageId with contact status
        var result = this.servicePipelines[0].pipelineStages?.filter((obj) => {
          return obj.name === allServices[i].servicesStage;
        }); //result holds statusObject

        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;

          // statusHistory to replace
          if(allServices[i].stageHistory){
            if(allServices[i].stageHistory.length>0){
              stageHistory = {
                date: allServices[i].stageHistory[
                  allServices[i].stageHistory.length - 1
                ].date ? allServices[i].stageHistory[
                  allServices[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }else{
              stageHistory = {
                date: allServices[i].stageHistory?.date ? allServices[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          }else{
            stageHistory = {
              date: new Date().getTime(), // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
        } else {
          stageId = this.servicePipelines[0].pipelineStages[0].stageId;
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
        }

        // update in DB
        this.serviceInstance
          .updateServicePipelineAndStatus(
            userId,
            allServices[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            updatedServiceCount++;
            console.log(
              'updated',
              updatedServiceCount,
              'of total',
              allServices.length
            );
            if (i === allServices.length - 1) {
              console.log('contact updation completed', userId);
            }
          });
        if (i === allServices.length - 1) {
          console.log('contact updation completed, start updation at subusers');
        }
      }
    }
  }
  getServicePipelines(userId) {
    return new Promise<void>((resolve) => {
      this.serviceInstance
        .getServicePipeline(userId)
        .subscribe((servicePipelines) => {
          console.log(servicePipelines);
          this.servicePipelines = servicePipelines.servicePipelines;
          resolve();
        });
    });
  }
  getSalePipelines(userId) {
    return new Promise<void>((resolve) => {
      this.serviceInstance
        .getSalePipeline(userId)
        .subscribe((salePipelines) => {
          this.salePipelines = salePipelines.salePipelines;
          resolve();
        });
    });
  }
  // sale pipeline updation to run in superUser
  async updateSalePipelineAndStatus(userId) {
    await this.getSalePipelines(userId);
    console.log('salePipelines', this.salePipelines);
    // keep a count of updated records
    let updatedSaleCount = 0;

    // fetch all sales
    let allSales = await this.serviceInstance.getAllSaleForPipeline(
      userId
    );
    console.log('all sales count', allSales.length);

    for (let i = 0; i < allSales.length; i++) {
      // find stageId and PipelineId corresonding to status and selectedSalePipeline fields
      if (allSales[i].selectedSalPipeline === 0) {
        console.log('first pipeline');
        // pipelineId to replace
        const pipelineId = this.salePipelines[0].pipelineId;
        console.log('first pipeline id' + pipelineId);

        // search for stageId with Sale status
        var result = this.salePipelines[0].pipelineStages?.filter((obj) => {
          return obj.name === allSales[i].salesStage;
        }); //result holds statusObject
        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;
          console.log('stageId', stageId);

          // statusHistory to replace
          if (allSales[i].stageHistory) {
            if (allSales[i].stageHistory.length > 0) {
              stageHistory = {
                date: allSales[i].stageHistory[
                  allSales[i].stageHistory.length - 1
                ].date ? allSales[i].stageHistory[
                  allSales[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            } else {
              stageHistory = {
                date: allSales[i].stageHistory?.date ? allSales[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          } else {
            stageHistory = {
              date: new Date().getTime(),  // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }

          console.log('stageHistory', stageHistory);
        } else {
          console.log('no status else');
          stageId = this.salePipelines[0].pipelineStages[0].stageId;
          console.log('stageId', stageId);
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
          console.log('stageHistory', stageHistory);
        }

        // update in DB
        this.serviceInstance
          .updateSalePipelineAndStatus(
            userId,
            allSales[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            updatedSaleCount++;
            console.log(
              'updated',
              updatedSaleCount,
              'of total',
              allSales.length
            );
            if (i === allSales.length - 1) {
              console.log('sale updation completed', userId);
            }
          });
      } else if (allSales[i].selectedSalePipeline === 1) {
        console.log('second pipeline');
        // pipelineId to replace
        const pipelineId = this.salePipelines[1].pipelineId;
        console.log('second pipeline id' + pipelineId);
        // search for stageId with Sale status
        var result = this.salePipelines[1].pipelineStages?.filter((obj) => {
          return obj.name === allSales[i].salesStage;
        }); //result holds statusObject

        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;
          console.log('stageId', stageId);
          // statusHistory to replace
          if (allSales[i].stageHistory) {
            if (allSales[i].stageHistory.length > 0) {
              stageHistory = {
                date: allSales[i].stageHistory[
                  allSales[i].stageHistory.length - 1
                ].date ? allSales[i].stageHistory[
                  allSales[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            } else {
              stageHistory = {
                date: allSales[i].stageHistory?.date ? allSales[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          } else {
            stageHistory = {
              date: new Date().getTime(),  // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
          console.log('stageHistory', stageHistory);
        } else {
          stageId = this.salePipelines[1].pipelineStages[0].stageId;
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
          console.log('stageId', stageId);
          console.log('stageHistory', stageHistory);
        }

        // update in DB
        this.serviceInstance
          .updateSalePipelineAndStatus(
            userId,
            allSales[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            updatedSaleCount++;
            console.log(
              'updated',
              updatedSaleCount,
              'of total',
              allSales.length
            );
            if (i === allSales.length - 1) {
              console.log('sale updation completed', userId);
            }
          });
      } else if (allSales[i].selectedSalePipeline === 2) {
        console.log('third pipeline');
        // pipelineId to replace
        const pipelineId = this.salePipelines[2].pipelineId;
        console.log('third pipeline id' + pipelineId);
        // search for stageId with Sale status
        var result = this.salePipelines[2].pipelineStages?.filter((obj) => {
          return obj.name === allSales[i].salesStage;
        }); //result holds statusObject

        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;

          // statusHistory to replace
          if (allSales[i].stageHistory) {
            if (allSales[i].stageHistory.length > 0) {
              stageHistory = {
                date: allSales[i].stageHistory[
                  allSales[i].stageHistory.length - 1
                ].date ? allSales[i].stageHistory[
                  allSales[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            } else {
              stageHistory = {
                date: allSales[i].stageHistory?.date ? allSales[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          } else {
            stageHistory = {
              date: new Date().getTime(),  // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
          console.log('stageId', stageId);
          console.log('stageHistory', stageHistory);
        } else {
          stageId = this.salePipelines[2].pipelineStages[0].stageId;
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
          console.log('stageId', stageId);
          console.log('stageHistory', stageHistory);
        }

        // update in DB
        this.serviceInstance
          .updateSalePipelineAndStatus(
            userId,
            allSales[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            updatedSaleCount++;
            console.log(
              'updated',
              updatedSaleCount,
              'of total',
              allSales.length
            );
            if (i === allSales.length - 1) {
              console.log('sale updation completed', userId);
            }
          });
      } else if (allSales[i].selectedSalePipeline === 3) {
        console.log('fourth pipeline');
        // pipelineId to replace
        const pipelineId = this.salePipelines[3].pipelineId;
        console.log('fourth pipeline id' + pipelineId);
        // search for stageId with Sale status
        var result = this.salePipelines[3].pipelineStages?.filter((obj) => {
          return obj.name === allSales[i].salesStage;
        }); //result holds statusObject

        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;

          // statusHistory to replace
          if (allSales[i].stageHistory) {
            if (allSales[i].stageHistory.length > 0) {
              stageHistory = {
                date: allSales[i].stageHistory[
                  allSales[i].stageHistory.length - 1
                ].date ? allSales[i].stageHistory[
                  allSales[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            } else {
              stageHistory = {
                date: allSales[i].stageHistory?.date ? allSales[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          } else {
            stageHistory = {
              date: new Date().getTime(),  // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
          console.log('stageId', stageId);
          console.log('stageHistory', stageHistory);
        } else {
          stageId = this.salePipelines[3].pipelineStages[0].stageId;
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
          console.log('stageId', stageId);
          console.log('stageHistory', stageHistory);
        }

        // update in DB
        this.serviceInstance
          .updateSalePipelineAndStatus(
            userId,
            allSales[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            updatedSaleCount++;
            console.log(
              'updated',
              updatedSaleCount,
              'of total',
              allSales.length
            );
            if (i === allSales.length - 1) {
              console.log('Sale updation completed', userId);
            }
          });
      } else if (allSales[i].selectedSalePipeline === 4) {
        console.log('fifth pipeline id');
        // pipelineId to replace
        const pipelineId = this.salePipelines[4].pipelineId;
        console.log('fifth pipeline id' + pipelineId);
        // search for stageId with Sale status
        var result = this.salePipelines[4].pipelineStages?.filter((obj) => {
          return obj.name === allSales[i].salesStage;
        }); //result holds statusObject

        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;

          // statusHistory to replace
          if (allSales[i].stageHistory) {
            if (allSales[i].stageHistory.length > 0) {
              stageHistory = {
                date: allSales[i].stageHistory[
                  allSales[i].stageHistory.length - 1
                ].date ? allSales[i].stageHistory[
                  allSales[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            } else {
              stageHistory = {
                date: allSales[i].stageHistory?.date ? allSales[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          } else {
            stageHistory = {
              date: new Date().getTime(),  // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
          console.log('stageId', stageId);
          console.log('stageHistory', stageHistory);
        } else {
          stageId = this.salePipelines[4].pipelineStages[0].stageId;
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
          console.log('stageId', stageId);
          console.log('stageHistory', stageHistory);
        }

        // update in DB
        this.serviceInstance
          .updateSalePipelineAndStatus(
            userId,
            allSales[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            updatedSaleCount++;
            console.log(
              'updated',
              updatedSaleCount,
              'of total',
              allSales.length
            );
            if (i === allSales.length - 1) {
              console.log('Sale updation completed', userId);
            }
          });
      } else if (
        allSales[i].selectedSalePipeline ===
          this.salePipelines[0].pipelineId ||
        allSales[i].selectedSalePipeline ===
          this.salePipelines[1].pipelineId ||
        allSales[i].selectedSalePipeline ===
          this.salePipelines[2].pipelineId ||
        allSales[i].selectedSalePipeline ===
          this.salePipelines[3].pipelineId ||
        allSales[i].selectedSalePipeline ===
          this.salePipelines[4].pipelineId
      ) {
        // do nothing
        console.log('if5');
        updatedSaleCount++;
      } else {
        console.log('else');
        console.log('Sales without selectedSalePipeline field');
        console.log(
          'customer',
          allSales[i].firstName,
          allSales[i].secondName,
          allSales[i].id
        );
        // pipelineId to replace
        const pipelineId = this.salePipelines[0].pipelineId;

        // search for stageId with Sale status
        var result = this.salePipelines[0].pipelineStages?.filter((obj) => {
          return obj.name === allSales[i].salesStage;
        }); //result holds statusObject

        let stageId = '';
        let stageHistory: StageHistoryModel;
        if (result.length > 0) {
          // stageId to replace
          stageId = result[0]?.stageId;

          // statusHistory to replace
          if (allSales[i].stageHistory) {
            if (allSales[i].stageHistory.length > 0) {
              stageHistory = {
                date: allSales[i].stageHistory[
                  allSales[i].stageHistory.length - 1
                ].date ? allSales[i].stageHistory[
                  allSales[i].stageHistory.length - 1
                ].date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            } else {
              stageHistory = {
                date: allSales[i].stageHistory?.date ? allSales[i].stageHistory?.date : new Date().getTime(), // fetch the last stageHistory
                stageId: stageId,
                pipelineId: pipelineId,
              };
            }
          } else {
            stageHistory = {
              date: new Date().getTime(),  // fetch the last stageHistory
              stageId: stageId,
              pipelineId: pipelineId,
            };
          }
        } else {
          stageId = this.salePipelines[0].pipelineStages[0].stageId;
          stageHistory = {
            date: new Date().getTime(), // fetch the last stageHistory
            stageId: stageId,
            pipelineId: pipelineId,
          };
        }

        // update in DB
        this.serviceInstance
          .updateSalePipelineAndStatus(
            userId,
            allSales[i].id,
            pipelineId,
            stageId,
            stageHistory
          )
          .then((resp) => {
            updatedSaleCount++;
            console.log(
              'updated',
              updatedSaleCount,
              'of total',
              allSales.length
            );
            if (i === allSales.length - 1) {
              console.log('Sale updation completed', userId);
            }
          });
      }
    }
  }
}
