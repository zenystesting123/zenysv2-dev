// const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// import { getApp } from "firebase/app";
// import { getFunctions, useFunctionsEmulator } from "firebase/functions";
// const getAPP=require("firebase/app")
const express = require("express");
const app = express();
const defaultTimeZone = "Asia/Calcutta";
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
admin.firestore().settings({ ignoreUndefinedProperties: true });
var mode = "development"; //Set this as development/ testing/ production
if (mode == "testinglocal") {
  var path = "http://localhost:4200";
  var region = "asia-east2";
  var key_id = "rzp_test_80BuFHmAHC5gaW"; //Rzr test
  var key_secret = "7LL8oqtYxzq1Y3dEwOUxwzCP"; //Rzr Tes
} else if (mode == "development") {
  var path = [
    "https://zenysdevelopment.web.app",
    "https://zenys-ionic-dev.web.app",
    "http://localhost:4200",
    "http://127.0.0.1:4200",
    "http://localhost",
    "https://leadcapturedev.web.app",
  ];
  var region = "asia-east2";
  var key_id = "rzp_test_80BuFHmAHC5gaW"; //Rzr test
  var key_secret = "7LL8oqtYxzq1Y3dEwOUxwzCP"; //Rzr Tes
  // var key_partner_id = "rzp_live_partner_IoNMopBtkRtZoq";
  var key_partner_id = "rzp_test_partner_IoMulrBUucjzzB";
  var key_partner_secret = "heHQTvg4romRYpYlWjgk435R";
  var razorpayWebhookUrl =
    "https://asia-east2-zenysdevelopment.cloudfunctions.net/webhooktest"; // this is for the connected account and is sent to razorpay while creating the connected account and futher used for getting payment info on collection
  var stripe_key =
    // "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"; //stripe secret key
    "sk_test_51KOi86SBDfdu8I5J7zokDFFCGbCWJoLIr2f7ZXTFjP7L3DOGxrlIb3hnLojZy94FKgtlxpxkKsGWz7GevdUBJ4Uo00OzLllsUO";
  var docViewerDomain = "zenysdocviewer.web.app";
} else if (mode == "testing") {
  var path = "https://zenystesting2.web.app";
  region = "asia-south1";
  var key_id = "rzp_test_80BuFHmAHC5gaW"; //Rzr test
  var key_secret = "7LL8oqtYxzq1Y3dEwOUxwzCP"; //Rzr Tes
} else {
  var path = [
    "https://crm.zenys.org",
    "https://app.zenys.org",
    "http://localhost",
    "ionic://localhost",
    "https://zenysproduction.web.app",
    "https://zenysproduction.firebaseapp.com",
    "https://zenysleadcapture.web.app",
    "https://zenysleadcapture.firebaseapp.com",
  ];
  var region = "europe-west3";
  var key_id = "rzp_live_YFN1lkZJp9Ym5G"; //Rzr prodn
  var key_secret = "pwRc0xJCsqrpUOGtEqa5oDlm"; //Rzr prodn
  var key_partner_id = "rzp_live_partner_IoNMopBtkRtZoq";
  var key_partner_secret = "RwQI7bsr6tTC6AWPBxlBQrU6";
  var stripe_key =
    "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"; //stripe secret key
  var razorpayWebhookUrl =
    "https://europe-west3-zenysproduction.cloudfunctions.net/webhooktest";
}

var request = require("request");
// const e = require("express");
const { firestore, appCheck } = require("firebase-admin");
//const { data } = require("jquery");
// const { consoleTestResultHandler } = require("tslint/lib/test");
// const { timeStamp } = require("console");
// const { ref } = require("firebase-functions/lib/providers/database");
const cors = require("cors")({ origin: true });
const cors2 = require("cors");
const { default: axios } = require("axios");
const { time } = require("console");
//const { goTo } = require("pdfkit");
//const { request } = require("http");

app.use(
  cors2({
    origin: "http://localhost:4200",
  })
);

exports.leadCaptureForm = functions
  .region(region)
  .https.onRequest((req, res) => {
    if (path.includes(req.headers.origin)) {
      res.set("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        //response after submitting the form
        const formData = req.body;
        admin
          .firestore()
          .doc("sharedLeadCaptureForms/" + formData.docId)
          .get()
          .then((data) => {

            //leadcapture settings data
            let sharedLeadData = data.data();
            let superUserId = data.data().superUserId;
            //formId that was submitted
            let selectedFormId = formData.formId;

            admin
              .firestore()
              .doc("users/" + superUserId)
              .get()
              .then(async (data) => {
                let superUserdata = data.data();

                if (superUserdata) {
                  let userId = superUserId;
                  let superFirstName = superUserdata.firstname
                    ? superUserdata.firstname
                    : null;
                  let superSecondName = superUserdata.lastname
                    ? superUserdata.lastname
                    : null;
                  let associatedBranch = "None";
                  let statusArray = [];
                  let contactSequentialNumber = 0;
                  var forms = [];
                  let leadCapFields = [];
                  let byProfileCallerIndexes = [];
                  let byProfileCallerIndex = 0;
                  let byUserCallerIndexes = [];
                  let byUserCallerIndex = 0;
                  let assignedToRoles = [];
                  let assignedToRole = 'By User';
                  let assignedToArrays = [];
                  let assignedToArray = [];
                  let profileNames = [];
                  let profileName = '';
                  let lastAssignedChanged = false;

                  var selectedContactPipeline;
                  let stageHistory = []; //to store stage history of customer
                  var assignedTo;
                  var assignedToName;
                  let stageValues = {
                    date: null,
                    stageId: null,
                    pipelineId: null
                  };
                  //get the current contact sequence number
                  if (superUserdata.contactSequentialNumber) {
                    contactSequentialNumber =
                      superUserdata.contactSequentialNumber;
                  }
                  //get form settings data from db
                  if (sharedLeadData.leadCaptureFields) {
                    leadCapFields = sharedLeadData.leadCaptureFields;
                  }

                  //form names from db
                  if (sharedLeadData.leadCaptureFormNames) {
                    forms = sharedLeadData.leadCaptureFormNames;
                  }
                  //byProfileCallerIndex
                  if (sharedLeadData.byProfileCallerIndex) {
                    byProfileCallerIndexes = sharedLeadData.byProfileCallerIndex;
                    byProfileCallerIndex = byProfileCallerIndexes[selectedFormId];
                  }
                  //byUserCallerIndex
                  if (sharedLeadData.byUserCallerIndex) {
                    byUserCallerIndexes = sharedLeadData.byUserCallerIndex;
                    byUserCallerIndex = byUserCallerIndexes[selectedFormId];
                  }
                  //assignedToRole
                  if (sharedLeadData.assignedToRole) {
                    assignedToRoles = sharedLeadData.assignedToRole;
                    assignedToRole = assignedToRoles[selectedFormId];
                  }
                  //assignedToArray
                  if (sharedLeadData.assignedToArray) {
                    assignedToArrays = sharedLeadData.assignedToArray;
                    assignedToArray = assignedToArrays[selectedFormId];
                  }
                  //profileName
                  if (sharedLeadData.profileName) {
                    profileNames = sharedLeadData.profileName;
                    profileName = profileNames[selectedFormId];
                  }

                  if (forms == undefined) {
                    forms = [];
                  }

                  let columns = [];
                  if (leadCapFields !== undefined) {
                    //get the column values for the selected form
                    if (leadCapFields[selectedFormId]) {
                      const fieldObj = leadCapFields[selectedFormId];
                      columns = Object.values(fieldObj);

                    }
                  }


                  columns.forEach((field) => {
                    //get status array
                    if (field.columnDef == "status") {
                      statusArray = field.categories;
                    }
                  });

                  //contact number
                  if (formData.contactNo) {
                    formData.contactNo = formData.contactNo + "";
                  }

                  //for finding selectedContactPipeline
                  selectedContactPipeline = formData.pipeline ? formData.pipeline : null;

                  let datePlaced = new Date().getTime(); //Get TimeStamp
                  let month = new Date().getMonth(); //
                  let createdYear = new Date().getFullYear();

                  //adding new status with new data
                  stageValues.date = datePlaced;
                  stageValues.stageId = formData.status ? formData.status : null;
                  stageValues.pipelineId = selectedContactPipeline;
                  stageHistory.push(stageValues);

                  formData.salePipelineValue = 0; //Set initital value for sales in pipeline
                  formData.saleOngoingValue = 0; //Set initial value for ongoing Sales
                  formData.collectedAmount = 0; // Set inital value for total amount collected from customer
                  formData.invoicedAmount = 0; // set initial value for total amount invoiced to customer
                  formData.ongoingSales = 0; // set initial value for total amount ongoing in sale
                  formData.totalAmountCollected = 0; // set initial value for collected amount
                  //if contact number not available, code is ""
                  if (!formData.contactNo) {
                    var code = "";
                  } else {
                    //default code
                    var code = "+91";
                  }
                  //company name
                  if (formData.companyName) {
                    var isCompany = true;
                    var companyName = formData.companyName;
                  } else {
                    //if company name not available, set it as individual
                    var isCompany = false;
                    var companyName = "Individual";
                  }
                  //find assignedTo from assignedToRole and assignedToArray
                  if (assignedToRole == "By User") {

                    //if subuser not active, store old index to prevent infinite looping
                    let oldIndex = byUserCallerIndex;

                    //If role is by user
                    if (assignedToArray.length > 0) {
                      //call recursive function to find the assigned subuser
                      let assignObj = assignToSubUser(assignedToArray, byUserCallerIndex, superUserId, superUserdata, lastAssignedChanged, oldIndex)
                      //get values from object returned by the function
                      assignedTo = (await assignObj).assignedTo;
                      assignedToName = (await assignObj).assignedToName;
                      associatedBranch = (await assignObj).associatedBranch;
                      byUserCallerIndex = (await assignObj).byUserCallerIndex;
                      lastAssignedChanged = (await assignObj).lastAssignedChanged;
                    }
                  } else {
                    //If role is by profile, find the subusers who are active and has the chosen profile name
                    let callerList = await getCallerList(superUserId, profileName);
                    var index = 0;

                    //If caller index is greater than list length, reset it to 0
                    if(byProfileCallerIndex > callerList.size - 1){
                      byProfileCallerIndex = 0;
                    }
                    let callerIndexs = byProfileCallerIndex
                    if(callerList.size > 0){
                      callerList.forEach((element) => {
                        //assign to subuser with the byProfileCallerIndex
                        if (index == callerIndexs) {
                          assignedTo = element.data().userId;
                          assignedToName = element.data().firstname;
                          associatedBranch = element.data().branchId
                            ? element.data().branchId
                            : "none";
                          //calculate the next byProfileIndex
                          if (byProfileCallerIndex >= callerList.size - 1) {
                            //if exceeds list size, reset to 0
                            byProfileCallerIndex = 0;
                          } else {
                            //if its not end of list, increment by 1
                            if (
                              byProfileCallerIndex ||
                              byProfileCallerIndex == 0
                            ) {
                              byProfileCallerIndex = byProfileCallerIndex + 1;
                            } else {
                              byProfileCallerIndex = 0;
                            }
                          }
                          lastAssignedChanged = true;

                        }
                        index++;
                        return;
                      });
                    }
                    //if assignedTo is not assigned in any case, assign to superuser
                    if(assignedTo == null || assignedTo == undefined || assignedTo == '') {
                      //if callerlist is empty assign to superuser
                      assignedTo = superUserId;
                      assignedToName =
                        (superUserdata.firstname ? superUserdata.firstname : "") +
                        (superUserdata.lastname ? superUserdata.lastname : ""); //assigned to user name
                      associatedBranch = superUserdata.associatedBranch
                        ? superUserdata.associatedBranch
                        : "none";
                      byProfileCallerIndex = 0;
                      lastAssignedChanged = true;
                    }
                  }
                  byProfileCallerIndexes[selectedFormId] = byProfileCallerIndex;
                  byUserCallerIndexes[selectedFormId] = byUserCallerIndex;
                  //get values of additional fields
                  let additionalFields = {};
                  //for each value in columns, check if it is a custom field
                  columns.forEach((field) => {
                    if (field.customField == true) {
                      //fieldname of customfield in the form is its custIndex
                      let fieldName = field.custIndex;
                      if (field.inputType == "date_time") {
                        //if field is a date_time field convert it to timestamp
                        additionalFields[field.custIndex] = {
                          fieldValue: formData[fieldName]
                            ? new Date(Date.parse(formData[fieldName]))
                            : "",
                        };
                      } else if (field.inputType == "date") {
                        //if field is a date field convert it to timestamp
                        additionalFields[field.custIndex] = {
                          fieldValue: formData[fieldName]
                            ? new Date(Date.parse(formData[fieldName]))
                            : "",
                        };
                      } else {
                        //save other field values
                        additionalFields[field.custIndex] = {
                          fieldValue: formData[fieldName],
                        };
                      }
                    }
                  });
                  //construct the searchterm for search functionality
                  let searchTerm = {
                    firstName: "",
                    secondName: "",
                    companyName: "",
                    surname: null,
                  };
                  //saving company name and customers name in lowercase for searching
                  searchTerm.firstName = formData.firstName.toLowerCase();
                  searchTerm.companyName = companyName.toLowerCase();
                  if (formData.secondName) {
                    searchTerm.secondName = formData.secondName.toLowerCase();
                  } else {
                    searchTerm.secondName = null;
                  }
                  //increment the contact sequence no
                  if (contactSequentialNumber) {
                    contactSequenceNumber = contactSequentialNumber + 1;
                  } else {
                    contactSequenceNumber = 1;
                  }
                  //for creating a new customer in db

                  if (formData.status === statusArray[statusArray.length - 1]) {
                    lost = true;
                    won = false;
                    inPipeline = false;
                  } else if (
                    formData.status === statusArray[statusArray.length - 2]
                  ) {
                    lost = false;
                    won = true;
                    inPipeline = false;
                  } else {
                    lost = false;
                    won = false;
                    inPipeline = true;
                  }
                  //add changelog for the customer
                  let changeLog = {};
                  changeLog[0] = {
                    changesFrom: "leadCaptureForm",
                    changedBy: userId,
                    changedByName: superSecondName
                      ? superFirstName + " " + superSecondName
                      : superFirstName,
                    previousValues: "",
                    currentValues: "",
                    dateModified: new Date().getTime(),
                  };
                  //object to save values to db
                  let formDetails = {
                    assignedTo: assignedTo,
                    associatedBranch: associatedBranch ? associatedBranch : "",
                    isCompany: isCompany,
                    orgId: "",
                    companyName: companyName,
                    firstName: formData.firstName ? formData.firstName : "",
                    secondName: formData.secondName ? formData.secondName : "",
                    code: code,
                    contactNo: formData.contactNo ? formData.contactNo : null,
                    email: formData.email ? formData.email : null,
                    selectedContactPipeline: selectedContactPipeline,
                    status: formData.status ? formData.status : null,
                    priority: "Medium",
                    custLeadValue: formData.custLeadValue,
                    billingaddress1: formData.billingaddress1 ? formData.billingaddress1 : null,
                    billingaddress2: formData.billingaddress2 ? formData.billingaddress2 : null,
                    district: formData.district ? formData.district : null,
                    state: formData.state ? formData.state : null,
                    bpin: formData.bpin ? formData.bpin : null,
                    country: formData.country ? formData.country : null,
                    taxId: formData.taxId ? formData.taxId : null,
                    salutation: null,
                    surname: null,
                    department: formData.department,
                    alternateContactNumber: null,
                    altContactCode: "",
                    collectedAmount: 0,
                    invoicedAmount: 0,
                    ongoingSales: 0,
                    saleOngoingValue: 0,
                    salePipelineValue: 0,
                    totalAmountCollected: 0,
                    lastModifiedDate: new Date().getTime(),
                    assignedToDate: new Date().getTime()
                  };

                  admin
                    .firestore()
                    .collection("users/" + superUserId + "/customers")
                    .add({
                      ...formDetails,
                      dateCreated: datePlaced,
                      assignedToName: assignedToName,
                      month: month,
                      createdYear: createdYear,
                      totalAmountCollected: 0,
                      followUpFlag: 0,
                      createdBy: userId,
                      additionalFieldsArr: additionalFields,
                      stageHistory: stageHistory,
                      currentStatusDate: datePlaced,
                      searchTerm: searchTerm,
                      sequenceNumber: contactSequenceNumber,
                      inPipeline,
                      won,
                      lost,
                      changeLog,
                      lastModifiedDate: new Date().getTime(),
                    })
                    .then((res) => {
                      admin
                        .firestore()
                        .doc("users/" + superUserId)
                        .update({
                          contactSequentialNumber: contactSequenceNumber,
                        })
                        .then((result) => {
                          if (assignedToRole == "By User") {
                            if (lastAssignedChanged) {
                              admin
                                .firestore()
                                .doc(
                                  "sharedLeadCaptureForms/" + formData.docId
                                )
                                .update({
                                  byUserCallerIndex: byUserCallerIndexes,
                                })
                                .then((re) => {
                                  re.send({
                                    status: 200,
                                    message: "success",
                                  });
                                });
                            } else {
                              result.send({
                                status: 200,
                                message: "success",
                              });
                            }
                          } else {
                            if (lastAssignedChanged) {
                              admin
                                .firestore()
                                .doc(
                                  "sharedLeadCaptureForms/" + formData.docId
                                )
                                .update({
                                  byProfileCallerIndex: byProfileCallerIndexes,
                                })
                                .then((re) => {
                                  re.send({
                                    status: 200,
                                    message: "success",
                                  });
                                });
                            } else {
                              result.send({
                                status: 200,
                                message: "success",
                              });
                            }
                          }
                        });
                    });
                }
              });
          });
        res.send("done");
      });
    }
  });

  //find assigned to for 'By User' roles
  async function assignToSubUser(assignedToArray, byUserCallerIndex, superUserId, superUserdata, lastAssignedChanged, oldIndex){

    let assignedTo;
    let assignedToName;
    let associatedBranch;
    if(byUserCallerIndex >= assignedToArray.length){
      console.log('byUserCallerIndex not ');
      //if subuser is not active or active, increment caller index
      if (
        byUserCallerIndex >=
        assignedToArray.length - 1
      ) {
        byUserCallerIndex = 0;
        oldIndex =0;
      } else {
        if (
          byUserCallerIndex ||
          byUserCallerIndex == 0
        ) {
          byUserCallerIndex = byUserCallerIndex + 1;
          oldIndex =byUserCallerIndex;
        } else {
          byUserCallerIndex = 0;
          oldIndex =0;
        }
      }

    }
    //current assignedto user
    let assignedToSubUser =
      assignedToArray[byUserCallerIndex];

    //if not superuser, get subuser details
    if (assignedToSubUser !== superUserId) {
      let subUserData = await getSubUserData(
        superUserId,
        assignedToSubUser
      );
      console.log(subUserData.data().status)
      if (subUserData) {
        //check if subuser is active
        if(subUserData.data().status == 'active'){

          //if subuser is active, assign the contact
          assignedTo = subUserData.data().userId;
          assignedToName = subUserData.data().firstname;
          associatedBranch = subUserData.data().branchId
            ? subUserData.data().branchId
            : "none";

          //if subuser is not active or active, increment caller index
          if (
            byUserCallerIndex >=
            assignedToArray.length - 1
          ) {
            byUserCallerIndex = 0;
          } else {
            if (
              byUserCallerIndex ||
              byUserCallerIndex == 0
            ) {
              byUserCallerIndex = byUserCallerIndex + 1;
            } else {
              byUserCallerIndex = 0;
            }
          }
          lastAssignedChanged = true;
        } else {

          //if subuser is not active or active, increment caller index
          if (
            byUserCallerIndex >=
            assignedToArray.length - 1
          ) {
            byUserCallerIndex = 0;
          } else {
            if (
              byUserCallerIndex ||
              byUserCallerIndex == 0
            ) {
              byUserCallerIndex = byUserCallerIndex + 1;
            } else {
              byUserCallerIndex = 0;
            }

          }
          lastAssignedChanged = true;
          //if loops back to old index, assign to superuser
          if(byUserCallerIndex == oldIndex){
            //if assignedto superuser
            assignedTo = superUserId;
            assignedToName =
              (superUserdata.firstname ? superUserdata.firstname : "") +
              (superUserdata.lastname ? superUserdata.lastname : ""); //assigned to user name
            associatedBranch = superUserdata.associatedBranch
              ? superUserdata.associatedBranch
              : "none";
            //find new byUserCallerIndex
            if (
              byUserCallerIndex >=
              assignedToArray.length - 1
            ) {
              byUserCallerIndex = 0;
            } else {
              if (
                byUserCallerIndex ||
                byUserCallerIndex == 0
              ) {
                byUserCallerIndex = byUserCallerIndex + 1;
              } else {
                byUserCallerIndex = 0;
              }
            }
            lastAssignedChanged = true;
          } else {
            //find the next subuser recursively in the list since previous subuser is inactive
            let assignObj = assignToSubUser(assignedToArray, byUserCallerIndex, superUserId, superUserdata, lastAssignedChanged, oldIndex);
            //get values from object returned
            assignedTo = (await assignObj).assignedTo;
            assignedToName = (await assignObj).assignedToName;
            associatedBranch = (await assignObj).associatedBranch;
            byUserCallerIndex = (await assignObj).byUserCallerIndex;
            lastAssignedChanged = (await assignObj).lastAssignedChanged;
          }
        }
      } else {
        //if assignedto superuser
        assignedTo = superUserId;
        assignedToName =
          (superUserdata.firstname ? superUserdata.firstname : "") +
          (superUserdata.lastname ? superUserdata.lastname : ""); //assigned to user name
        associatedBranch = superUserdata.associatedBranch
          ? superUserdata.associatedBranch
          : "none";
        byUserCallerIndex = 0;
        lastAssignedChanged = true;
      }
    } else {
        //if assignedto superuser
        assignedTo = superUserId;
        assignedToName =
          (superUserdata.firstname ? superUserdata.firstname : "") +
          (superUserdata.lastname ? superUserdata.lastname : ""); //assigned to user name
        associatedBranch = superUserdata.associatedBranch
          ? superUserdata.associatedBranch
          : "none";
        //find new byusercallerindex value
        if (
          byUserCallerIndex >=
          assignedToArray.length - 1
        ) {
          byUserCallerIndex = 0;
        } else {
          if (
            byUserCallerIndex ||
            byUserCallerIndex == 0
          ) {
            byUserCallerIndex = byUserCallerIndex + 1;
          } else {
            byUserCallerIndex = 0;
          }
        }
        lastAssignedChanged = true;
    }
    //return assignedto details
    return {'assignedTo' : assignedTo, 'assignedToName' : assignedToName, 'associatedBranch': associatedBranch, 'byUserCallerIndex' : byUserCallerIndex,  'lastAssignedChanged' : lastAssignedChanged };
  }
  //find assigned to for 'By User' roles ivr
  async function assignToSubUserIvr(assignedToArray, byUserCallerIndex, superUserId, superUserdata, lastAssignedChanged, oldIndex){

    let assignedTo;
    let assignedToName;
    let associatedBranch;
    let subUserDetails;
    let subUserData;
    let assignedToList=assignedToArray;
    let assignedToSubUser
    //current assignedto user
    console.log('byUserCallerIndex logs');
    if(byUserCallerIndex >= assignedToArray.length){
      console.log('byUserCallerIndex not ');
      //if subuser is not active or active, increment caller index
      if (
        byUserCallerIndex >=
        assignedToArray.length - 1
      ) {
        byUserCallerIndex = 0;
        oldIndex = 0;
      } else {
        if (
          byUserCallerIndex ||
          byUserCallerIndex == 0
        ) {
          byUserCallerIndex = byUserCallerIndex + 1;
          oldIndex = byUserCallerIndex;
        } else {
          byUserCallerIndex = 0;
          oldIndex = 0;
        }
      }

    }
    assignedToSubUser =
      assignedToArray[byUserCallerIndex];
    //if not superuser, get subuser details
    if (assignedToSubUser !== superUserId) {
      let subUsersLst = await getSubUserDetailsWithOutNumber(
        superUserId,
        assignedToSubUser
      );
      subUsersLst.forEach((element) => {
        subUserData = element;
      })
      if (subUserData) {
        //check if subuser is active
        if(subUserData.data().status == 'active'){
          //if subuser is active, assign the contact
          subUserDetails = subUserData;
          assignedTo = subUserData.data().userId;
          assignedToName = subUserData.data().firstname;
          associatedBranch = subUserData.data().branchId
            ? subUserData.data().branchId
            : "none";

          //if subuser is not active or active, increment caller index
          if (
            byUserCallerIndex >=
            assignedToArray.length - 1
          ) {
            byUserCallerIndex = 0;
          } else {
            if (
              byUserCallerIndex ||
              byUserCallerIndex == 0
            ) {
              byUserCallerIndex = byUserCallerIndex + 1;
            } else {
              byUserCallerIndex = 0;
            }
          }
          lastAssignedChanged = true;
        } else {

          //if subuser is not active or active, increment caller index
          if (
            byUserCallerIndex >=
            assignedToArray.length - 1
          ) {
            byUserCallerIndex = 0;
          } else {
            if (
              byUserCallerIndex ||
              byUserCallerIndex == 0
            ) {
              byUserCallerIndex = byUserCallerIndex + 1;
            } else {
              byUserCallerIndex = 0;
            }

          }
          lastAssignedChanged = true;
          //if loops back to old index, assign to superuser
          if(byUserCallerIndex == oldIndex){
            //if assignedto superuser
            subUserDetails = superUserdata;
            assignedTo = superUserId;
            assignedToName =
              (superUserdata.data().firstname ? superUserdata.data().firstname : "") +
              (superUserdata.data().lastname ? superUserdata.data().lastname : ""); //assigned to user name
            associatedBranch = superUserdata.data().associatedBranch
              ? superUserdata.data().associatedBranch
              : "none";
            //find new byUserCallerIndex
            if (
              byUserCallerIndex >=
              assignedToArray.length - 1
            ) {
              byUserCallerIndex = 0;
            } else {
              if (
                byUserCallerIndex ||
                byUserCallerIndex == 0
              ) {
                byUserCallerIndex = byUserCallerIndex + 1;
              } else {
                byUserCallerIndex = 0;
              }
            }
            lastAssignedChanged = true;
          } else {
            //find the next subuser recursively in the list since previous subuser is inactive
            let assignObj =await assignToSubUserIvr(assignedToList, byUserCallerIndex, superUserId, superUserdata, lastAssignedChanged, oldIndex);
             //get values from object returned
             assignedTo = (await assignObj).assignedTo;
             assignedToName = (await assignObj).assignedToName;
             associatedBranch = (await assignObj).associatedBranch;
             byUserCallerIndex = (await assignObj).byUserCallerIndex;
             lastAssignedChanged = (await assignObj).lastAssignedChanged;
             subUserDetails =(await assignObj).subUserDetails;
          }
        }
      } else {
        //if assignedto superuser
        subUserDetails = superUserdata;
        assignedTo = superUserId;
        assignedToName =
          (superUserdata.data().firstname ? superUserdata.data().firstname : "") +
          (superUserdata.data().lastname ? superUserdata.data().lastname : ""); //assigned to user name
        associatedBranch = superUserdata.data().associatedBranch
          ? superUserdata.data().associatedBranch
          : "none";
        byUserCallerIndex = 0;
        lastAssignedChanged = true;
      }
    } else {
        //if assignedto superuser
        subUserDetails = superUserdata;
        assignedTo = superUserId;
        assignedToName =
          (superUserdata.data().firstname ? superUserdata.data().firstname : "") +
          (superUserdata.data().lastname ? superUserdata.data().lastname : ""); //assigned to user name
        associatedBranch = superUserdata.data().associatedBranch
          ? superUserdata.data().associatedBranch
          : "none";
        //find new byusercallerindex value
        if (
          byUserCallerIndex >=
          assignedToArray.length - 1
        ) {
          byUserCallerIndex = 0;
        } else {
          if (
            byUserCallerIndex ||
            byUserCallerIndex == 0
          ) {
            byUserCallerIndex = byUserCallerIndex + 1;
          } else {
            byUserCallerIndex = 0;
          }
        }
        lastAssignedChanged = true;
    }
    //return assignedto details
    return {'assignedTo' : assignedTo, 'assignedToName' : assignedToName,
     'associatedBranch': associatedBranch, 'byUserCallerIndex' : byUserCallerIndex,
       'lastAssignedChanged' : lastAssignedChanged,
       'subUserDetails' : subUserDetails };
  }

exports.functionTester = functions
  .region(region)
  // .timeZone(defaultTimeZone)
  .https.onRequest((req, res) => {
    if (path.includes(req.headers.origin)) {
      res.set("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        var today = new Date();
        let todayInv = dateWithDefaultTimeZone(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate(),
          0,
          0,
          0,
          0
        );
        let lastDayInv = dateWithDefaultTimeZone(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate(),
          23,
          59,
          59,
          999
        );
        console.log(todayInv.toString());
        console.log(lastDayInv.toString());

        return admin
          .firestore()
          .collection("users")
          .get()
          .then((users) => {
            const AllUsers = users;
            AllUsers.forEach((ele) => {
              // console.log(ele.id);
              return admin
                .firestore()
                .collectionGroup("tasks")
                .where("assignedTo", "==", ele.id)
                .where("status", "==", "OPEN")
                .where("dueDate", ">=", "todayInv")
                .where("dueDate", "<=", "lastDayInv")
                .get()
                .then((allTasksofId) => {
                  return admin
                    .firestore()
                    .collectionGroup("Follow Ups")
                    .where("assignedTo", "==", ele.id)
                    .where("completedStatus", "==", true)
                    .where("callStartDate", ">=", "todayInv")
                    .where("callStartDate", "<=", "lastDayInv")
                    .get()
                    .then((followUpsofId) => {
                      if (allTasksofId.size > 0 || followUpsofId > 0)
                        console.log(
                          "ID: " +
                            ele.id +
                            " no. of Tasks=" +
                            allTasksofId.size +
                            " no. of Follow ups=" +
                            followUpsofId.size
                        );
                    });
                });
            });
            console.log(AllUsers.size);
            res.send("done");
          });
      });
    }
  });

exports.createOrder = functions.region(region).https.onRequest((req, res) => {
  if (path.includes(req.headers.origin)) {
    res.set("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    );
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    return cors(req, res, () => {
      const Razorpay = require("razorpay");
      var instance = new Razorpay({
        key_id: key_id,
        key_secret: key_secret,
      });
      var options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: req.body.receipt,
      };
      instance.orders.create(options, (err, order) => {
        order ? res.status(200).send(order) : res.status(500).send(err);
      });
    });
  }
});

exports.capturePayments = functions
  .region(region)
  .https.onRequest((req, res) => {
    if (path.includes(req.headers.origin)) {
      res.set("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        request(
          {
            method: "POST",
            url: `https://${key_id}:${key_secret}@api.razorpay.com/v1/payments/${req.body.payment_id}/capture`,
            form: {
              amount: req.body.amount,
            },
          },
          (error, response, body) => {
            response
              ? res.status(200).send({
                  res: response,
                  req: req.body,
                  body: body,
                })
              : res.status(500).send(error);
          }
        );
      });
    }
  });

exports.subscriptions = functions.region(region).https.onRequest((req, res) => {
  if (path.includes(req.headers.origin)) {
    res.set("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    );
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    return cors(req, res, () => {
      const Razorpay = require("razorpay");
      var instance = new Razorpay({
        key_id: key_id,
        key_secret: key_secret,
      });
      console.log(req.body);
      // creates plans
      // var options = {
      //   period: req.body.period,
      //   interval: req.body.interval,
      //   item: {
      //     name: req.body.name,
      //     amount: req.body.amount,
      //     currency: "INR",
      //     description: req.body.description,
      //   },
      //   notes: req.body.notes, //key value pair
      // };
      // instance.plans.create(options, (err, resp1) => {
      //   if (err) {
      //     res.send(err);
      //   }
      //   if (resp1) {
      var option2 = {
        plan_id: req.body.plan_id,
        total_count: req.body.count,
        quantity: req.body.quantity,
        // customer_notify: 1,
        start_at: req.body.start_at,
        // expire_by: 1580626111,
        // addons: [
        //   {
        //     item: {
        //       name: "Delivery charges",
        //       amount: 30000,
        //       currency: "INR",
        //     },
        //   },
        // ],
        // offer_id: "offer_JHD834hjbxzhd38d",
        // notes: {
        //   notes_key_1: "Tea, Earl Grey, Hot",
        //   notes_key_2: "Tea, Earl Grey… decaf.",
        // },
      };
      instance.subscriptions.create(option2, (err, resp) => {
        if (err) {
          res.send(err);
        }
        if (resp) {
          res.status(200).send({
            sub: resp,
            // plan:resp1
          });
        }
      });
    });
    // });
    // });
  }
});
exports.subscriptionsUpdate = functions
  .region(region)
  .https.onRequest((req, res) => {
    if (path.includes(req.headers.origin)) {
      res.set("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        const axios = require("axios").default;
        console.log(req.body);
        console.log(req.body.subscription_id);
        var data = JSON.stringify({
          plan_id: req.body.plan_id,
          quantity: req.body.quantity,
          // "remaining_count":5,
          // "start_at":Math.round(Date.now()/1000),
          schedule_change_at: "now",
          customer_notify: 1,
        });
        var credentials = Buffer.from(
          `${key_id}:${key_secret}`,
          "binary"
        ).toString("base64");
        var config = {
          method: "patch",
          url: `https://api.razorpay.com/v1/subscriptions/${req.body.subscription_id}`,
          headers: {
            Authorization: "Basic " + credentials,
            "Content-Type": "application/json",
          },
          data: data,
        };
        console.log(config);

        // var url = `https://${key_id}:${key_secret}@api.razorpay.com/v1/subscriptions/${req.body.subscription_id}/`;
        axios(config)
          .then(function (response) {
            console.log(response.data);
            res.send(response.data);
          })
          .catch(function (error) {
            console.log(error);
            res.send(error);
          });
      });
      // });
      // });
    }
  });
exports.cancelsubscriptions = functions
  .region(region)
  .https.onRequest((req, res) => {
    if (path.includes(req.headers.origin)) {
      res.set("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        const axios = require("axios").default;
        console.log(req.body);
        // var amount = Number(req.body.amount);
        var url = `https://${key_id}:${key_secret}@api.razorpay.com/v1/subscriptions/${req.body.subscription_id}/cancel`;
        axios
          .post(url, {
            cancel_at_cycle_end: 1,
          })
          .then(function (response) {
            console.log(response.data);
            res.send(response.data);
          })
          .catch(function (error) {
            console.log(error);
            res.send(error);
          });
      });
      // });
      // });
    }
  });

exports.getpayment = functions.region(region).https.onRequest((req, res) => {
  if (path.includes(req.headers.origin)) {
    res.set("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    );
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    return cors(req, res, () => {
      const Razorpay = require("razorpay");
      var instance = new Razorpay({
        key_id: key_id,
        key_secret: key_secret,
      });
      //console.log(req.body.payment_id);
      instance.payments.fetch(req.body.payment_id, (error, resp) => {
        if (error) {
          res.send(error);
        }
        if (resp) {
          res.status(200).send(resp);
        }
      });
    });
  }
});

exports.getplansubs = functions.region(region).https.onRequest((req, res) => {
  if (path.includes(req.headers.origin)) {
    res.set("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    );
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    return cors(req, res, () => {
      const Razorpay = require("razorpay");
      var instance = new Razorpay({
        key_id: key_id,
        key_secret: key_secret,
      });
      //console.log(req.body.subscriptions_id);
      instance.subscriptions.fetch(req.body.subscriptions_id, (error, resp) => {
        if (error) {
          res.send(error);
        }
        if (resp) {
          // res.status(200).send(resp)
          //console.log(resp);
          instance.plans.fetch(resp.plan_id, (error1, resp1) => {
            if (error1) {
              res.send(error1);
            }
            if (resp1) {
              // console.log(resp);
              res.status(200).send({ sub: resp, plan: resp1 });
            }
          });
        }
      });
    });
  }
});

exports.getsubscription = functions
  .region(region)
  .https.onRequest((req, res) => {
    if (path.includes(req.headers.origin)) {
      res.set("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        const Razorpay = require("razorpay");
        var instance = new Razorpay({
          key_id: key_id,
          key_secret: key_secret,
        });
        //console.log(req.body.subscriptions_id);
        instance.subscriptions.fetch(
          req.body.subscription_id,
          (error, resp) => {
            if (error) {
              res.send(error);
            }
            if (resp) {
              // console.log(resp)
              res.status(200).send(resp);
            }
          }
        );
      });
    }
  });

exports.getallinvoice = functions.region(region).https.onRequest((req, res) => {
  if (path.includes(req.headers.origin)) {
    res.set("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    );
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    return cors(req, res, () => {
      const Razorpay = require("razorpay");
      var instance = new Razorpay({
        key_id: key_id,
        key_secret: key_secret,
      });
      // console.log(req.body.subscriptions_id);

      instance.invoices.all(req.body.subscription_id, (error, resp) => {
        if (error) {
          res.send(error);
        }
        if (resp) {
          res.status(200).send(resp);
        }
      });
    });
  }
});

exports.getInvoicebyid = functions
  .region(region)
  .https.onRequest((req, res) => {
    if (path.includes(req.headers.origin)) {
      res.set("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        const Razorpay = require("razorpay");
        var instance = new Razorpay({
          key_id: key_id,
          key_secret: key_secret,
        });
        //console.log(req.body);
        instance.invoices.fetch(req.body.invoice_id, (err, invoice) => {
          invoice ? res.status(200).send(invoice) : res.status(500).send(err);
        });
      });
    }
  });

exports.getsubscriptioninv = functions
  .region(region)
  .https.onRequest((req, res) => {
    if (path.includes(req.headers.origin)) {
      res.set("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        console.log(req.body);
        request(
          {
            method: "GET",
            url:
              `https://${key_id}:${key_secret}@api.razorpay.com/v1/invoices?subscription_id=` +
              req.body.subscription_id,
          },
          (error, response, body) => {
            console.log(body);
            if (body) {
              res.status(200).send(body);
            }
            if (error) {
              res.status(500).send(error);
            }
          }
        );
      });
    }
  });

exports.axiostest = functions.region(region).https.onRequest((req, res) => {
  if (path.includes(req.headers.origin)) {
    res.set("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    );
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    return cors(req, res, () => {
      const axios = require("axios").default;
      console.log(req.body);
      var amount = Number(req.body.amount);
      var url = `https://${key_id}:${key_secret}@api.razorpay.com/v1/payment_links/`;
      axios
        .post(url, {
          amount: amount,
          currency: req.body.currency,
          customer: {
            name: req.body.name,
            contact: req.body.contact,
            email: req.body.email,
          },
          notify: {
            email: true,
            sms: true,
          },
          options: {
            order: {
              transfers: [
                {
                  account: req.body.account_id,
                  amount: amount * (1 - 0.0266),
                  // currency: "INR",
                  currency: req.body.currency,
                },
              ],
            },
          },
        })
        .then(function (response) {
          //console.log(response.data);
          res.send(response.data);
        })
        .catch(function (error) {
          //console.log(error);
          res.send(error);
        });
    });
  }
});

exports.webhooktest = functions.region(region).https.onRequest((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    );
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    return cors(req, res, () => {
      console.log(req.body);
      if (req.body.payload.payment_link.entity) {
        var signature = req.headers["x-razorpay-signature"];
        var secret = "123456";
        //console.log(signature);
        // razorpay.validateWebhookSignature()
        // console.log(
        //   Razorpay.validateWebhookSignature(req.body, signature, secret)
        // );

        // admin.firestore().doc("paymentTest/2").set({tester:"testok"})
        admin
          .firestore()
          .doc("paymentLinks/" + req.body.payload.payment_link.entity.id)
          .get()
          .then((data2) => {
            if (!data2.data().paidFlag) {
              admin
                .firestore()
                .doc("paymentLinks/" + req.body.payload.payment_link.entity.id)
                .update({
                  ...req.body.payload.payment_link.entity,
                  paidFlag: true,
                })
                .then(() => {
                  console.log("payment link collection modified");
                  admin
                    .firestore()
                    .doc(
                      "paymentLinks/" + req.body.payload.payment_link.entity.id
                    )
                    .get()
                    .then((paymentLinkData) => {
                      //console.log(data1.data());
                      admin
                        .firestore()
                        .doc(
                          "users/" +
                            paymentLinkData.data().superUserId +
                            "/" +
                            (!!paymentLinkData.data().type
                              ? paymentLinkData.data().type
                              : "Invoice") +
                            "s/" +
                            (!!paymentLinkData.data().type
                              ? paymentLinkData.data().docNo
                              : paymentLinkData.data().invoiceNo)
                        )
                        .update({
                          paymentLink: req.body.payload.payment_link.entity,
                        })
                        .then(() => {
                          console.log(
                            "updated payment Link in invoice object paymentLink"
                          );
                        })
                        .catch((e) => {
                          res.status(400).send(e);
                        });
                      const collectionData = {
                        amountCollected:
                          paymentLinkData.data().amount_paid / 100,
                        createDate: Date.now(),
                        createdById: paymentLinkData.data().userId,
                        customerCompany: paymentLinkData.data().companyName,
                        customerId: paymentLinkData.data().customerId,
                        customerName: paymentLinkData.data().customerName,
                        // invoiceno: (!!paymentLinkData.data().type)?paymentLinkData.data().docNo:paymentLinkData.data().invoiceNo,
                        paymentDate: new Date(),
                        saleTitle: paymentLinkData.data().saleTitle,
                        saleid: paymentLinkData.data().saleId,
                        customerSecondName:
                          paymentLinkData.data().customerSecondName,
                        currency: paymentLinkData.data().currency,
                        // paymentType: "Against Invoice",
                        paymentMode: "Online through Zenys App",
                      };
                      if (paymentLinkData.data().invoiceprefixAndDocNumber) {
                        collectionData.invoiceprefixAndDocNumber =
                          paymentLinkData.data().invoiceprefixAndDocNumber;
                      }
                      if (
                        !paymentLinkData.data().type ||
                        paymentLinkData.data().type == "Invoice"
                      ) {
                        collectionData.invoiceprefixAndDocNumber =
                          paymentLinkData.data().docprefixAndDocNumber
                            ? paymentLinkData.data().docprefixAndDocNumber
                            : paymentLinkData.data().invoiceprefixAndDocNumber
                            ? paymentLinkData.data().invoiceprefixAndDocNumber
                            : "";
                        collectionData.paymentType = "Against Invoice";
                        collectionData.invoiceno = !!paymentLinkData.data().type
                          ? paymentLinkData.data().docNo
                          : paymentLinkData.data().invoiceNo;
                      } else collectionData.paymentType = "Advance payment";
                      admin
                        .firestore()
                        .collection(
                          "users/" +
                            paymentLinkData.data().superUserId +
                            "/paymentsreceived/"
                        )
                        .add(collectionData)
                        .then(() => {
                          console.log("added payment in payment recieved");
                          res.send({}).status(200);
                        })
                        .catch((e) => {
                          res.status(400).send(e);
                        });
                    })
                    .catch((e) => {
                      res.status(400).send(e);
                    });
                })
                .catch((e) => {
                  res.status(400).send(e);
                });
            } else {
              console.log("already written");
              res.status(200).send({});
            }
          })
          .catch((e) => {
            res.status(400).send(e);
          });
      }
    });
  }
});

exports.collectionOperation = functions
  .region(region)
  .https.onRequest((req, res) => {
    if (path.includes(req.headers.origin)) {
      res.set("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        //console.log(req.body);

        if (req.body.saleid) {
          var totalSaleAmount = 0;
          var totalinvoiceamount = 0;
          var totalcustomeramount = 0;
          var sale;
          var customer;
          var invoice;
          admin
            .firestore()
            .collection("users/" + req.body.superUserId + "/paymentsreceived")
            .where("saleid", "==", req.body.saleid)
            .get()
            .then((data) => {
              sale = data;
              sale.forEach((ele) => {
                totalSaleAmount = totalSaleAmount + ele.data().amountCollected;
              });
              admin
                .firestore()
                .doc(
                  "users/" + req.body.superUserId + "/sales/" + req.body.saleid
                )
                .update({ collectedAmount: totalSaleAmount })
                .then(() => {
                  admin
                    .firestore()
                    .collection(
                      "users/" + req.body.superUserId + "/paymentsreceived"
                    )
                    .where("customerId", "==", req.body.customerId)
                    .get()
                    .then((data) => {
                      customer = data;
                      customer.forEach((ele) => {
                        totalcustomeramount =
                          totalcustomeramount + ele.data().amountCollected;
                      });
                      admin
                        .firestore()
                        .doc(
                          "users/" +
                            req.body.superUserId +
                            "/customers/" +
                            req.body.customerId
                        )
                        .update({ totalAmountCollected: totalcustomeramount })
                        .then(() => {
                          if (req.body.invoiceno != "N/A") {
                            admin
                              .firestore()
                              .collection(
                                "users/" +
                                  req.body.superUserId +
                                  "/paymentsreceived"
                              )
                              .where("invoiceno", "==", req.body.invoiceno)
                              .get()
                              .then((data) => {
                                invoice = data;
                                invoice.forEach((ele) => {
                                  totalinvoiceamount =
                                    totalinvoiceamount +
                                    ele.data().amountCollected;
                                });
                                admin
                                  .firestore()
                                  .doc(
                                    "users/" +
                                      req.body.superUserId +
                                      "/Invoices/" +
                                      req.body.invoiceno
                                  )
                                  .update({
                                    collectedAmount: totalinvoiceamount,
                                  })
                                  .then(() => {
                                    res.status(200).send({ completed: true });
                                  })
                                  .catch((err) => {
                                    res.status(400).send({ completed: false });
                                  });
                              })
                              .catch((e) => {
                                res.status(400).send({ completed: false });
                              });
                          } else res.status(200).send({ completed: true });
                        })
                        .catch((e) => {
                          res.status(400).send({ completed: false });
                        });
                    });
                })
                .catch((e) => {
                  res.status(400).send({ completed: false });
                });
            });
        }
      });
    }
  });

// might need in future

// exports.transfertoAcc = functions
// .region(region)
// .https.onRequest((req, res) => {
//   res.set("Access-Control-Allow-Origin", path);
//   res.set("Access-Control-Allow-Credentials", "true");
//   if (req.method === "OPTIONS") {

//     res.set("Access-Control-Allow-Methods", "POST");
//     res.set(
//       "Content-Type",
//       "application/x-www-form-urlencoded; charset=UTF-8"
//     );
//     res.set(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
//     );
//     res.set("Access-Control-Max-Age", "3600");
//     res.status(204).send("");
//   } else {
//     return cors(req, res, () => {
//       console.log(req.body)
//       options={
//         transfers: [
//           {
//             account: req.body.account_id,
//             amount: req.body.amount,
//             currency: "INR",
//           }]
//       }

//       instance.payments.transfer(req.body.payment_id, options,(err, transfer) => {
//         transfer ? res.status(200).send(transfer) : res.status(500).send(err);
//       });
//     });
//   }
// });

// exports.createPaymentlink = functions
// .region(region)
// .https.onRequest((req, res) => {
//   res.set("Access-Control-Allow-Origin", path);
//   res.set("Access-Control-Allow-Credentials", "true");
//   if (req.method === "OPTIONS") {

//     res.set("Access-Control-Allow-Methods", "POST");
//     res.set(
//       "Content-Type",
//       "application/x-www-form-urlencoded; charset=UTF-8"
//     );
//     res.set(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
//     );
//     res.set("Access-Control-Max-Age", "3600");
//     res.status(204).send("");
//   } else {
//     return cors(req, res, () => {
//       console.log(req.body)
//       var options = {
//         type:"link",
//         amount: req.body.amount,
//         currency: "INR",
//         description:req.body.description,
//         customer: {
//           contact: req.body.contact,
//           email: req.body.email,
//           name: req.body.name
//         }
//     }
//       console.log(options)
//       instance.invoices.create(options, (err, order) => {
//         order ? res.status(200).send(order) : res.status(500).send(err);
//       });
//     });
//   }
// });
exports.mailer = functions.region(region).https.onRequest((req, res) => {
  if (path.includes(req.headers.origin)) {
    res.set("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    );
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    return cors(req, res, () => {
      const MailComposer = require("nodemailer/lib/mail-composer");
      //console.log(req.body)
      var Mail = new MailComposer(req.body);

      var message = Mail.compile().build((err, message) => {
        //console.log(message.toString())
        res.send(message.toString());
      });
      // var chunks=[]
      // stream.on("data", function (chunk) {
      //   chunks.push(chunk);
      // });

      // // Send the buffer or you can put it into a var
      // stream.on("end", function () {
      //   // console.log(Buffer.concat(chunks))
      // });
    });
  }
});

// exports.mailparseincoming = functions.region(region).https.onRequest((req, res) => {
//   res.set("Access-Control-Allow-Origin", path);
//   res.set("Access-Control-Allow-Credentials", "true");
//   if (req.method === "OPTIONS") {
//     // Send response to OPTIONS requests
//     res.set("Access-Control-Allow-Methods", "POST");
//     res.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
//     res.set(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
//     );
//     res.set("Access-Control-Max-Age", "3600");
//     res.status(204).send("");
//   } else {
//     return cors(req, res, () => {
//       console.log(req.body.messages)
//       var messages=req.body.messages
//       const simpleParser = require('mailparser').simpleParser;
//       var parsedmessages=[]
//       for(let i=0;i<messages.length;i++)
//       {
//         console.log(messages[i].payload.parts[0])
//       simpleParser(messages[i].payload.parts[0], (err, parsed) => {
//         console.log(parsed)
//         parsedmessages.push(parsed)
//         if(err){
//           res.status(400).send("cannot parse message")
//         }
//       });
//       }
//       res.status(200).send(parsedmessages)

//       // var chunks=[]
//       // stream.on("data", function (chunk) {
//       //   chunks.push(chunk);
//       // });

//       // // Send the buffer or you can put it into a var
//       // stream.on("end", function () {
//       //   // console.log(Buffer.concat(chunks))
//       // });

//     });
//   }
// });

exports.nodemailer = functions.region(region).https.onRequest((req, res) => {
  if (path.includes(req.headers.origin)) {
    res.set("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    );
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    return cors(req, res, () => {
      const nodemailer = require("nodemailer");
      const MailComposer = require("nodemailer/lib/mail-composer");
      console.log(req.body);
      var Mail = new MailComposer(req.body);
      let poolconfig = req.body.from;
      let transporter = nodemailer.createTransport(
        // host: "smtp.gmail.com",
        // port: 465,
        // secure: true, // true for 465, false for other ports
        // auth: {
        //   user: "akhiltomabraham93@gmail.com", // generated ethereal user
        //   pass: "znficlsxqmkqztee", // generated ethereal password
        // },
        poolconfig
      );
      transporter.sendMail(
        {
          // sender:req.body.from,
          from: req.body.to,
          to: req.body.to,
          html: req.body.html,
          subject: req.body.subject,
          attachments: req.body.attachments ? req.body.attachments : [],
          envelope: {
            from: req.body.to, // used as MAIL FROM: address for SMTP
            to: req.body.to, // used as RCPT TO: address for SMTP
            //console.log(req.body.messages)
          },
        },
        (err, info) => {
          if (err) console.log(err);
          res.send(err);
          if (info) {
            console.log(info);
            res.send(info);
          }
        }
      );

      // var message=Mail.compile().build((err,message)=>{
      // console.log(message.toString())
      // res.send(message.toString());

      // })
      // var chunks=[]
      // stream.on("data", function (chunk) {
      //   chunks.push(chunk);
      // });

      // // Send the buffer or you can put it into a var
      // stream.on("end", function () {
      //   // console.log(Buffer.concat(chunks))
      // });
    });
  }
});
//check if inquiry added
// exports.InquiryAdded= functions.firestore
// .document("/users/{userUid}/Inquiries/{documentId}")
// .onCreate((snap,context)=>{
//   createdDocument=snap.data()
//automation code

// })

// send push notification when Inquiries are added

exports.InquiryNotification = functions.firestore
  .document("/users/{userUid}/Inquiries/{documentId}")
  .onCreate((snap, context) => {
    createdDocument = snap.data();
    // console.log(createdDocument)
    // console.log(context.params.userUid)
    // console.log(context.params.documentId)
    return admin
      .firestore()
      .collection("Devices")
      .where("userUid", "==", context.params.userUid)
      .get()
      .then((data) => {
        var Devices = data;
        //  console.log(Devices)

        const payload = {
          notification: {
            title: "You have an inquiry",
            body: "Tap here to check it out!",
          },
        };

        Devices.forEach((ele) => {
          //  console.log(ele.data());
          admin
            .messaging()
            .sendToDevice(ele.data().token, payload)
            .then(() => {
              console.log("done one");
            })
            .catch((e) => {
              console.log(e);
            });
          //  console.log(ele.data().saleTitle);
          // totalSaleAmount =
          //   totalSaleAmount + ele.data().amountCollected;
        });
      })
      .catch((e) => {
        console.log(e);
      });
  });

//updating task count while completing a task
// exports.TaskNotificationsUpdate = functions
//   .region(region)
//   .firestore.document("/users/{userId}/tasks/{documentId}")
//   .onUpdate((change, context) => {
//     var taskDataAfter = change.after.data();
//     var taskDataBefore = change.before.data();
//     var userId = context.params.userId;
//     if (taskDataAfter.status != taskDataBefore.status) {
//       let prevDate = taskDataBefore.dueDate;
//       let newDated = taskDataAfter.dueDate;
//       let oldId = taskDataBefore.assignedTo;
//       let newId = taskDataAfter.assignedTo;
//       let oldDate = prevDate._seconds
//       let newDate = newDated._seconds
//       var day = 60 * 60 * 24 * 1000;
//       var endDate = new Date(oldDate * 1000);
//       var endDateNew = new Date(newDate * 1000);
//       var dateObj = new Date(endDate.getTime() + day);
//       var dateObjNew = new Date(endDateNew.getTime() + day);
//       var month = dateObj.getUTCMonth() + 1;
//       var monthNew = dateObjNew.getUTCMonth() + 1;
//       var day = dateObj.getUTCDate();
//       var dayNew = dateObjNew.getUTCDate();
//       var year = dateObj.getUTCFullYear();
//       var yearNew = dateObjNew.getUTCFullYear();
//       if (month.toString().length == 1) {
//         month = "0" + month;
//       }
//       if (day.toString().length == 1) {
//         day = "0" + day;
//       }
//       if (monthNew.toString().length == 1) {
//         monthNew = "0" + monthNew;
//       }
//       if (dayNew.toString().length == 1) {
//         dayNew = "0" + dayNew;
//       }
//       var previousDate = day + "-" + month + "-" + year;
//       var newDates = dayNew + "-" + monthNew + "-" + yearNew;
//       if (taskDataAfter.status == 'OPEN') {
//         updateTaskCount(userId, newDates, newId, "add")
//       }
//       else {
//         updateTaskCount(userId, previousDate, oldId, "reduce")
//       }
//     }
//   })

//updating task count while completing a task
// exports.FollowupNotificationsUpdate = functions
//   .region(region)
//   .firestore.document("/users/{userId}/Follow Ups/{documentId}")
//   .onUpdate((change, context) => {

//     var followupDataBefore = change.before.data();
//     var followupDataAfter = change.after.data();
//     // var userId = context.params.userId;
//     if (followupDataAfter.completedStatus==true) {
//       let prevDate = followupDataBefore.callStartDate;
//       let oldId = followupDataBefore.assignedTo;
//       let oldDate = prevDate._seconds
//       var day = 60 * 60 * 24 * 1000;
//       var endDate = new Date(oldDate * 1000);
//       var dateObj = new Date(endDate.getTime() + day);
//       var month = dateObj.getUTCMonth() + 1;
//       var day = dateObj.getUTCDate();
//       var year = dateObj.getUTCFullYear();

//       if (month.toString().length == 1) {
//         month = "0" + month;
//       }
//       if (day.toString().length == 1) {
//         day = "0" + day;
//       }

//       var previousDate = day + "-" + month + "-" + year;
//       updateFollowUpCount(previousDate, oldId)

//     }
//   })

//for updating payment while updating payment receipt
// exports.PaymentReceiptAmountUpdateOnEdit = functions
//   .region(region)
//   .https.onRequest((req, res) => {
//     if (path.includes(req.headers.origin)) {
//       res.set("Access-Control-Allow-Origin", req.headers.origin);
//     }
//     res.set("Access-Control-Allow-Credentials", "true");
//     if (req.method === "OPTIONS") {
//       // Send response to OPTIONS requests
//       res.set("Access-Control-Allow-Methods", "POST");
//       res.set(
//         "Content-Type",
//         "application/x-www-form-urlencoded; charset=UTF-8"
//       );
//       res.set(
//         "Access-Control-Allow-Headers",
//         "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
//       );
//       res.set("Access-Control-Max-Age", "3600");
//       res.status(204).send("");
//     } else {
//       return cors(req, res, () => {
//         let saleId = req.body.saleid;
//         let customerId = req.body.customerId;
//         let invoiced = req.body.invoiceno;
//         let superUserId = req.body.userUid;
//         let prevInvoiceNo = req.body.prevInvoiceNo;
//         if (saleId) {
//           updateSaleAmount(superUserId, saleId);
//         }
//         if (customerId) {
//           updateCustAmount(superUserId, customerId);
//         }
//         if (invoiced != "N/A") {
//           updateInvAmount(superUserId, invoiced);
//         }
//         if (invoiced != prevInvoiceNo) {
//           updateInvAmount(superUserId, prevInvoiceNo);
//         }
//         let array;
//         res.send(array).status(200);
//       });
//     }
//   });

// function updateTaskCount(userId, date, assignId, mode) {
//   admin
//     .firestore()
//     .collection("pushNotification")
//     .doc("scheduledNotification")
//     .collection(date)
//     .doc(assignId)
//     .get()
//     .then((datas) => {
//       val = datas.data()
//       let onceLoop = false;
//       if (val) {
//         if (!onceLoop) {
//           let currentTaskCount = val?.tasksNo;
//           let currentMeetingCount = val?.meetingsNo
//           let currentFollowupCount = val?.followupsNo

//           if (mode == "reduce") {
//             let count = (currentTaskCount * 1) - 1;
//             if (count == 0 && currentMeetingCount == 0 && currentFollowupCount == 0) {
//               admin
//                 .firestore()
//                 .collection("pushNotification")
//                 .doc("scheduledNotification")
//                 .collection(date)
//                 .doc(assignId).delete().then(() => {
//                   console.log("notification deleted")

//                 })
//             }
//             else {
//               admin
//                 .firestore()
//                 .collection("pushNotification")
//                 .doc("scheduledNotification")
//                 .collection(date)
//                 .doc(assignId)
//                 .update({ tasksNo: count }).then(() => {
//                   console.log("taskno reduced to", count)

//                 })
//             }
//           }
//           else {
//             let count = (currentTaskCount * 1) + 1;
//             admin
//               .firestore()
//               .collection("pushNotification")
//               .doc("scheduledNotification")
//               .collection(date)
//               .doc(assignId)
//               .update({ tasksNo: count }).then(() => {
//                 console.log("taskno added to", count)

//               })
//           }
//           onceLoop = true;
//         }
//       }
//       else {
//         if (mode != "reduce") {
//           admin
//             .firestore()
//             .collection("pushNotification")
//             .doc("scheduledNotification")
//             .collection(date)
//             .doc(assignId)
//             .set({ userId: userId, tasksNo: 1, meetingsNo: 0, followupsNo: 0 }).then(() => {
//               console.log("task count created")

//             })
//         }
//       }

//     })
// }
// function updateFollowUpCount( date, assignId){
//   admin
//   .firestore()
//   .collection("pushNotification")
//   .doc("scheduledNotification")
//   .collection(date)
//   .doc(assignId)
//   .get()
//   .then((datas) => {
//     val = datas.data()
//     let onceLoop = false;
//     if (val) {
//       if (!onceLoop) {
//         let currentTaskCount = val?.tasksNo;
//         let currentMeetingCount = val?.meetingsNo
//         let currentFollowupCount = val?.followupsNo
//           let count = (currentFollowupCount * 1) - 1;
//           if (count == 0 && currentMeetingCount == 0 && currentTaskCount == 0) {
//             admin
//               .firestore()
//               .collection("pushNotification")
//               .doc("scheduledNotification")
//               .collection(date)
//               .doc(assignId).delete().then(() => {
//                 console.log("notification deleted")

//               })
//           }
//           else {
//             admin
//               .firestore()
//               .collection("pushNotification")
//               .doc("scheduledNotification")
//               .collection(date)
//               .doc(assignId)
//               .update({ followupsNo: count }).then(() => {
//                 console.log("followup reduced to", count)

//               })
//           }
//         onceLoop = true;
//       }
//     }

//   })
// }

function updateSaleAmount(superUserId, saleId) {
  return admin
    .firestore()
    .collection("users")
    .doc(superUserId)
    .collection("paymentsreceived")
    .where("saleid", "==", saleId)
    .get()
    .then((data) => {
      let salePayments = data;
      let totalSaleAmountCollected = 0;

      salePayments.forEach((ele) => {
        totalSaleAmountCollected =
          totalSaleAmountCollected + ele.data().amountCollected;
      });

      admin
        .firestore()
        .collection("users")
        .doc(superUserId)
        .collection("sales")
        .doc(saleId)
        .update({ collectedAmount: totalSaleAmountCollected })
        .then(() => {
          console.log("saleAmount-updated");
        });
    });
}

function updateCustAmount(superUserId, customerId) {
  return admin
    .firestore()
    .collection("users")
    .doc(superUserId)
    .collection("paymentsreceived")
    .where("customerId", "==", customerId)
    .get()
    .then((data) => {
      let custPayments = data;
      let totalCustAmountCollected = 0;
      custPayments.forEach((ele) => {
        totalCustAmountCollected =
          totalCustAmountCollected + ele.data().amountCollected;
      });

      admin
        .firestore()
        .collection("users")
        .doc(superUserId)
        .collection("customers")
        .doc(customerId)
        .update({ totalAmountCollected: totalCustAmountCollected })
        .then(() => {
          console.log("customerAmount-updated");
        });
    });
}
function updateInvAmount(superUserId, invoiced) {
  return admin
    .firestore()
    .collection("users")
    .doc(superUserId)
    .collection("paymentsreceived")
    .where("invoiceno", "==", invoiced)
    .get()
    .then((data) => {
      let invPayments = data;
      let totalInvAmountCollected = 0;
      invPayments.forEach((ele) => {
        totalInvAmountCollected =
          totalInvAmountCollected + ele.data().amountCollected;
      });

      admin
        .firestore()
        .collection("users")
        .doc(superUserId)
        .collection("Invoices")
        .doc(invoiced)
        .update({ collectedAmount: totalInvAmountCollected })
        .then(() => {
          console.log("invoiceAmount-updated");
        });
    });
}

//for sheduling push notification for showing task and followup count
// every day 9 am
exports.scheduledNotificationFunction = functions.pubsub
  .schedule("0 9 * * *")
  .timeZone("Asia/Calcutta")
  .onRun((context) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    let formatedDate = dd + "-" + mm + "-" + yyyy;
    return admin
      .firestore()
      .collection("pushNotification")
      .doc("scheduledNotification")
      .collection(formatedDate)
      .get()
      .then((values) => {
        let notifData = values;
        notifData.forEach((data) => {
          return admin
            .firestore()
            .collection("Devices")
            .where("userUid", "==", data.data().userId)
            .get()
            .then((device) => {
              var Devices = device;
              const payload = {
                notification: {
                  title:
                    "You have " +
                    data.data().tasksNo +
                    " tasks and " +
                    data.data().followupsNo +
                    " followups Today",
                  body: "Tap here to check it out!",
                },
              };
              Devices.forEach((ele) => {
                admin
                  .messaging()
                  .sendToDevice(ele.data().token, payload)
                  .then(() => {
                    console.log("sheduled notification sent");
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              });
            });
        });
      });
  });

// })

// exports.scheduledNotificationFunction = functions.pubsub
//   .schedule("0 9 * * *")
//   .timeZone("Asia/Calcutta")
//   .onRun((context) => {
//     var today = new Date();
//     var dd = String(today.getDate()).padStart(2, "0");
//     var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
//     var yyyy = today.getFullYear();
//     let formatedDate = dd + "-" + mm + "-" + yyyy;
//     return admin
//       .firestore()
//       .collection("pushNotification")
//       .doc("scheduledNotification")
//       .collection(formatedDate)
//       .get()
//       .then((values) => {
//         let notifData = values;
//         notifData.forEach((data) => {
//           return admin
//             .firestore()
//             .collection("Devices")
//             .where("userUid", "==", data.data().userId)
//             .get()
//             .then((device) => {
//               var Devices = device;
//               const payload = {
//                 notification: {
//                   title:
//                     "You have " +
//                     data.data().tasksNo +
//                     " tasks," +
//                     data.data().meetingsNo +
//                     " meetings and " +
//                     data.data().followupsNo +
//                     " followups Today",
//                   body: "Tap here to check it out!",
//                 },
//               };
//               Devices.forEach((ele) => {
//                 admin
//                   .messaging()
//                   .sendToDevice(ele.data().token, payload)
//                   .then(() => {
//                     console.log("sheduled notification sent");
//                   })
//                   .catch((e) => {
//                     console.log(e);
//                   });
//               });
//             });
//         });
//       });
//   });

// exports.scheduledFunctionTested =
//   functions.firestore
//     .document("/test/{userUid}")
//     .onCreate((snap, context) => {
//       console.log("entered top")
//       createdDocument = snap.data();
//       var today = new Date();
//       var dd = String(today.getDate()).padStart(2, '0');
//       var mm = String(today.getMonth() + 1).padStart(2, '0');
//       var yyyy = today.getFullYear();
//       let formatedDate = dd + '-' + mm + '-' + yyyy;
//       return admin
//         .firestore().collection("pushNotification")
//         .doc("scheduledNotification")
//         .collection(formatedDate)
//         .get()
//         .then((values) => {
//           console.log("read notification")
//           let notifData = values
//           notifData.forEach((data) => {
//             console.log("userId", data.data().userId)
//             return admin
//               .firestore()
//               .collection("Devices")
//               .where("userUid", "==", data.data().userId)
//               .get()
//               .then((device) => {
//                 var Devices = device;
//                 console.log("got devices")
//                 console.log(data.data().tasksNo, data.data().meetingsNo, data.data().followupsNo)
//                 const payload = {
//                   notification: {
//                     title: "You have " + data.data().tasksNo + " tasks," + data.data().meetingsNo + " meetings and " +
//                       data.data().followupsNo + " followups Today",
//                     body: "Tap here to check it out!",
//                   },
//                 }
//                 Devices.forEach((ele) => {
//                   console.log("sending message")
//                   admin
//                     .messaging()
//                     .sendToDevice(ele.data().token, payload)
//                     .then(() => {
//                       console.log("sheduled notification sent");
//                     })
//                     .catch((e) => {
//                       console.log(e);
//                     });
//                 });

//               })
//           })

//         })
//     })

function getSaleAssignedTo(userId, saleId, doumentDetails, docId) {
  return admin
    .firestore()
    .doc("users/" + userId + "/sales/" + saleId)
    .get()
    .then((dataSales) => {
      let dueMessage;
      let duedate = doumentDetails.data().docData.dueDate.toDate();
      let newDate = converTZ(duedate, defaultTimeZone);
      let name = doumentDetails.data().customerData.sname
        ? doumentDetails.data().customerData.fname1 +
          " " +
          doumentDetails.data().customerData.sname
        : doumentDetails.data().customerData.fname1;
      dueMessage =
        "Payment is due for invoice number " +
        doumentDetails.data().docData.prefixAndDocNumber +
        " from customer " +
        name +
        " on " +
        newDate.toLocaleString().split(",")[0];
      sendNotification(dueMessage, userId);
      sendNotificationToUser(dueMessage, userId);
      if (userId != dataSales.data().assignedTo) {
        sendNotification(dueMessage, dataSales.data().assignedTo);
        sendNotificationToUser(dueMessage, dataSales.data().assignedTo);
      }
      sendEmailForDuePayment(
        userId,
        doumentDetails.data().customerData.custID,
        doumentDetails.data().docData.totalInclTax,
        doumentDetails.data().docData.prefixAndDocNumber,
        newDate.toLocaleString().split(",")[0],
        doumentDetails.data(),
        docId
      );
    })
    .catch((e) => {
      console.log(e.message);
    });
}
function sendEmailForDuePayment(
  userId,
  custID,
  totalInclTax,
  docNumber,
  date,
  invData,
  docId
) {
  return admin
    .firestore()
    .doc("users/" + userId)
    .get()
    .then((dataUser) => {
      var conditionNewUser =
        Date.now() - dataUser.data().createdDate < 30 * 24 * 60 * 60 * 1000;
      var conditionPlan = false;
      if (!conditionNewUser) {
        if (dataUser.data().paymentHistory) {
          var currentPlan = dataUser
            .data()
            .paymentHistory.filter(
              (el) =>
                el.currentCycleStartDate * 1000 < Date.now() &&
                el.currentCycleEnd * 1000 > Date.now()
            );
          if (currentPlan.length > 0) {
            if (currentPlan[0].plan) {
              if (currentPlan[0].plan == "diamond") {
                conditionPlan = true;
              }
            }
          }
        }
      }
      if (
        (conditionPlan || conditionNewUser) &&
        dataUser.data().emailActivated
      ) {
        getCustomerDetailsAndSendEmail(
          userId,
          custID,
          totalInclTax,
          docNumber,
          date,
          dataUser.data().selectedEmailTemplate,
          invData,
          docId
        );
      }
    });
}
function getCustomerDetailsAndSendEmail(
  userId,
  custID,
  totalInclTax,
  docNumber,
  date,
  selectedEmailTemplate,
  invData,
  docId
) {
  return admin
    .firestore()
    .doc("users/" + userId + "/customers/" + custID)
    .get()
    .then((datacustomer) => {
      if (datacustomer.data().email) {
        getEmailTemplate(userId, selectedEmailTemplate).then((template) => {
          if (template.templateType == "Invoice") {
            var emailData = {
              templateType: "Invoice",
              customerId: custID,
              docId: docId,
              assignedTo: invData.docData.saleAssignedToOwner,
              html: template.body,
              to: datacustomer.data().email,
              subject: template.subject,
              saleId: invData.docData.saleID,
            };
            addtoautomatedMail(emailData, userId);
          }
        });
      }
    });
}
function sendNotification(dueMessage, userId) {
  return admin
    .firestore()
    .collection("users/" + userId + "/Notifications")
    .add({
      message: dueMessage,
      createdDate: Date.now(),
      viewStatus: false,
    })
    .then((res) => {
      console.log("added to notification collection");
    })
    .catch((e) => {
      console.log(e.message);
    });
}
function sendNotificationToUser(dueMessage, userId) {
  console.log("USER ID", userId);
  return admin
    .firestore()
    .collection("Devices")
    .where("userUid", "==", userId)
    .get()
    .then((device) => {
      const payload = {
        notification: {
          title: dueMessage,
          body: "Tap here to check it out!",
        },
      };
      device.forEach((ele) => {
        console.log("DEVICE", ele.data().token);

        sendNotificationToDevice(ele.data().token, payload);
      });
    })
    .catch((e) => {
      console.log(e.message);
    });
}
// function sendPushNotificationToUser(dueMessage, userId, doc,docUrl) {
//   console.log("URL", docUrl);
//   return admin
//     .firestore()
//     .collection("Devices")
//     .where("userUid", "==", userId)
//     .where("deviceType", "==", "android")
//     .get()
//     .then((device) => {
//       const payload = {
//         notification: {
//           title: dueMessage,
//           body: "Tap here to check it out!"
//         },
//         data: {
//           docId: doc,
//           navUrl:docUrl
//         }
//       };
//       // const sentTokens = [];
//       devices.forEach((device) => {
//         // console.log("DEVICE", device.data().token);
//         // if (!sentTokens.includes(device.data().token)) {
//         //   sentTokens.push(device.data().token);
//           sendNotificationToDevice(device.data().token, payload);
//         // }
//       });
//     })
//     .catch((e) => {
//       console.log(e.message);
//     });
// }
function sendPushNotificationToUser(dueMessage, userId, doc, docUrl) {
  console.log("URL", docUrl);
  const sentTokens = []; // create an array to store sent tokens
  return admin
    .firestore()
    .collection("Devices")
    .where("userUid", "==", userId)
    .where("deviceType", "==", "android")
    .get()
    .then((devices) => {
      const payload = {
        notification: {
          title: dueMessage,
          body: "Tap here to check it out!",
        },
        data: {
          docId: doc,
          navUrl: docUrl,
        },
      };
      devices.forEach((device) => {
        const token = device.data().token;
        console.log("TOKENS ::", device.data().token);
        if (!sentTokens.includes(token)) {
          sentTokens.push(token);
          console.log("SendToken Length:", sentTokens.length);
          sendNotificationToDevice(token, payload);
        }
      });
    })
    .catch((e) => {
      console.log(e.message);
    });
}

function sendNotificationToDevice(token, payload) {
  console.log("Device Notification Count ");
  return admin
    .messaging()
    .sendToDevice(token, payload)
    .then(() => {
      console.log("sheduled notification sent");
    })
    .catch((e) => {
      console.log(e.message);
    });
}
// getting the date with time zone
dateWithTimeZone = (timeZone, year, month, day, hour, minute, second, ms) => {
  let date = new Date(Date.UTC(year, month, day, hour, minute, second, ms));
  let utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  let tzDate = new Date(date.toLocaleString("en-US", { timeZone: timeZone }));
  let offset = utcDate.getTime() - tzDate.getTime();
  date.setTime(date.getTime() + offset);
  return date;
};
dateWithTimeZoneFromDate = (datetim) => {
  let date = new Date(
    Date.UTC(
      datetim.getFullYear(),
      datetim.getMonth(),
      datetim.getDate(),
      datetim.hour,
      datetim.minute,
      datetim.second,
      0
    )
  );
  let utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  let tzDate = new Date(
    date.toLocaleString("en-US", { timeZone: defaultTimeZone })
  );
  let offset = utcDate.getTime() - tzDate.getTime();
  date.setTime(date.getTime() + offset);
  return date;
};
dateWithDefaultTimeZone = (year, month, day, hour, minute, second, ms) => {
  let date = new Date(Date.UTC(year, month, day, hour, minute, second, ms));
  let utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  let tzDate = new Date(
    date.toLocaleString("en-US", { timeZone: defaultTimeZone })
  );
  let offset = utcDate.getTime() - tzDate.getTime();
  date.setTime(date.getTime() + offset);
  return date;
};
dateWithDefaultTimeZoneFromString = (datetime) => {
  let date = new Date(Date.parse(datetime));
  let utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  let tzDate = new Date(
    date.toLocaleString("en-US", { timeZone: defaultTimeZone })
  );
  let offset = utcDate.getTime() - tzDate.getTime();
  date.setTime(date.getTime() + offset);
  return date;
};
dateWithDefaultTimeZoneFromTimeStamp = (datetime) => {
  let date = new Date(datetime);
  let utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  let tzDate = new Date(
    date.toLocaleString("en-US", { timeZone: defaultTimeZone })
  );
  let offset = utcDate.getTime() - tzDate.getTime();
  date.setTime(date.getTime() + offset);
  return date;
};
function converTZ(date, tzString) {
  return new Date(date).toLocaleString("en-US", { timeZone: tzString });
}
// function for send notification for user where invoice due date for a contact is today and collected amt is less than invoiced amount
exports.duePaymentNotificationFunction = functions.pubsub
  .schedule("0 9 * * *")
  .timeZone(defaultTimeZone)
  .onRun((context) => {
    var today = new Date();
    let todayInv = dateWithDefaultTimeZone(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0,
      0,
      0,
      0
    );
    let lastDayInv = dateWithDefaultTimeZone(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      23,
      59,
      59,
      999
    );
    return admin
      .firestore()
      .collectionGroup("Invoices")
      .where("docData.dueDate", ">=", todayInv)
      .where("docData.dueDate", "<=", lastDayInv)
      .get()
      .then((data1) => {
        data1.forEach((doumentDetails) => {
          const messageRef = doumentDetails.ref;
          const inboxRef = messageRef.parent;
          const userRef = inboxRef.parent;
          const docId = doumentDetails.id;
          if (
            doumentDetails.data().collectedAmount <
            doumentDetails.data().docData.totalInclTax
          ) {
            getSaleAssignedTo(
              userRef.id,
              doumentDetails.data().docData.saleID,
              doumentDetails,
              docId
            );
          }
        });
      })
      .catch((e) => {
        console.log(e.message);
      });
  });
//function to send Push notification when assignedTo changes
// exports.sendAssignmentNotification = functions.firestore
//   .document(
//     "/users/sffW7pwWNuhAVFIKvZwjQMaBidx1/customers"
//   )
//   .onWrite((change, context) => {
//     console.log("Change", context.params)
//     const previousData = change.before.data();
//     const newData = change.after.data();
//     let userId = 'sffW7pwWNuhAVFIKvZwjQMaBidx1'
//     let assignedTo;
//     let assignedToMessage;
//     console.log("Created By", newData.createdBy);
//     // console.log("USER ID",userId);
//     if (change.before.exists && (newData.createdBy != userId)) {
//       if (previousData.assignedTo != newData.assignedTo) {
//         assignedTo = newData.assignedTo;
//         assignedToMessage = " Assigned To changed1"
//       }
//     }
//     // else if(newData.createdBy !=userId){
//     else {
//       assignedTo = newData.assignedTo;
//       assignedToMessage = " NOT A SIGNED IN USER"
//     }
//     // else{
//     //   return false
//     // }
//     if (assignedTo) {
//       sendNotificationToUser(assignedToMessage, userId)
//     }
//   });

// exports.httpNotification =
//   functions.region(region).https.onRequest((req, res) => {
//     console.log("entered top")
//     var today = new Date();
//     var dd = String(today.getDate()).padStart(2, '0');
//     var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//     var yyyy = today.getFullYear();
//     let formatedDate = dd + '-' + mm + '-' + yyyy;
//     admin
//       .firestore().collection("pushNotification")
//       .doc("scheduledNotification")
//       .collection(formatedDate)
//       .get()
//       .then((valusees) => {
//         console.log("read notification")
//         console.log(values.size)
//         values.forEach((data) => {
//           console.log("userId", data.data().userId)
//           return admin
//             .firestore()
//             .collection("Devices")
//             .where("userUid", "==", data.data().userId)
//             .get()
//             .then((device) => {
//               var Devices = device;
//               console.log("got devices")
//               console.log(data.data().tasksNo, data.data().meetingsNo, data.data().followupsNo)
//               const payload = {
//                 notification: {
//                   title: "You have " + data.data().tasksNo + "tasks," + data.data().meetingsNo + " meetings and" +
//                     data.data().followupsNo + "followups today",
//                   body: "Tap here to check it out!",
//                 },
//               }
//               Devices.forEach((ele) => {
//                 console.log("sending message")
//                 admin
//                   .messaging()
//                   .sendToDevice(ele.data().token, payload)
//                   .then(() => {
//                     console.log("sheduled notification sent");
//                   })
//                   .catch((e) => {
//                     console.log(e);
//                   });
//               });

//             })
//         })

//       })
//   });

exports.ChatNotification = functions.firestore
  .document("/chats/{chatId}/conversations/{documentId}")
  .onCreate((snap, context) => {
    createdDocument = snap.data();
    // console.log(createdDocument)
    // console.log(context.params.userUid)
    // console.log(context.params.documentId)
    return admin
      .firestore()
      .doc("chats/" + context.params.chatId)
      .get()
      .then((data) => {
        var chatdata = data.data();
        var notification = {
          title: chatdata.customerName + " send you a message",
          body: "Tap here to check it out!",
          click_action: "https://zenysdevelopment.web.app/dash/chat",
        };
        sendnotification(chatdata.zenysUserUid, notification);
      })
      .catch((e) => {
        console.log(e);
      });
  });

function sendnotification(userId, notification) {
  return admin
    .firestore()
    .collection("Devices")
    .where("userUid", "==", userId)
    .get()
    .then((data) => {
      var Devices = data;
      //  console.log(Devices)
      const payload = {
        notification: notification,
      };
      Devices.forEach((ele) => {
        //  console.log(ele.data());
        admin
          .messaging()
          .sendToDevice(ele.data().token, payload)
          .then(() => {
            console.log("done one");
          })
          .catch((e) => {
            console.log(e);
          });
      });
    })
    .catch((e) => {
      console.log(e);
    });
}
exports.automatedMail = functions.firestore
  .document("users/{userId}/automatedMail/{documentId}")
  .onCreate((snap, context) => {
    createdData = snap.data();
    return admin
      .firestore()
      .doc("users/" + context.params.userId + "/SMTPsettings/SMTP")
      .get()
      .then((data) => {
        if (data) {
          let from = "";
          if (data.data().type) {
            from =
              data.data().type == "mailService"
                ? data.data().From
                : data.data().SMTP.auth.user;
          }
          let smtpConnectionUrl = data.data().SMTP;
          // smtpConnectionUrl=data.data().type=="mailService"?data.data().SMTP.SMTPUrl:data.data().SMTP

          // console.log(smtpConnectionUrl)
          const nodemailer = require("nodemailer");
          // const MailComposer = require("nodemailer/lib/mail-composer");
          // console.log(req.body)
          // var Mail=new MailComposer(req.body)
          let poolconfig = smtpConnectionUrl;
          var html = "";
          if (createdData.templateType) {
            var templateType = createdData.templateType;
            if (templateType == "Invoice") {
              return admin
                .firestore()
                .doc("users/" + context.params.userId)
                .get()
                .then((superdata) => {
                  console.log("at superlevel");
                  let superUserData = superdata.data();
                  return admin
                    .firestore()
                    .doc(
                      "users/" +
                        context.params.userId +
                        "/customers/" +
                        createdData.customerId
                    )
                    .get()
                    .then((contdata) => {
                      let contact = contdata.data();
                      return admin
                        .firestore()
                        .doc(
                          "users/" +
                            context.params.userId +
                            "/sales/" +
                            createdData.saleId
                        )
                        .get()
                        .then((saledata) => {
                          let sale = saledata.data();
                          return admin
                            .firestore()
                            .doc(
                              "users/" +
                                context.params.userId +
                                "/Invoices/" +
                                createdData.docId
                            )
                            .get()
                            .then((documentData) => {
                              let doc = documentData.data();
                              getassignedToUser(createdData.assignedTo).then(
                                (assignedToData) => {
                                  if (!!sale && !!contact) {
                                    html = templateBodyConverter(
                                      templateType,
                                      superUserData,
                                      contact,
                                      sale,
                                      doc,
                                      assignedToData,
                                      createdData.html
                                    );
                                    let transporter =
                                      nodemailer.createTransport(poolconfig);
                                    transporter.sendMail(
                                      {
                                        // sender:req.body.from,
                                        from: from,
                                        to: createdData.to,
                                        cc: createdData.cc,
                                        html: html,
                                        subject: createdData.subject,
                                        attachments: createdData.attachments
                                          ? createdData.attachments
                                          : [],
                                        envelope: {
                                          from: from, // used as MAIL FROM: address for SMTP
                                          to: createdData.to, // used as RCPT TO: address for SMTP
                                          //console.log(req.body.messages)
                                        },
                                      },
                                      (err, info) => {
                                        if (err) console.log(err);
                                        admin
                                          .firestore()
                                          .doc(
                                            "users/" +
                                              context.params.userId +
                                              "/automatedMail/" +
                                              context.params.documentId
                                          )
                                          .update({ sendReport: err })
                                          .then((data) => {
                                            console.log(data);
                                          });
                                        if (info) {
                                          console.log(info);
                                          admin
                                            .firestore()
                                            .doc(
                                              "users/" +
                                                context.params.userId +
                                                "/automatedMail/" +
                                                context.params.documentId
                                            )
                                            .update({ sendReport: info })
                                            .then((data) => {
                                              console.log(data);
                                            });
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            });
                        });
                    });
                });
            }
          } else {
            html = createdData.html;
            let transporter = nodemailer.createTransport(poolconfig);
            transporter.sendMail(
              {
                // sender:req.body.from,
                from: from,
                to: createdData.to,
                cc: createdData.cc,
                html: html,
                subject: createdData.subject,
                attachments: createdData.attachments
                  ? createdData.attachments
                  : [],
                envelope: {
                  from: from, // used as MAIL FROM: address for SMTP
                  to: createdData.to, // used as RCPT TO: address for SMTP
                  //console.log(req.body.messages)
                },
              },
              (err, info) => {
                if (err) console.log(err);
                admin
                  .firestore()
                  .doc(
                    "users/" +
                      context.params.userId +
                      "/automatedMail/" +
                      context.params.documentId
                  )
                  .update({ sendReport: err })
                  .then((data) => {
                    console.log(data);
                  });
                if (info) {
                  console.log(info);
                  admin
                    .firestore()
                    .doc(
                      "users/" +
                        context.params.userId +
                        "/automatedMail/" +
                        context.params.documentId
                    )
                    .update({ sendReport: info })
                    .then((data) => {
                      console.log(data);
                    });
                }
              }
            );
          }
        }
      });
  });

exports.getAllRegisteredUsers = functions
  .region(region)
  .https.onRequest((req, res) => {
    res.set("Access-Control-Allow-Origin", path);
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        var allUsers = [];
        return admin
          .auth()
          .listUsers()
          .then(function (listUsersResult) {
            listUsersResult.users.forEach(function (userRecord) {
              // For each user
              var userData = userRecord.toJSON();
              allUsers.push(userData);
            });
            res.status(200).send(JSON.stringify(allUsers));
          })
          .catch(function (error) {
            console.log("Error listing users:", error);
            res.status(500).send(error);
          });

        //console.log(req.body.subscriptions_id);
      });
    }
  });

//contact automation
exports.contactAutomationCreate = functions
  .region(region)
  .firestore.document("/users/{userId}/customers/{documentId}")
  .onCreate((snap, context) => {
    var contact = snap.data();
    // var contact = req.body;
    var userId = context.params.userId;
    contact.customerId = context.params.documentId;
    var superUserDetails;

    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("automations")
      .where("queryArray", "array-contains", "contact")
      .where("active", "==", true)
      .where("createTrigger", "==", true)
      .get()
      .then((data) => {
        // console.log(contact);
        var AllRules = data.docs;
        // console.log(AllRules)

        if (AllRules.length > 0) {
          return admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((data1) => {
              superUserDetails = data1.data();

              var conditionNewUser =
                Date.now() - data1.data().createdDate <
                30 * 24 * 60 * 60 * 1000;
              console.log(conditionNewUser ? "is new USer" : "not new user");
              var conditionPlan = false;
              if (!conditionNewUser) {
                console.log("1");
                if (data1.data().paymentHistory) {
                  var currentPlan = data1
                    .data()
                    .paymentHistory.filter(
                      (el) =>
                        el.currentCycleStartDate * 1000 < Date.now() &&
                        el.currentCycleEnd * 1000 > Date.now()
                    );
                  if (currentPlan.length > 0) {
                    if (currentPlan[0].plan) {
                      if (currentPlan[0].plan == "diamond") {
                        conditionPlan = true;
                        console.log(
                          conditionPlan
                            ? "is diamond user"
                            : "is not diamond user"
                        );
                      }
                    }
                  }
                }
              }
              if (conditionPlan || conditionNewUser) {
                contact.superData = superUserDetails;
                AllRules.forEach((rule) => {
                    if (eval(rule.data().condition)) {
                      eval(
                        rule.data().do + "(contact,rule.data(),'contact',userId)" //eg if do is followuptask createFolowupTask(contact,rule.data(),'contact',userID)
                      );
                    // }
                  }
                });
              }
            });
        }
        // console.log(createRules)

        // res.send(createRules);
      });
  });
// });
exports.contactAutomationEdit = functions
  .region(region)
  .firestore.document("/users/{userId}/customers/{documentId}")
  .onUpdate((change, context) => {
    var contact = change.after.data();
    var oldcontact = change.before.data();

    var userId = context.params.userId;
    contact.customerId = context.params.documentId;

    var superUserDetails;

    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("automations")
      .where("queryArray", "array-contains", "contact")
      .where("active", "==", true)
      .where("editTrigger", "==", true)
      .get()
      .then((data) => {
        var AllRules = data.docs;
        // console.log(AllRules)

        // console.log(createRules)
        if (AllRules.length > 0) {
          return admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((data1) => {
              superUserDetails = data1.data();

              var conditionNewUser =
                Date.now() - data1.data().createdDate <
                30 * 24 * 60 * 60 * 1000;
              console.log(conditionNewUser ? "is new USer" : "not new user");
              var conditionPlan = false;
              if (!conditionNewUser) {
                console.log("1");
                if (data1.data().paymentHistory) {
                  var currentPlan = data1
                    .data()
                    .paymentHistory.filter(
                      (el) =>
                        el.currentCycleStartDate * 1000 < Date.now() &&
                        el.currentCycleEnd * 1000 > Date.now()
                    );
                  if (currentPlan.length > 0) {
                    if (currentPlan[0].plan) {
                      if (currentPlan[0].plan == "diamond") {
                        conditionPlan = true;
                        console.log(
                          conditionPlan
                            ? "is diamond user"
                            : "is not diamond user"
                        );
                      }
                    }
                  }
                }
              }
              if (conditionPlan || conditionNewUser) {
                contact.superData = superUserDetails;
                AllRules.forEach((rule) => {
                    if (eval(rule.data().condition)) {
                      eval(
                        rule.data().do + "(contact,rule.data(),'contact',userId)"
                      );
                    }
                  // }
                });
              }
            });
        }
        // res.send(createRules);
      })
      .then((res) => {
        console.log("2nd .then");
      });
  });

// Inquiry automation
exports.inquiryAutomationCreate = functions
  .region(region)
  .firestore.document("/users/{userId}/Inquiries/{documentId}")
  .onCreate((snap, context) => {
    var inquiry = snap.data();
    inquiry.customerId = "";
    // var contact = req.body;
    var userId = context.params.userId;
    contact.customerId = context.params.documentId;
    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("automations")
      .where("queryArray", "array-contains", "inquiry")
      .where("active", "==", true)
      .get()
      .then((data) => {
        // console.log(contact);
        var AllRules = data.docs;
        // console.log(AllRules)

        var createRules = AllRules.filter((data) =>
          data.data().queryArray.includes("create")
        );
        if (createRules.length > 0) {
          return admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((data1) => {
              var conditionNewUser =
                Date.now() - data1.data().createdDate <
                30 * 24 * 60 * 60 * 1000;
              console.log(conditionNewUser ? "is new USer" : "not new user");
              var conditionPlan = false;
              if (!conditionNewUser) {
                console.log("1");
                if (data1.data().paymentHistory) {
                  var currentPlan = data1
                    .data()
                    .paymentHistory.filter(
                      (el) =>
                        el.currentCycleStartDate * 1000 < Date.now() &&
                        el.currentCycleEnd * 1000 > Date.now()
                    );
                  if (currentPlan.length > 0) {
                    if (currentPlan[0].plan) {
                      if (currentPlan[0].plan == "diamond") {
                        conditionPlan = true;
                        console.log(
                          conditionPlan
                            ? "is diamond user"
                            : "is not diamond user"
                        );
                      }
                    }
                  }
                }
              }
              if (conditionPlan || conditionNewUser) {
                createRules.forEach((rule) => {
                  if (eval(rule.data().condition))
                    eval(
                      rule.data().do + "(inquiry,rule.data(),'inquiry',userId)"
                    );
                });
              }
            });
        }
        // console.log(createRules)

        // res.send(createRules);
      });
  });
// });
exports.inquiryAutomationEdit = functions
  .region(region)
  .firestore.document("/users/{userId}/Inquiries/{documentId}")
  .onUpdate((change, context) => {
    var inquiry = change.after.data();
    var oldinquiry = change.before.data();
    inquiry.customerId = "";
    var userId = context.params.userId;
    contact.customerId = context.params.documentId;
    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("automations")
      .where("queryArray", "array-contains", "inquiry")
      .where("active", "==", true)
      .get()
      .then((data) => {
        // console.log(contact);
        var AllRules = data.docs;
        // console.log(AllRules)

        var createRules = AllRules.filter((data) =>
          data.data().queryArray.includes("edit")
        );
        // console.log(createRules)
        if (createRules.length > 0) {
          return admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((data1) => {
              var conditionNewUser =
                Date.now() - data1.data().createdDate <
                30 * 24 * 60 * 60 * 1000;
              console.log(conditionNewUser ? "is new USer" : "not new user");
              var conditionPlan = false;
              if (!conditionNewUser) {
                console.log("1");
                if (data1.data().paymentHistory) {
                  var currentPlan = data1
                    .data()
                    .paymentHistory.filter(
                      (el) =>
                        el.currentCycleStartDate * 1000 < Date.now() &&
                        el.currentCycleEnd * 1000 > Date.now()
                    );
                  if (currentPlan.length > 0) {
                    if (currentPlan[0].plan) {
                      if (currentPlan[0].plan == "diamond") {
                        conditionPlan = true;
                        console.log(
                          conditionPlan
                            ? "is diamond user"
                            : "is not diamond user"
                        );
                      }
                    }
                  }
                }
              }
              if (conditionPlan || conditionNewUser) {
                createRules.forEach((rule) => {
                  if (eval(rule.data().condition))
                    eval(
                      rule.data().do + "(inquiry,rule.data(),'inquiry',userId)"
                    );
                });
              }
            });
        }
        // res.send(createRules);
      });
  });
// inquiry notification end

// sale automation
exports.saleAutomationCreate = functions
  .region(region)
  .firestore.document("/users/{userId}/sales/{documentId}")
  .onCreate((snap, context) => {
    var sale = snap.data();
    // var contact = req.body;
    var userId = context.params.userId;
    sale.saleId = context.params.documentId;

    var superUserDetails; //superUserDetails

    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("automations")
      .where("queryArray", "array-contains", "sale")
      .where("active", "==", true)
      .where("createTrigger", "==", true)
      .get()
      .then((data) => {
        // console.log(contact);
        var AllRules = data.docs;
        // console.log(AllRules)

        var AllRules = AllRules.filter((data) =>
          data.data().queryArray.includes("create")
        );
        if (AllRules.length > 0) {
          // console.log(createRules)
          return admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((data1) => {
              superUserDetails = data1.data(); //assiging to variablr

              var conditionNewUser =
                Date.now() - data1.data().createdDate <
                30 * 24 * 60 * 60 * 1000;
              console.log(conditionNewUser ? "is new USer" : "not new user");
              var conditionPlan = false;
              if (!conditionNewUser) {
                console.log("1");
                if (data1.data().paymentHistory) {
                  var currentPlan = data1
                    .data()
                    .paymentHistory.filter(
                      (el) =>
                        el.currentCycleStartDate * 1000 < Date.now() &&
                        el.currentCycleEnd * 1000 > Date.now()
                    );
                  if (currentPlan.length > 0) {
                    if (currentPlan[0].plan) {
                      if (currentPlan[0].plan == "diamond") {
                        conditionPlan = true;
                        console.log(
                          conditionPlan
                            ? "is diamond user"
                            : "is not diamond user"
                        );
                      }
                    }
                  }
                }
              }
              if (conditionPlan || conditionNewUser) {
                admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("customers")
                  .doc(sale.customerId)
                  .get()
                  .then((data1) => {
                    sale.email = data1.data().email ? data1.data().email : "";
                    sale.code = data1.data().code ? data1.data().code : "";
                    sale.contactNo = data1.data().contactNo
                      ? data1.data().contactNo
                      : "";

                    // to send along sale
                    sale.contData = data1.data();
                    sale.superData = superUserDetails;
                    var enabletrue = false;
                    AllRules.forEach((rule) => {
                        if (eval(rule.data().condition)) {
                          eval(
                            rule.data().do + "(sale,rule.data(),'sale',userId)"
                          );
                        }
                      // }
                    });
                  });
              }
            });
        }
        // res.send(createRules);
      });
  });
// });
exports.saleAutomationEdit = functions
  .region(region)
  .firestore.document("/users/{userId}/sales/{documentId}")
  .onUpdate((change, context) => {
    var sale = change.after.data();
    var oldsale = change.before.data();

    var userId = context.params.userId;
    sale.saleId = context.params.documentId;

    var superUserDetails; //superUserDetails

    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("automations")
      .where("queryArray", "array-contains", "sale")
      .where("active", "==", true)
      .where("editTrigger", "==", true)
      .get()
      .then((data) => {
        // console.log(contact);
        var AllRules = data.docs;
        // console.log(AllRules)

        // console.log(createRules)
        if (AllRules.length > 0) {
          // console.log(createRules)
          return admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((data1) => {
              superUserDetails = data1.data(); //assiging to variablr
              let superUserName = data
              var conditionNewUser =
                Date.now() - data1.data().createdDate <
                30 * 24 * 60 * 60 * 1000;
              console.log(conditionNewUser ? "is new USer" : "not new user");
              var conditionPlan = false;
              if (!conditionNewUser) {
                console.log("1");
                if (data1.data().paymentHistory) {
                  var currentPlan = data1
                    .data()
                    .paymentHistory.filter(
                      (el) =>
                        el.currentCycleStartDate * 1000 < Date.now() &&
                        el.currentCycleEnd * 1000 > Date.now()
                    );
                  if (currentPlan.length > 0) {
                    if (currentPlan[0].plan) {
                      if (currentPlan[0].plan == "diamond") {
                        conditionPlan = true;
                        console.log(
                          conditionPlan
                            ? "is diamond user"
                            : "is not diamond user"
                        );
                      }
                    }
                  }
                }
              }
              if (conditionPlan || conditionNewUser) {
                admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("customers")
                  .doc(sale.customerId)
                  .get()
                  .then((data1) => {
                    sale.email = data1.data().email ? data1.data().email : "";
                    sale.code = data1.data().code ? data1.data().code : "";
                    sale.contactNo = data1.data().contactNo
                      ? data1.data().contactNo
                      : "";

                    // to send along sale
                    sale.contData = data1.data();
                    sale.superData = superUserDetails;
                    var enabletrue = false;
                    AllRules.forEach((rule) => {
                        if (eval(rule.data().condition)) {
                          console.log("LOG 2")
                          eval(
                            rule.data().do + "(sale,rule.data(),'sale',userId)"
                          );
                        }
                      // }
                    });
                  });
              }
            });
        }
        // res.send(createRules);
      });
  });

//Service automation
exports.serviceAutomationCreate = functions
  .region(region)
  .firestore.document("/users/{userId}/services/{documentId}")
  .onCreate((snap, context) => {
    var service = snap.data();
    // var contact = req.body;
    var userId = context.params.userId;
    service.serviceId = context.params.documentId;

    var superUserDetails; //superUserDetails

    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("automations")
      .where("queryArray", "array-contains", "service")
      .where("active", "==", true)
      .where("createTrigger", "==", true)
      .get()
      .then((data) => {
        // console.log(contact);
        var AllRules = data.docs;
        // console.log(AllRules)

        var AllRules = AllRules.filter((data) =>
          data.data().queryArray.includes("create")
        );
        if (AllRules.length > 0) {
          // console.log(createRules)
          return admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((data1) => {
              superUserDetails = data1.data(); //assiging to variablr

              var conditionNewUser =
                Date.now() - data1.data().createdDate <
                30 * 24 * 60 * 60 * 1000;
              console.log(conditionNewUser ? "is new USer" : "not new user");
              var conditionPlan = false;
              if (!conditionNewUser) {
                console.log("1");
                if (data1.data().paymentHistory) {
                  var currentPlan = data1
                    .data()
                    .paymentHistory.filter(
                      (el) =>
                        el.currentCycleStartDate * 1000 < Date.now() &&
                        el.currentCycleEnd * 1000 > Date.now()
                    );
                  if (currentPlan.length > 0) {
                    if (currentPlan[0].plan) {
                      if (currentPlan[0].plan == "diamond") {
                        conditionPlan = true;
                        console.log(
                          conditionPlan
                            ? "is diamond user"
                            : "is not diamond user"
                        );
                      }
                    }
                  }
                }
              }
              if (conditionPlan || conditionNewUser) {
                admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("customers")
                  .doc(service.customerId)
                  .get()
                  .then((data1) => {
                    service.email = data1.data().email
                      ? data1.data().email
                      : "";
                    service.code = data1.data().code ? data1.data().code : "";
                    service.contactNo = data1.data().contactNo
                      ? data1.data().contactNo
                      : "";

                    // to send along sale
                    service.contData = data1.data();
                    service.superData = superUserDetails;
                    var enabletrue = false;
                    AllRules.forEach((rule) => {
                        if (eval(rule.data().condition)) {
                          eval(
                            rule.data().do +
                            "(service,rule.data(),'service',userId)"
                          );
                        }
                      // }
                    });
                  });
              }
            });
        }
        // res.send(createRules);
      });
  });
// });
exports.serviceAutomationEdit = functions
  .region(region)
  .firestore.document("/users/{userId}/services/{documentId}")
  .onUpdate((change, context) => {
    var service = change.after.data();
    var oldservice = change.before.data();

    var userId = context.params.userId;
    service.serviceId = context.params.documentId;

    var superUserDetails; //superUserDetails

    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("automations")
      .where("queryArray", "array-contains", "service")
      .where("active", "==", true)
      .where("editTrigger", "==", true)
      .get()
      .then((data) => {
        // console.log(contact);
        var AllRules = data.docs;
        // console.log(AllRules)

        // console.log(createRules)
        if (AllRules.length > 0) {
          // console.log(createRules)
          return admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((data1) => {
              superUserDetails = data1.data(); //assiging to variablr

              var conditionNewUser =
                Date.now() - data1.data().createdDate <
                30 * 24 * 60 * 60 * 1000;
              console.log(conditionNewUser ? "is new USer" : "not new user");
              var conditionPlan = false;
              if (!conditionNewUser) {
                console.log("1");
                if (data1.data().paymentHistory) {
                  var currentPlan = data1
                    .data()
                    .paymentHistory.filter(
                      (el) =>
                        el.currentCycleStartDate * 1000 < Date.now() &&
                        el.currentCycleEnd * 1000 > Date.now()
                    );
                  if (currentPlan.length > 0) {
                    if (currentPlan[0].plan) {
                      if (currentPlan[0].plan == "diamond") {
                        conditionPlan = true;
                        console.log(
                          conditionPlan
                            ? "is diamond user"
                            : "is not diamond user"
                        );
                      }
                    }
                  }
                }
              }
              if (conditionPlan || conditionNewUser) {
                admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("customers")
                  .doc(service.customerId)
                  .get()
                  .then((data1) => {
                    service.email = data1.data().email
                      ? data1.data().email
                      : "";
                    service.code = data1.data().code ? data1.data().code : "";
                    service.contactNo = data1.data().contactNo
                      ? data1.data().contactNo
                      : "";

                    // to send along sale
                    service.contData = data1.data();
                    service.superData = superUserDetails;
                    // var enabletrue = false;
                    AllRules.forEach((rule) => {
                        if (eval(rule.data().condition)) {
                          eval(
                            rule.data().do +
                            "(service,rule.data(),'service',userId)"
                          );
                        // }
                      }
                    });
                  });
              }
            });
        }
        // res.send(createRules);
      });
  });

//  FOLLOW UP EDIT AUTOMATION
exports.followupAutomationEdit = functions
  .region(region)
  .firestore.document("/users/{userId}/Follow Ups/{documentId}")
  .onUpdate((change, context) => {
    var followup = change.after.data();
    var oldfollowup = change.before.data();
    // console.log(sale);
    // console.log(oldsale);

    var userId = context.params.userId;
    followup.followupId = context.params.documentId;

    var superUserDetails; //superUserDetails

    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("automations")
      .where("queryArray", "array-contains", "followup")
      .where("active", "==", true)
      .where("editTrigger", "==", true)
      .get()
      .then((data) => {
        // console.log(contact);
        var AllRules = data.docs;
        // console.log(AllRules)

        // console.log(createRules);
        if (AllRules.length > 0) {
          // console.log(createRules)
          return admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((data1) => {
              superUserDetails = data1.data(); //assiging to variablr

              var conditionNewUser =
                Date.now() - data1.data().createdDate <
                30 * 24 * 60 * 60 * 1000;
              console.log(conditionNewUser ? "is new USer" : "not new user");
              var conditionPlan = false;
              if (!conditionNewUser) {
                console.log("1");
                if (data1.data().paymentHistory) {
                  var currentPlan = data1
                    .data()
                    .paymentHistory.filter(
                      (el) =>
                        el.currentCycleStartDate * 1000 < Date.now() &&
                        el.currentCycleEnd * 1000 > Date.now()
                    );
                  if (currentPlan.length > 0) {
                    if (currentPlan[0].plan) {
                      if (currentPlan[0].plan == "diamond") {
                        conditionPlan = true;
                        console.log(
                          conditionPlan
                            ? "is diamond user"
                            : "is not diamond user"
                        );
                      }
                    }
                  }
                }
              }
              if (conditionPlan || conditionNewUser) {
                admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("customers")
                  .doc(followup.customerId)
                  .get()
                  .then((data1) => {
                    followup.email = data1.data().email
                      ? data1.data().email
                      : "";

                    // to send along sale
                    followup.contData = data1.data();
                    followup.superData = superUserDetails;

                    AllRules.forEach((rule) => {
                      if (eval(rule.data().condition))
                        eval(
                          rule.data().do +
                            "(followup,rule.data(),'followup',userId)"
                        );
                    });
                  });
              }
            });
        }
        // res.send(createRules);
      });
  });

// invoice automations

exports.invoiceAutomationCreate = functions
  .region(region)
  .firestore.document("/users/{userId}/Invoices/{documentId}")
  .onCreate((snap, context) => {
    var invoice = snap.data();
    // var contact = req.body;
    var userId = context.params.userId;
    invoice.saleId = snap.data().docData.saleID;
    invoice.customerId = snap.data().customerData.custID;

    var superUserDetails; //superUserDetails

    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("automations")
      .where("queryArray", "array-contains", "invoice")
      .where("active", "==", true)
      .where("createTrigger", "==", true)
      .get()
      .then((data) => {
        // console.log(contact);
        var AllRules = data.docs;
        // console.log(AllRules)

        // console.log(createRules)
        if (AllRules.length > 0) {
          return admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((data1) => {
              superUserDetails = data1.data(); //assiging to variablr
              invoice.superData = superUserDetails;

              var conditionNewUser =
                Date.now() - data1.data().createdDate <
                30 * 24 * 60 * 60 * 1000;
              console.log(conditionNewUser ? "is new USer" : "not new user");
              var conditionPlan = false;
              if (!conditionNewUser) {
                console.log("1");
                if (data1.data().paymentHistory) {
                  var currentPlan = data1
                    .data()
                    .paymentHistory.filter(
                      (el) =>
                        el.currentCycleStartDate * 1000 < Date.now() &&
                        el.currentCycleEnd * 1000 > Date.now()
                    );
                  if (currentPlan.length > 0) {
                    if (currentPlan[0].plan) {
                      if (currentPlan[0].plan == "diamond") {
                        conditionPlan = true;
                        console.log(
                          conditionPlan
                            ? "is diamond user"
                            : "is not diamond user"
                        );
                      }
                    }
                  }
                }
              }
              if (conditionPlan || conditionNewUser) {
                admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("customers")
                  .doc(invoice.customerId)
                  .get()
                  .then((data1) => {
                    invoice.firstName = data1.data().firstName;
                    invoice.email = data1.data().email
                      ? data1.data().email
                      : "";
                    invoice.secondName = data1.data().secondName
                      ? data1.data().secondName
                      : "";
                    invoice.companyName = data1.data().companyName;
                    invoice.code = data1.data().code ? data1.data().code : "";
                    invoice.contactNo = data1.data().contactNo
                      ? data1.data().contactNo
                      : "";

                    invoice.contData = data1.data(); //whole contact send along invoice
                    // only if sale id is present, we are passing saleData and assignedto details are fetched from sale details,
                    //  otherwise pass saledata as null and assignedto details are fetched from contact details
                    if (!!invoice.saleId) {
                      admin
                        .firestore()
                        .collection("users")
                        .doc(userId)
                        .collection("sales")
                        .doc(invoice.saleId)
                        .get()
                        .then((data2) => {
                          invoice.assignedTo = data2.data().assignedTo;
                          invoice.assignedToName = data2.data().assignedToName;
                          invoice.saleData = data2.data();

                          // console.log(invoice)
                          AllRules.forEach((rule) => {
                            if (eval(rule.data().condition))
                              eval(
                                rule.data().do +
                                  "(invoice,rule.data(),'invoice',userId)"
                              );
                          });
                        });
                    } else {
                      invoice.assignedTo = data1.data().assignedTo;
                      invoice.assignedToName = data1.data().assignedToName;
                      invoice.saleData = null;

                      // console.log(invoice)
                      AllRules.forEach((rule) => {
                        if (eval(rule.data().condition))
                          eval(
                            rule.data().do +
                              "(invoice,rule.data(),'invoice',userId)"
                          );
                      });
                    }
                  });
              }
            });
        }
        // res.send(createRules);
      });
  });
exports.invoiceAutomationEdit = functions
  .region(region)
  .firestore.document("/users/{userId}/Invoices/{documentId}")
  .onUpdate((change, context) => {
    var invoice = change.after.data();
    var oldinvoice = change.before.data();

    // var contact = req.body;
    var userId = context.params.userId;
    invoice.saleId = change.after.data().docData.saleID;
    invoice.customerId = change.after.data().customerData.custID;

    var superUserDetails; //superUserDetails

    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("automations")
      .where("queryArray", "array-contains", "invoice")
      .where("active", "==", true)
      .where("editTrigger", "==", true)
      .get()
      .then((data) => {
        // console.log(contact);
        var AllRules = data.docs;
        // console.log(AllRules)

        // console.log(createRules)
        if (AllRules.length > 0) {
          return admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((data1) => {
              superUserDetails = data1.data(); //assiging to variablr
              invoice.superData = superUserDetails;

              var conditionNewUser =
                Date.now() - data1.data().createdDate <
                30 * 24 * 60 * 60 * 1000;
              console.log(conditionNewUser ? "is new USer" : "not new user");
              var conditionPlan = false;
              if (!conditionNewUser) {
                console.log("1");
                if (data1.data().paymentHistory) {
                  var currentPlan = data1
                    .data()
                    .paymentHistory.filter(
                      (el) =>
                        el.currentCycleStartDate * 1000 < Date.now() &&
                        el.currentCycleEnd * 1000 > Date.now()
                    );
                  if (currentPlan.length > 0) {
                    if (currentPlan[0].plan) {
                      if (currentPlan[0].plan == "diamond") {
                        conditionPlan = true;
                        console.log(
                          conditionPlan
                            ? "is diamond user"
                            : "is not diamond user"
                        );
                      }
                    }
                  }
                }
              }
              if (conditionPlan || conditionNewUser) {
                admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("customers")
                  .doc(invoice.customerId)
                  .get()
                  .then((data1) => {
                    invoice.firstName = data1.data().firstName;
                    invoice.email = data1.data().email
                      ? data1.data().email
                      : "";
                    invoice.secondName = data1.data().secondName
                      ? data1.data().secondName
                      : "";
                    invoice.companyName = data1.data().companyName;
                    invoice.code = data1.data().code ? data1.data().code : "";
                    invoice.contactNo = data1.data().contactNo
                      ? data1.data().contactNo
                      : "";

                    invoice.contData = data1.data(); //whole contact send along invoice

                    // only if sale id is present, we are passing saleData and assignedto details are fetched from sale details,
                    //  otherwise pass saledata as null and assignedto details are fetched from contact details
                    if (!!invoice.saleId) {
                      admin
                        .firestore()
                        .collection("users")
                        .doc(userId)
                        .collection("sales")
                        .doc(invoice.saleId)
                        .get()
                        .then((data2) => {
                          invoice.assignedTo = data2.data().assignedTo;
                          invoice.assignedToName = data2.data().assignedToName;
                          // console.log(invoice)

                          invoice.saleData = data2.data();

                          AllRules.forEach((rule) => {
                            if (eval(rule.data().condition))
                              eval(
                                rule.data().do +
                                  "(invoice,rule.data(),'invoice',userId)"
                              );
                          });
                        });
                    } else {
                      invoice.assignedTo = data1.data().assignedTo;
                      invoice.assignedToName = data1.data().assignedToName;
                      invoice.saleData = null;

                      AllRules.forEach((rule) => {
                        if (eval(rule.data().condition))
                          eval(
                            rule.data().do +
                              "(invoice,rule.data(),'invoice',userId)"
                          );
                      });
                    }
                  });
              }
            });
        }
        // res.send(createRules);
      });
  });

// quotation automations
exports.quotationAutomationCreate = functions
  .region(region)
  .firestore.document("/users/{userId}/Quotations/{documentId}")
  .onCreate((snap, context) => {
    var quotation = snap.data();
    // var contact = req.body;
    var userId = context.params.userId;
    quotation.saleId = snap.data().docData.saleID;
    quotation.customerId = snap.data().customerData.custID;

    var superUserDetails;

    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("automations")
      .where("queryArray", "array-contains", "quotation")
      .where("active", "==", true)
      .where("createTrigger", "==", true)
      .get()
      .then((data) => {
        // console.log(contact);
        var AllRules = data.docs;
        // console.log(AllRules)

        // console.log(createRules)
        if (AllRules.length > 0) {
          return admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((data1) => {
              superUserDetails = data1.data(); //assiging to variablr
              quotation.superData = superUserDetails;

              var conditionNewUser =
                Date.now() - data1.data().createdDate <
                30 * 24 * 60 * 60 * 1000;
              console.log(conditionNewUser ? "is new USer" : "not new user");
              var conditionPlan = false;
              if (!conditionNewUser) {
                console.log("1");
                if (data1.data().paymentHistory) {
                  var currentPlan = data1
                    .data()
                    .paymentHistory.filter(
                      (el) =>
                        el.currentCycleStartDate * 1000 < Date.now() &&
                        el.currentCycleEnd * 1000 > Date.now()
                    );
                  if (currentPlan.length > 0) {
                    if (currentPlan[0].plan) {
                      if (currentPlan[0].plan == "diamond") {
                        conditionPlan = true;
                        console.log(
                          conditionPlan
                            ? "is diamond user"
                            : "is not diamond user"
                        );
                      }
                    }
                  }
                }
              }
              if (conditionPlan || conditionNewUser) {
                admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("customers")
                  .doc(quotation.customerId)
                  .get()
                  .then((data1) => {
                    quotation.firstName = data1.data().firstName;
                    quotation.email = data1.data().email
                      ? data1.data().email
                      : "";
                    quotation.secondName = data1.data().secondName
                      ? data1.data().secondName
                      : "";
                    quotation.companyName = data1.data().companyName;
                    quotation.code = data1.data().code ? data1.data().code : "";
                    quotation.contactNo = data1.data().contactNo
                      ? data1.data().contactNo
                      : "";

                    quotation.contData = data1.data();
                    // only if sale id is present, we are passing saleData and assignedto details are fetched from sale details,
                    //  otherwise pass saledata as null and assignedto details are fetched from contact details
                    if (!!quotation.saleId) {
                      admin
                        .firestore()
                        .collection("users")
                        .doc(userId)
                        .collection("sales")
                        .doc(quotation.saleId)
                        .get()
                        .then((data2) => {
                          quotation.assignedTo = data2.data().assignedTo;
                          quotation.assignedToName =
                            data2.data().assignedToName;
                          // console.log(invoice)

                          quotation.saleData = data2.data();

                          AllRules.forEach((rule) => {
                            if (eval(rule.data().condition))
                              eval(
                                rule.data().do +
                                  "(quotation,rule.data(),'quotation',userId)"
                              );
                          });
                        });
                    } else {
                      quotation.assignedTo = data1.data().assignedTo;
                      quotation.assignedToName = data1.data().assignedToName;
                      quotation.saleData = null;

                      AllRules.forEach((rule) => {
                        if (eval(rule.data().condition))
                          eval(
                            rule.data().do +
                              "(quotation,rule.data(),'quotation',userId)"
                          );
                      });
                    }
                  });
              }
            });
        }
        // res.send(createRules);
      });
  });
exports.quotationAutomationEdit = functions
  .region(region)
  .firestore.document("/users/{userId}/Quotations/{documentId}")
  .onUpdate((change, context) => {
    var quotation = change.after.data();
    var oldquotation = change.before.data();
    // var contact = req.body;
    var userId = context.params.userId;
    quotation.saleId = change.after.data().docData.saleID;
    quotation.customerId = change.after.data().customerData.custID;

    var superUserDetails;

    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("automations")
      .where("queryArray", "array-contains", "quotation")
      .where("active", "==", true)
      .where("editTrigger", "==", true)
      .get()
      .then((data) => {
        // console.log(contact);
        var AllRules = data.docs;
        // console.log(AllRules)

        // console.log(createRules)
        if (AllRules.length > 0) {
          return admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((data1) => {
              superUserDetails = data1.data(); //assiging to variablr
              quotation.superData = superUserDetails;

              var conditionNewUser =
                Date.now() - data1.data().createdDate <
                30 * 24 * 60 * 60 * 1000;
              console.log(conditionNewUser ? "is new USer" : "not new user");
              var conditionPlan = false;
              if (!conditionNewUser) {
                console.log("1");
                if (data1.data().paymentHistory) {
                  var currentPlan = data1
                    .data()
                    .paymentHistory.filter(
                      (el) =>
                        el.currentCycleStartDate * 1000 < Date.now() &&
                        el.currentCycleEnd * 1000 > Date.now()
                    );
                  if (currentPlan.length > 0) {
                    if (currentPlan[0].plan) {
                      if (currentPlan[0].plan == "diamond") {
                        conditionPlan = true;
                        console.log(
                          conditionPlan
                            ? "is diamond user"
                            : "is not diamond user"
                        );
                      }
                    }
                  }
                }
              }
              if (conditionPlan || conditionNewUser) {
                admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("customers")
                  .doc(quotation.customerId)
                  .get()
                  .then((data1) => {
                    quotation.firstName = data1.data().firstName;
                    quotation.email = data1.data().email
                      ? data1.data().email
                      : "";
                    quotation.secondName = data1.data().secondName
                      ? data1.data().secondName
                      : "";
                    quotation.companyName = data1.data().companyName;
                    quotation.code = data1.data().code ? data1.data().code : "";
                    quotation.contactNo = data1.data().contactNo
                      ? data1.data().contactNo
                      : "";

                    quotation.contData = data1.data();
                    // only if sale id is present, we are passing saleData and assignedto details are fetched from sale details,
                    //  otherwise pass saledata as null and assignedto details are fetched from contact details
                    if (!!quotation.saleId) {
                      admin
                        .firestore()
                        .collection("users")
                        .doc(userId)
                        .collection("sales")
                        .doc(quotation.saleId)
                        .get()
                        .then((data2) => {
                          quotation.assignedTo = data2.data().assignedTo;
                          quotation.assignedToName =
                            data2.data().assignedToName;
                          // quotation.log(invoice)

                          quotation.saleData = data2.data();

                          AllRules.forEach((rule) => {
                            if (eval(rule.data().condition))
                              eval(
                                rule.data().do +
                                  "(quotation,rule.data(),'quotation',userId)"
                              );
                          });
                        });
                    } else {
                      quotation.assignedTo = data1.data().assignedTo;
                      quotation.assignedToName = data1.data().assignedToName;
                      quotation.saleData = null;

                      AllRules.forEach((rule) => {
                        if (eval(rule.data().condition))
                          eval(
                            rule.data().do +
                              "(quotation,rule.data(),'quotation',userId)"
                          );
                      });
                    }
                  });
              }
            });
        }
        // res.send(createRules);
      });
  });

// estimate automation

exports.estimateAutomationCreate = functions
  .region(region)
  .firestore.document("/users/{userId}/Estimates/{documentId}")
  .onCreate((snap, context) => {
    var estimate = snap.data();
    // var contact = req.body;
    var userId = context.params.userId;
    estimate.saleId = snap.data().docData.saleID;
    estimate.customerId = snap.data().customerData.custID;

    var superUserDetails;

    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("automations")
      .where("queryArray", "array-contains", "estimate")
      .where("active", "==", true)
      .where("createTrigger", "==", true)
      .get()
      .then((data) => {
        // console.log(contact);
        var AllRules = data.docs;
        // console.log(AllRules)

        // console.log(createRules)
        if (AllRules.length > 0) {
          return admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((data1) => {
              superUserDetails = data1.data(); //assiging to variablr
              estimate.superData = superUserDetails;

              var conditionNewUser =
                Date.now() - data1.data().createdDate <
                30 * 24 * 60 * 60 * 1000;
              console.log(conditionNewUser ? "is new USer" : "not new user");
              var conditionPlan = false;
              if (!conditionNewUser) {
                console.log("1");
                if (data1.data().paymentHistory) {
                  var currentPlan = data1
                    .data()
                    .paymentHistory.filter(
                      (el) =>
                        el.currentCycleStartDate * 1000 < Date.now() &&
                        el.currentCycleEnd * 1000 > Date.now()
                    );
                  if (currentPlan.length > 0) {
                    if (currentPlan[0].plan) {
                      if (currentPlan[0].plan == "diamond") {
                        conditionPlan = true;
                        console.log(
                          conditionPlan
                            ? "is diamond user"
                            : "is not diamond user"
                        );
                      }
                    }
                  }
                }
              }
              if (conditionPlan || conditionNewUser) {
                admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("customers")
                  .doc(estimate.customerId)
                  .get()
                  .then((data1) => {
                    estimate.firstName = data1.data().firstName;
                    estimate.email = data1.data().email
                      ? data1.data().email
                      : "";
                    estimate.secondName = data1.data().secondName
                      ? data1.data().secondName
                      : "";
                    estimate.companyName = data1.data().companyName;
                    estimate.code = data1.data().code ? data1.data().code : "";
                    estimate.contactNo = data1.data().contactNo
                      ? data1.data().contactNo
                      : "";

                    estimate.contData = data1.data();
                    // only if sale id is present, we are passing saleData and assignedto details are fetched from sale details,
                    //  otherwise pass saledata as null and assignedto details are fetched from contact details
                    if (!!estimate.saleId) {
                      admin
                        .firestore()
                        .collection("users")
                        .doc(userId)
                        .collection("sales")
                        .doc(estimate.saleId)
                        .get()
                        .then((data2) => {
                          estimate.assignedTo = data2.data().assignedTo;
                          estimate.assignedToName = data2.data().assignedToName;
                          // console.log(invoice)

                          estimate.saleData = data2.data();

                          AllRules.forEach((rule) => {
                            if (eval(rule.data().condition))
                              eval(
                                rule.data().do +
                                  "(estimate,rule.data(),'estimate',userId)"
                              );
                          });
                        });
                    } else {
                      estimate.assignedTo = data1.data().assignedTo;
                      estimate.assignedToName = data1.data().assignedToName;
                      estimate.saleData = null;

                      AllRules.forEach((rule) => {
                        if (eval(rule.data().condition))
                          eval(
                            rule.data().do +
                              "(estimate,rule.data(),'estimate',userId)"
                          );
                      });
                    }
                  });
              }
            });
        }
        // res.send(createRules);
      });
  });
exports.estimateAutomationEdit = functions
  .region(region)
  .firestore.document("/users/{userId}/Estimates/{documentId}")
  .onUpdate((change, context) => {
    var estimate = change.after.data();
    var oldestimate = change.before.data();
    // var contact = req.body;
    var userId = context.params.userId;
    estimate.saleId = change.after.data().docData.saleID;
    estimate.customerId = change.after.data().customerData.custID;

    var superUserDetails;

    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("automations")
      .where("queryArray", "array-contains", "estimate")
      .where("active", "==", true)
      .where("editTrigger", "==", true)
      .get()
      .then((data) => {
        // console.log(contact);
        var AllRules = data.docs;
        // console.log(AllRules)

        // console.log(createRules)
        if (AllRules.length > 0) {
          return admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((data1) => {
              superUserDetails = data1.data(); //assiging to variablr
              estimate.superData = superUserDetails;

              var conditionNewUser =
                Date.now() - data1.data().createdDate <
                30 * 24 * 60 * 60 * 1000;
              console.log(conditionNewUser ? "is new USer" : "not new user");
              var conditionPlan = false;
              if (!conditionNewUser) {
                console.log("1");
                if (data1.data().paymentHistory) {
                  var currentPlan = data1
                    .data()
                    .paymentHistory.filter(
                      (el) =>
                        el.currentCycleStartDate * 1000 < Date.now() &&
                        el.currentCycleEnd * 1000 > Date.now()
                    );
                  if (currentPlan.length > 0) {
                    if (currentPlan[0].plan) {
                      if (currentPlan[0].plan == "diamond") {
                        conditionPlan = true;
                        console.log(
                          conditionPlan
                            ? "is diamond user"
                            : "is not diamond user"
                        );
                      }
                    }
                  }
                }
              }
              if (conditionPlan || conditionNewUser) {
                admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("customers")
                  .doc(estimate.customerId)
                  .get()
                  .then((data1) => {
                    estimate.firstName = data1.data().firstName;
                    estimate.email = data1.data().email
                      ? data1.data().email
                      : "";
                    estimate.secondName = data1.data().secondName
                      ? data1.data().secondName
                      : "";
                    estimate.companyName = data1.data().companyName;
                    estimate.code = data1.data().code ? data1.data().code : "";
                    estimate.contactNo = data1.data().contactNo
                      ? data1.data().contactNo
                      : "";

                    estimate.contData = data1.data();
                    // only if sale id is present, we are passing saleData and assignedto details are fetched from sale details,
                    //  otherwise pass saledata as null and assignedto details are fetched from contact details
                    if (!!estimate.saleId) {
                      admin
                        .firestore()
                        .collection("users")
                        .doc(userId)
                        .collection("sales")
                        .doc(estimate.saleId)
                        .get()
                        .then((data2) => {
                          estimate.assignedTo = data2.data().assignedTo;
                          estimate.assignedToName = data2.data().assignedToName;
                          // quotation.log(invoice)

                          estimate.saleData = data2.data();

                          AllRules.forEach((rule) => {
                            if (eval(rule.data().condition))
                              eval(
                                rule.data().do +
                                  "(estimate,rule.data(),'estimate',userId)"
                              );
                          });
                        });
                    } else {
                      estimate.assignedTo = data1.data().assignedTo;
                      estimate.assignedToName = data1.data().assignedToName;
                      estimate.saleData = null;

                      AllRules.forEach((rule) => {
                        if (eval(rule.data().condition))
                          eval(
                            rule.data().do +
                              "(estimate,rule.data(),'estimate',userId)"
                          );
                      });
                    }
                  });
              }
            });
        }
        // res.send(createRules);
      });
  });
exports.colletcionAutomationCreate = functions
  .region(region)
  .firestore.document("/users/{userId}/paymentsreceived/{documentId}")
  .onCreate((snap, context) => {
    var collection = snap.data();
    // var contact = req.body;
    var userId = context.params.userId;
    collection.saleId = snap.data().saleid;
    // collection.customerId = snap.data().customerData.custID;

    var superUserDetails;

    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("automations")
      .where("queryArray", "array-contains", "collection")
      .where("active", "==", true)
      .where("createTrigger", "==", true)
      .get()
      .then((data) => {
        // console.log(contact);
        var AllRules = data.docs;
        // console.log(AllRules)

        // console.log(createRules)
        if (AllRules.length > 0) {
          return admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((data1) => {
              superUserDetails = data1.data(); //assiging to variablr
              collection.superData = superUserDetails;

              var conditionNewUser =
                Date.now() - data1.data().createdDate <
                30 * 24 * 60 * 60 * 1000;
              console.log(conditionNewUser ? "is new USer" : "not new user");
              var conditionPlan = false;
              if (!conditionNewUser) {
                console.log("1");
                if (data1.data().paymentHistory) {
                  var currentPlan = data1
                    .data()
                    .paymentHistory.filter(
                      (el) =>
                        el.currentCycleStartDate * 1000 < Date.now() &&
                        el.currentCycleEnd * 1000 > Date.now()
                    );
                  if (currentPlan.length > 0) {
                    if (currentPlan[0].plan) {
                      if (currentPlan[0].plan == "diamond") {
                        conditionPlan = true;
                        console.log(
                          conditionPlan
                            ? "is diamond user"
                            : "is not diamond user"
                        );
                      }
                    }
                  }
                }
              }
              if (conditionPlan || conditionNewUser) {
                admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("customers")
                  .doc(collection.customerId)
                  .get()
                  .then((data1) => {
                    collection.firstName = data1.data().firstName;
                    collection.email = data1.data().email
                      ? data1.data().email
                      : "";
                    collection.secondName = data1.data().secondName
                      ? data1.data().secondName
                      : "";
                    collection.companyName = data1.data().companyName;
                    collection.code = data1.data().code
                      ? data1.data().code
                      : "";
                    collection.contactNo = data1.data().contactNo
                      ? data1.data().contactNo
                      : "";

                    collection.contData = data1.data();

                    if (!!collection.saleid) {
                      admin
                        .firestore()
                        .collection("users")
                        .doc(userId)
                        .collection("sales")
                        .doc(collection.saleid)
                        .get()
                        .then((data2) => {
                          collection.assignedTo = data2.data().assignedTo;
                          collection.assignedToName =
                            data2.data().assignedToName;
                          // console.log(invoice)

                          collection.saleData = data2.data();

                          AllRules.forEach((rule) => {
                            if (eval(rule.data().condition))
                              eval(
                                rule.data().do +
                                  "(collection,rule.data(),'collection',userId)"
                              );
                          });
                        });
                    } else {
                      collection.assignedTo = data1.data().assignedTo;
                      collection.assignedToName = data1.data().assignedToName;
                      collection.saleData = null;

                      AllRules.forEach((rule) => {
                        if (eval(rule.data().condition))
                          eval(
                            rule.data().do +
                              "(collection,rule.data(),'collection',userId)"
                          );
                      });
                    }
                  });
              }
            });
        }
        // res.send(createRules);
      });
  });
exports.collectionAutomationEdit = functions
  .region(region)
  .firestore.document("/users/{userId}/paymentsreceived/{documentId}")
  .onUpdate((change, context) => {
    var collection = change.after.data();
    var oldcollection = change.before.data();
    // var contact = req.body;
    var userId = context.params.userId;
    collection.saleId = collection.saleid;
    // estimate.customerId = change.after.data().customerData.custID;

    var superUserDetails;

    return admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("automations")
      .where("queryArray", "array-contains", "collection")
      .where("active", "==", true)
      .where("editTrigger", "==", true)
      .get()
      .then((data) => {
        // console.log(contact);
        var AllRules = data.docs;
        // console.log(AllRules)

        // console.log(createRules)
        if (AllRules.length > 0) {
          return admin
            .firestore()
            .collection("users")
            .doc(userId)
            .get()
            .then((data1) => {
              superUserDetails = data1.data(); //assiging to variablr
              collection.superData = superUserDetails;

              var conditionNewUser =
                Date.now() - data1.data().createdDate <
                30 * 24 * 60 * 60 * 1000;
              console.log(conditionNewUser ? "is new USer" : "not new user");
              var conditionPlan = false;
              if (!conditionNewUser) {
                console.log("1");
                if (data1.data().paymentHistory) {
                  var currentPlan = data1
                    .data()
                    .paymentHistory.filter(
                      (el) =>
                        el.currentCycleStartDate * 1000 < Date.now() &&
                        el.currentCycleEnd * 1000 > Date.now()
                    );
                  if (currentPlan.length > 0) {
                    if (currentPlan[0].plan) {
                      if (currentPlan[0].plan == "diamond") {
                        conditionPlan = true;
                        console.log(
                          conditionPlan
                            ? "is diamond user"
                            : "is not diamond user"
                        );
                      }
                    }
                  }
                }
              }
              if (conditionPlan || conditionNewUser) {
                admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("customers")
                  .doc(collection.customerId)
                  .get()
                  .then((data1) => {
                    collection.firstName = data1.data().firstName;
                    collection.email = data1.data().email
                      ? data1.data().email
                      : "";
                    collection.secondName = data1.data().secondName
                      ? data1.data().secondName
                      : "";
                    collection.companyName = data1.data().companyName;
                    collection.code = data1.data().code
                      ? data1.data().code
                      : "";
                    collection.contactNo = data1.data().contactNo
                      ? data1.data().contactNo
                      : "";

                    collection.contData = data1.data();

                    if (!!collection.saleid) {
                      admin
                        .firestore()
                        .collection("users")
                        .doc(userId)
                        .collection("sales")
                        .doc(collection.saleid)
                        .get()
                        .then((data2) => {
                          collection.assignedTo = data2.data().assignedTo;
                          collection.assignedToName =
                            data2.data().assignedToName;
                          // quotation.log(invoice)

                          collection.saleData = data2.data();

                          AllRules.forEach((rule) => {
                            if (eval(rule.data().condition))
                              eval(
                                rule.data().do +
                                  "(collection,rule.data(),'collection',userId)"
                              );
                          });
                        });
                    } else {
                      collection.assignedTo = data1.data().assignedTo;
                      collection.assignedToName = data1.data().assignedToName;
                      collection.saleData = null;

                      AllRules.forEach((rule) => {
                        if (eval(rule.data().condition))
                          eval(
                            rule.data().do +
                              "(collection,rule.data(),'collection',userId)"
                          );
                      });
                    }
                  });
              }
            });
        }
        // res.send(createRules);
      });
  });

exports.contactautomationTest = functions
  .region(region)
  .https.onRequest((req, res) => {
    res.set("Access-Control-Allow-Origin", path);
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        // console.log("function called");
        // console.log(req.body);
        date = new Date();
        date.setHours(0, 0, 0);
        console.log(date);
        date2 = date.getTime();
        console.log(date2);
        date3 = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
        console.log(new Date(date3));
        const utcOffset = 330;
        date4 = addDays(date2, 2, utcOffset);
        console.log(date4);

        res.send("ok");
      });
    }
  });

function createTask(data, rule, type, userId) {
  const superUserData = data.superData;
  let taskAddtFields = []; //to save superuser task additional field
  let taskAddFArray = {}; // to create additionalFieldsArr field of task document
  let taskStatus = rule.data.status; //task status to be assigned
  let utcOffset;
  if (!!superUserData) {
    utcOffset = superUserData.tzOffset.utcOffset;
  } else {
    utcOffset = 330;
  }
  // console.log(userId)
  if (type == "contact") {
    var contact = data;
    contact.saleId = null;
    contact.saleTitle = null;
    // console.log(contact);
  } else if (type == "sale") {
    var sale = data;
  } else if (type == "invoice") {
    var invoice = data;
  } else if (type == "estimate") {
    var estimate = data;
  } else if (type == "quotation") {
    var quotation = data;
  } else if (type == "collection") var collection = data;
  else if (type == "service") var service = data;

  var date = null;
  if (rule.data.dueDateType) {
    if (rule.data.dueDateType.type == "firebasetimestamp") {
      var date1 = eval(rule.data.dueDateType.value);
      if (!!date1) var date = date1.toDate();
      // console.log(date1);
      // console.log(date);
    } else if (rule.data.dueDateType.type == "timestamp") {
      var date1 = eval(rule.data.dueDateType.value);
      if (!!date1) var date = new Date(date1);
      // console.log(date1);
      // console.log(date);
    }
  } else {
    var date = new Date();
  }

  // task additional field code changes starts here
  if (!!superUserData.customFieldsTask)
    taskAddtFields = superUserData.customFieldsTask;

  taskAddtFields.forEach((field, index) => {
    taskAddFArray[index] = {
      fieldValue: field.defaultValue,
    };
  });
  // task additionAL field code changes ends here

  // fetch task status from superuser
  if(!!superUserData.taskStatusOpn){
    if(superUserData.taskStatusOpn.length>0){
      taskStatus = superUserData.taskStatusOpn[0];
    }
  }

  if (!!date) {
    var dueDateIncrementer =
      rule.data.dateAfterorBefore == "+"
        ? Math.abs(Number(rule.data.dueDate))
        : -Math.abs(Number(rule.data.dueDate));
    var taskData = {
      // new field starts here
      changeLog: eval(rule.data.changeLog),
      associatedBranch: eval(rule.data.associatedBranch),
      additionalFieldsArr: taskAddFArray,
      createdByName: eval(rule.data.createdByName),
      lastModifiedDate: eval(rule.data.lastModifiedDate),
      orgId: eval(rule.data.orgId),
      surname: eval(rule.data.surname),
      // new field ends here
      assignedTo: eval(rule.data.assignedTo),
      assignedToName: eval(rule.data.assignedToName),
      company: eval(rule.data.company),
      createdBy: rule.data.createdBy,
      customerId: eval(rule.data.customerId),
      description: eval(rule.data.description),
      date: Date.now(),
      dueDate: addDays(date, dueDateIncrementer, utcOffset),
      lastName: eval(rule.data.lastName),
      name: eval(rule.data.name),
      priority: rule.data.priority,
      saleId: eval(rule.data.saleId),
      saleTitle: eval(rule.data.saleTitle),
      serviceId: eval(rule.data.serviceId),
      serviceTitle: eval(rule.data.serviceTitle),
      saleOrServ: rule.data.saleOrServ,
      status: taskStatus,
      title: eval(rule.data.title),
      assignedToDate: new Date().getTime(),
    };
    // console.log(taskData)
    return admin
      .firestore()
      .collection("/users/" + userId + "/tasks")
      .add(taskData)
      .then((data) => {
        // console.log(data);
      });
  }
}
function createfollowupTask(data, rule, type, userId) {
  // console.log("RULE IN FOLLOW UP CREATE",rule)
  const superUserData = data.superData;
  let followUpAddtFields = []; //to save superuser followup additional field
  let follAddFArray = {}; // to create additionalFieldsArr field of followup document
  let utcOffset;
  if (!!superUserData) {
    utcOffset = superUserData.tzOffset.utcOffset;
  } else {
    utcOffset = 330;
  }
  // console.log(userId)
  if (type == "contact") {
    var contact = data;
    contact.saleId = null;
    contact.saleTitle = null;
    // console.log(contact);
  } else if (type == "sale") {
    var sale = data;
  } else if (type == "followup") {
    var followup = data;
  } else if (type == "service") {
    var service = data;
  }
  var date = null;
  if (rule.data.dueDateType) {
    if (rule.data.dueDateType.type == "firebasetimestamp") {
      // console.log(rule.data.dueDateType);
      var date1 = eval(rule.data.dueDateType.value);
      // console.log(date1);
      if (!!date1) var date = date1.toDate();
      // console.log(date1);
      // console.log("date is-" + date);
    } else if (rule.data.dueDateType.type == "timestamp") {
      var date1 = eval(rule.data.dueDateType.value);
      var date = new Date(date1);
      // console.log(date1);
      // console.log(date);
    }
  } else {
    var date = new Date();
  }
  console.log(date);

  // followup additional field code change starts here
  if (!!superUserData.customFieldsFollowUp)
    followUpAddtFields = superUserData.customFieldsFollowUp;

  followUpAddtFields.forEach((field, index) => {
    follAddFArray[index] = {
      fieldValue: field.defaultValue,
    };
  });
  // followup addi field code changes ends here

  if (!!date) {
    // console.log(rule.data.followUpDate);
    var dueDateIncrementer =
      rule.data.dateAfterorBefore == "+"
        ? Math.abs(Number(rule.data.followUpDate))
        : -Math.abs(Number(rule.data.followUpDate));
    // var date = new Date(Date.now());
    // var time=(((date.getUTCHours()+'').length==2?date.getUTCHours():'0'+date.getUTCHours())+":"+((date.getUTCMinutes()+'').length==2?date.getUTCMinutes():'0'+date.getUTCMinutes()))
    var followupData = {
      // newly added fields starts here
      changeLog: eval(rule.data.changeLog),
      createdBy: eval(rule.data.createdBy),
      associatedBranch: eval(rule.data.associatedBranch),
      additionalFieldsArr: follAddFArray,
      orgId: eval(rule.data.orgId),
      outcome: eval(rule.data.outcome),
      status: eval(rule.data.status),
      // newly added fields ends here
      assignedTo: eval(rule.data.assignedTo),
      assignedToName: eval(rule.data.assignedToName),
      companyName: eval(rule.data.companyName),
      completedStatus: false,
      customerId: eval(rule.data.customerId),
      customerName: eval(rule.data.customerName),
      dateCreated: Date.now(),
      callStartDate: addDays(date, dueDateIncrementer, utcOffset),
      callStartTime: null,
      saleId: eval(rule.data.saleId),
      saleTitle: eval(rule.data.saleTitle),
      serviceId: eval(rule.data.serviceId),
      serviceTitle: eval(rule.data.serviceTitle),
      notes: eval(rule.data.notes),
      direction: "Outbound",
      assignedToDate: new Date().getTime(),
      lastModifiedDate: new Date().getTime()
    };
    return admin
      .firestore()
      .collection("/users/" + userId + "/Follow Ups")
      .add(followupData)
      .then((data) => {
        // console.log(data);
      });
  }
}
// to set dueDate while creating task/followup
function addDays(date1, days, utcOffset) {
  // console.log('date1.getTimezoneOffset()', date1.getTimezoneOffset()*60000)
  // if (!!utcOffset) {
  //   const offset = utcOffset / 60;
  //   var date2 =
  //     date1.getTime() - date1.getTimezoneOffset() * 60000 + offset * 3600000;
  //   return new Date(date2 + days * 24 * 60 * 60 * 1000);
  // } else {
  //   return new Date(date1.getTime() + days * 24 * 60 * 60 * 1000);
  // }
  return new Date(date1.getTime() + days * 24 * 60 * 60 * 1000);
}
// to convert date and time from timestamp to string
function convertDateTime(date, tz) {
  let tZone;
  if (tz && tz !== "" && tz !== null && tz.length > 0) {
    tZone = tz;
  } else {
    tZone = "Asia/Calcutta";
  }
  if (date && typeof date === "object") {
    const n = date.toDate();

    let d = n.toLocaleString("en-GB", { timeZone: tZone });
    return d;
  } else {
    return "Invalid date/date not provided";
  }
}
// to convert date from timestamp to string
function convertDate(date, tz) {
  let tZone;
  if (tz && tz !== "" && tz !== null && tz.length > 0) {
    tZone = tz;
  } else {
    tZone = "Asia/Calcutta";
  }
  if (!!date && typeof date === "object") {
    console.log("date", date);
    const n = date.toDate();

    let d = n.toLocaleDateString("en-GB", { timeZone: tZone });
    return d;
  } else {
    return "Invalid date/date not provided";
  }
}
// to convert date and time from json object to string
function convertDateTimeCallable(date, tz) {
  let tZone;
  if (tz && tz !== "" && tz !== null && tz.length > 0) {
    tZone = tz;
  } else {
    tZone = "Asia/Calcutta";
  }

  if (!!date && typeof date === "object") {
    const n = new Date(date.seconds * 1000);

    let d = n.toLocaleString("en-GB", { timeZone: tZone });

    return d;
  } else {
    return "Invalid date/date not provided";
  }
}
// to convert date from json object to string
function convertDateCallable(date, tz) {
  let tZone;
  if (tz && tz !== "" && tz !== null && tz.length > 0) {
    tZone = tz;
  } else {
    tZone = "Asia/Calcutta";
  }

  if (!!date && typeof date === "object") {
    const n = new Date(date.seconds * 1000);

    let d = n.toLocaleDateString("en-GB", { timeZone: tZone });

    return d;
  } else {
    return "Invalid date/date not provided";
  }
}
// to get the statuas name of contact from statusId field
function getStatusName(pipelineArray, pipelineId, statusId) {
  // console.log('pipelineArray 3rdd', pipelineArray)
  // console.log('getstatusname fn', pipelineId, statusId)

  // console.log('pipelineArray.length', pipelineArray.length)
  if(pipelineArray.length > 0){
    for(let i=0; i<pipelineArray.length; i++){
      //console.log('pipelineArray[i].pipelineId', pipelineArray[i].pipelineId)
      if(pipelineId === pipelineArray[i].pipelineId){
        //console.log('if')
        const statusArray = pipelineArray[i].pipelineStages.map(({ name, stageId }) => ({
          name,
          stageId,
        }));
        //console.log(statusArray)
        if (statusArray.length > 0) {
          var resultStatus = statusArray.filter((obj) => {
            return obj.stageId === statusId;
          });
          const statusName = resultStatus[0].name;
          console.log(statusName);
          return statusName;
        }
      }
    }
  }

  // comment starts

  // var result = pipelineArray.filter((obj) => {
  //   return obj.pipelineId === pipelineId;
  // });
  // console.log(result)
  // if (result.length > 0) {
  //   const statusArray = result[0].pipelineStages.map(({ name, stageId }) => ({
  //     name,
  //     stageId,
  //   }));
  //   console.log(statusArray)
  //   if (statusArray.length > 0) {
  //     var resultStatus = statusArray.filter((obj) => {
  //       return obj.stageId === statusId;
  //     });
  //     const statusName = resultStatus[0].name;
  //     console.log(statusName);
  //     return statusName;
  //   } else {
  //     return stageId;
  //   }
  // } else {
  //   return stageId;
  // }

  // comment ends
}
// function convertDate(date) {
//   if (date) {
//     // .toLocaleDateString('en-GB')
//     //console.log(date);
//     //console.log(date.toDate());
//     var offset = 5.5;
//     var d = new Date(new Date(date.toDate()).getTime() + offset * 3600 * 1000);
//     // .toUTCString().replace( / GMT$/, "" )
//     // var d = new Date(date.toDate());
//     //console.log(d)
//     //console.log(d.getDate())
//     //console.log(d.getMonth())
//     //console.log(d.getFullYear())
//     let month = "" + (d.getMonth() + 1);
//     let day = "" + d.getDate();
//     let year = d.getFullYear();

//     if (month.length < 2) month = "0" + month;
//     if (day.length < 2) day = "0" + day;

//     return [day, month, year].join("-");
//   } else return "Date is not provided";
// }

function updateStage(data, rule, type, userId) {
  if (rule.data.docType == "contact") {
    if (data.contData.selectedContactPipeline == rule.data.pipeline) {
      
      //get customer details using custId
      return admin
      .firestore()
      .doc("users/" + userId + "/customers/" + data.customerId)
      .get()
      .then(async (custData) => {
        if(custData){
          let customerData = custData.data(); 
          let changeLog = customerData.changeLog ? customerData.changeLog : {};
          let prevStatus = '';
          let curStatus = '';
          let pipelineArray = await getContactPipelines(userId);
          let customerPipelines = pipelineArray.customerPipelines;
          let valueFromArray = customerPipelines.find((ele) => ele.pipelineId === rule.data.pipeline)
          let lastStageValue = valueFromArray.pipelineStages[valueFromArray.pipelineStages.length - 1].stageId;
          if(customerPipelines){
            //get previous and current status name
            prevStatus = getStatusName(customerPipelines, customerData.selectedContactPipeline, customerData.status);
            curStatus = getStatusName(customerPipelines, customerData.selectedContactPipeline, rule.data.toValue);
          }
          if(rule.data.fromValue === lastStageValue){
            rejectionReasonValue = null;
          }else{
            rejectionReasonValue = customerData.rejectionReasonValue;
          }

          //add the change to changelog
          changeLog[Object.keys(changeLog).length] = {
            changesFrom: "Automation",
            changedBy: userId,
            changedByName: 'By Automation',
            previousValues: {'status': prevStatus},
            currentValues: {'status': curStatus},
            dateModified: new Date().getTime(),
          };
          
          if (rule.data.fromValue == "any") {
            return admin
              .firestore()
              .doc("/users/" + userId + "/customers/" + data.customerId)
              .update({ status: rule.data.toValue, changeLog: changeLog });
          } else if (data.contData.status == rule.data.fromValue) {
            return admin
              .firestore()
              .doc("/users/" + userId + "/customers/" + data.customerId)
              .update({ status: rule.data.toValue, changeLog: changeLog,rejectionReasonValue:rejectionReasonValue });
          }
        }
      })
      
    }
  }
  if (rule.data.docType == "sale") {
    if (data.saleData.selectedSalePipeline == rule.data.pipeline) {
      //get sale details using saleId
      return admin
      .firestore()
      .doc("users/" + userId + "/sales/" + data.saleId)
      .get()
      .then(async (salesData) => {
        if(salesData){
          let saleData = salesData.data(); 
          let changeLog = saleData.changeLog ? saleData.changeLog : {};
          let prevStage = '';
          let curStage = '';
          let pipelineArray = await getSalePipelines(userId);
          let salePipelines = pipelineArray.salePipelines;
          let valueFromArray = salePipelines.find((ele) => ele.pipelineId === rule.data.pipeline)
          let lastStageValue = valueFromArray.pipelineStages[valueFromArray.pipelineStages.length - 1].stageId
          if(salePipelines){
            //get previous and current status name
            prevStage = getStatusName(salePipelines, saleData.selectedSalePipeline, saleData.salesStage);
            curStage = getStatusName(salePipelines, saleData.selectedSalePipeline, rule.data.toValue);
          }
          if(rule.data.fromValue === lastStageValue){
            rejectionReasonValue = null;
          }else{
            rejectionReasonValue = saleData.rejectionReasonValue;
          }
          //add the change to changelog
          changeLog[Object.keys(changeLog).length] = {
            changesFrom: "Automation",
            changedBy: userId,
            changedByName: 'By Automation',
            previousValues: {'salesStage': prevStage},
            currentValues: {'salesStage': curStage},
            dateModified: new Date().getTime(),
          };
          if (rule.data.fromValue == "any") {
            return admin
              .firestore()
              .doc("/users/" + userId + "/sales/" + data.saleId)
              .update({ salesStage: rule.data.toValue, changeLog: changeLog });
          } else if (data.saleData.salesStage == rule.data.fromValue) {
            return admin
              .firestore()
              .doc("/users/" + userId + "/sales/" + data.saleId)
              .update({ salesStage: rule.data.toValue, changeLog: changeLog,rejectionReasonValue:rejectionReasonValue });
          }
        }
      })
    }
  }
}
//send Email function for automation
function sendEmail(data, rule, type, userId) {
  // console.log(rule)
  // var template = {};
  var emailData = {
    to: "",
    subject: "",
    cc: "",
    html: "",
  };
  var assignedTo;
  var superUserDetails = data.superData;
  var contactPipelines = []; //contact pipelines saved under pipelines collections of a superuser
  var salePipelines = []; //sale pipelines saved under pipelines collections of a superuser
  var servicePipelines = []; //service pipelines saved under pipelines collections of a superuser

  if (type == "contact") {
    var contact = data;
    contact.saleId = null;
    contact.saleTitle = null;
  } else if (type == "sale") {
    var sale = data;
    var contact = data.contData;
  } else if (type == "service") {
    var service = data;
    var contact = data.contData;
  } else if (type == "invoice") {
    var invoice = data;
    var sale = data.saleData;
    var contact = data.contData;
  } else if (type == "estimate") {
    var estimate = data;
    var sale = data.saleData;
    var contact = data.contData;
  } else if (type == "quotation") {
    var quotation = data;
    var sale = data.saleData;
    var contact = data.contData;
  } else if (type == "collection") {
    var collection = data;
    var sale = data.saleData;
    var contact = data.contData;
  } else if (type == "service") {
    var service = data;
    var sale = data.saleData;
    var contact = data.contData;
  }
  getContactPipelines(userId).then(pipeline=>{
    contactPipelines = pipeline.customerPipelines;
    getassignedToUser(data.assignedTo).then((assUser) => {
      assignedTo = assUser;
      if (assignedTo) {
        getEmailTemplate(userId, rule.data.templateId).then((template) => {
          if (template) {
            emailData.to = eval(rule.data.To);
            emailData.subject = template.subject;
            emailData.cc = rule.data.cc ? rule.data.cc : "";
            if (type == "contact") {
              emailData.html = template.body
                .replace(/\#\[contact.Company Name\]/g, contact.companyName)
                .replace(/\#\[contact.First Name\]/g, contact.firstName)
                .replace(
                  /\#\[contact.Second Name\]/g,
                  contact.secondName ? contact.secondName : ""
                )
                .replace(
                  /\#\[contact.Contact No\]/g,
                  contact.contactNo ? contact.contactNo : ""
                )
                .replace(
                  /\#\[contact.Email\]/g,
                  contact.email ? contact.email : ""
                )
                .replace(/\#\[contact.Priority\]/g, contact.priority)
                .replace(/\#\[contact.Status\]/g, getStatusName(contactPipelines,contact.selectedContactPipeline,contact.status))
                .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
                .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
                .replace(
                  /\#\[user.Last Name\]/g,
                  assignedTo.lastname ? assignedTo.lastname : ""
                )
                .replace(
                  /\#\[user.Contact No\]/g,
                  assignedTo.phone ? assignedTo.phone : ""
                )
                .replace(
                  /\#\[user.Email\]/g,
                  assignedTo.email ? assignedTo.email : ""
                );

              if (superUserDetails.customFieldsContact) {
                let teststring = emailData.html;
                for (
                  let i = 0;
                  i < superUserDetails.customFieldsContact.length;
                  i++
                ) {
                  if (superUserDetails.customFieldsContact[i].isActive === true) {
                    var str1 =
                      "\\#\\[contact." +
                      superUserDetails.customFieldsContact[i].fieldName +
                      "\\]";
                    var re = new RegExp(str1, "g");
                    teststring = teststring.replace(
                      re,
                      contact.additionalFieldsArr[i + ""]
                        ? contact.additionalFieldsArr[i + ""].fieldValue
                          ? superUserDetails.customFieldsContact[i].fieldType ==
                            "date"
                            ? convertDate(
                                contact.additionalFieldsArr[i + ""].fieldValue,
                                superUserDetails.timeZone
                              )
                            : superUserDetails.customFieldsContact[i].fieldType ==
                              "date_time"
                            ? convertDateTime(
                                contact.additionalFieldsArr[i + ""].fieldValue,
                                superUserDetails.timeZone
                              )
                            : contact.additionalFieldsArr[i + ""].fieldValue
                          : ""
                        : ""
                    );
                  }
                }
                emailData.html = teststring;
              }
              addtoautomatedMail(emailData, userId);
            } else if (type == "sale") {
              getSalePipelines(userId).then(salePipeline=>{
                salePipelines = salePipeline.salePipelines;
                if (contact) {
                  // customername = sale.firstName + " " + sale.secondName;
                  emailData.html = template.body
                    .replace(
                      /\#\[sale.Sale Title\]/g,
                      sale.saleTitle ? sale.saleTitle : ""
                    )
                    .replace(
                      /\#\[sale.Estimated Value\]/g,
                      sale.estimatedValue ? sale.estimatedValue : ""
                    )
                    .replace(
                      /\#\[sale.Start Date\]/g,
                      convertDate(sale.startDate, superUserDetails.timeZone)
                    )
                    .replace(
                      /\#\[sale.Expected Completion Date\]/g,
                      convertDate(sale.expCompletionDate, superUserDetails.timeZone)
                    )
                    .replace(/\#\[sale.Stage\]/g, getStatusName(salePipelines, sale.selectedSalePipeline,sale.salesStage))
                    .replace(/\#\[sale.Priority\]/g, sale.priority)
                    .replace(/\#\[sale.Assigned To\]/g, sale.assignedToName)
                    .replace(
                      /\#\[sale.Description\]/g,
                      sale.description ? sale.description : ""
                    )
                    .replace(/\#\[contact.Company Name\]/g, contact.companyName)
                    .replace(/\#\[contact.First Name\]/g, contact.firstName)
                    .replace(
                      /\#\[contact.Second Name\]/g,
                      contact.secondName ? contact.secondName : ""
                    )
                    .replace(
                      /\#\[contact.Contact No\]/g,
                      contact.contactNo ? contact.contactNo : ""
                    )
                    .replace(
                      /\#\[contact.Email\]/g,
                      contact.email ? contact.email : ""
                    )
                    .replace(/\#\[contact.Priority\]/g, contact.priority)
                    .replace(/\#\[contact.Status\]/g, getStatusName(contactPipelines,contact.selectedContactPipeline,contact.status))
                    .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
                    .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
                    .replace(
                      /\#\[user.Last Name\]/g,
                      assignedTo.lastname ? assignedTo.lastname : ""
                    )
                    .replace(
                      /\#\[user.Contact No\]/g,
                      assignedTo.phone ? assignedTo.phone : ""
                    )
                    .replace(
                      /\#\[user.Email\]/g,
                      assignedTo.email ? assignedTo.email : ""
                    );

                  // contact additional fields
                  if (superUserDetails.customFieldsContact) {
                    let teststring = emailData.html;
                    for (
                      let i = 0;
                      i < superUserDetails.customFieldsContact.length;
                      i++
                    ) {
                      if (
                        superUserDetails.customFieldsContact[i].isActive === true
                      ) {
                        var str1 =
                          "\\#\\[contact." +
                          superUserDetails.customFieldsContact[i].fieldName +
                          "\\]";
                        var re = new RegExp(str1, "g");
                        teststring = teststring.replace(
                          re,
                          contact.additionalFieldsArr[i + ""]
                            ? contact.additionalFieldsArr[i + ""].fieldValue
                              ? superUserDetails.customFieldsContact[i].fieldType ==
                                "date"
                                ? convertDate(
                                    contact.additionalFieldsArr[i + ""].fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : superUserDetails.customFieldsContact[i]
                                    .fieldType == "date_time"
                                ? convertDateTime(
                                    contact.additionalFieldsArr[i + ""].fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : contact.additionalFieldsArr[i + ""].fieldValue
                              : ""
                            : ""
                        );
                      }
                    }
                    emailData.html = teststring;
                  }

                  // sale additional fields
                  if (superUserDetails.customFieldsSale) {
                    let str = emailData.html;
                    for (
                      let i = 0;
                      i < superUserDetails.customFieldsSale.length;
                      i++
                    ) {
                      if (superUserDetails.customFieldsSale[i].isActive === true) {
                        var str1 =
                          "\\#\\[sale." +
                          superUserDetails.customFieldsSale[i].fieldName +
                          "\\]";
                        var re = new RegExp(str1, "g");
                        str = str.replace(
                          re,
                          sale.additionalFieldsArr[i + ""]
                            ? sale.additionalFieldsArr[i + ""].fieldValue
                              ? superUserDetails.customFieldsSale[i].fieldType ==
                                "date"
                                ? convertDate(
                                    sale.additionalFieldsArr[i + ""].fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : superUserDetails.customFieldsSale[i].fieldType ==
                                  "date_time"
                                ? convertDateTime(
                                    sale.additionalFieldsArr[i + ""].fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : sale.additionalFieldsArr[i + ""].fieldValue
                              : ""
                            : ""
                        );
                      }
                    }
                    emailData.html = str;
                  }
                  addtoautomatedMail(emailData, userId);
                }
              })
            } else if (type == "service") {
              getServicePipelines(userId).then(servicePipeline=>{
                servicePipelines = servicePipeline.servicePipelines;
              if (contact) {
                // customername = service.firstName + " " + service.secondName;
                emailData.html = template.body
                  .replace(
                    /\#\[service.Service Title\]/g,
                    service.serviceTitle ? service.serviceTitle : ""
                  )
                  .replace(
                    /\#\[service.Estimated Value\]/g,
                    service.estimatedValue ? service.estimatedValue : ""
                  )
                  .replace(
                    /\#\[service.Start Date\]/g,
                    convertDate(service.startDate, superUserDetails.timeZone)
                  )
                  .replace(
                    /\#\[service.Expected Completion Date\]/g,
                    convertDate(
                      service.expCompletionDate,
                      superUserDetails.timeZone
                    )
                  )
                  .replace(/\#\[service.Stage\]/g, getStatusName(servicePipelines, service.selectedServPipeline,service.servicesStage))
                  .replace(/\#\[service.Priority\]/g, service.priority)
                  .replace(/\#\[service.Assigned To\]/g, service.assignedToName)
                  .replace(
                    /\#\[service.Description\]/g,
                    service.description ? service.description : ""
                  )
                  .replace(/\#\[contact.Company Name\]/g, contact.companyName)
                  .replace(/\#\[contact.First Name\]/g, contact.firstName)
                  .replace(
                    /\#\[contact.Second Name\]/g,
                    contact.secondName ? contact.secondName : ""
                  )
                  .replace(
                    /\#\[contact.Contact No\]/g,
                    contact.contactNo ? contact.contactNo : ""
                  )
                  .replace(
                    /\#\[contact.Email\]/g,
                    contact.email ? contact.email : ""
                  )
                  .replace(/\#\[contact.Priority\]/g, contact.priority)
                  .replace(/\#\[contact.Status\]/g, getStatusName(contactPipelines,contact.selectedContactPipeline,contact.status))
                  .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
                  .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
                  .replace(
                    /\#\[user.Last Name\]/g,
                    assignedTo.lastname ? assignedTo.lastname : ""
                  )
                  .replace(
                    /\#\[user.Contact No\]/g,
                    assignedTo.phone ? assignedTo.phone : ""
                  )
                  .replace(
                    /\#\[user.Email\]/g,
                    assignedTo.email ? assignedTo.email : ""
                  );
                // contact additional fields
                if (superUserDetails.customFieldsContact) {
                  let teststring = emailData.html;
                  for (
                    let i = 0;
                    i < superUserDetails.customFieldsContact.length;
                    i++
                  ) {
                    if (
                      superUserDetails.customFieldsContact[i].isActive === true
                    ) {
                      var str1 =
                        "\\#\\[contact." +
                        superUserDetails.customFieldsContact[i].fieldName +
                        "\\]";
                      var re = new RegExp(str1, "g");
                      teststring = teststring.replace(
                        re,
                        contact.additionalFieldsArr[i + ""]
                          ? contact.additionalFieldsArr[i + ""].fieldValue
                            ? superUserDetails.customFieldsContact[i].fieldType ==
                              "date"
                              ? convertDate(
                                  contact.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : superUserDetails.customFieldsContact[i]
                                  .fieldType == "date_time"
                              ? convertDateTime(
                                  contact.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : contact.additionalFieldsArr[i + ""].fieldValue
                            : ""
                          : ""
                      );
                    }
                  }
                  emailData.html = teststring;
                }

                // service additional fields
                if (superUserDetails.customFieldsService) {
                  let str = emailData.html;
                  for (
                    let i = 0;
                    i < superUserDetails.customFieldsService.length;
                    i++
                  ) {
                    if (
                      superUserDetails.customFieldsService[i].isActive === true
                    ) {
                      var str1 =
                        "\\#\\[service." +
                        superUserDetails.customFieldsService[i].fieldName +
                        "\\]";
                      var re = new RegExp(str1, "g");
                      str = str.replace(
                        re,
                        service.additionalFieldsArr[i + ""]
                          ? service.additionalFieldsArr[i + ""].fieldValue
                            ? superUserDetails.customFieldsService[i].fieldType ==
                              "date"
                              ? convertDate(
                                  service.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : superUserDetails.customFieldsService[i]
                                  .fieldType == "date_time"
                              ? convertDateTime(
                                  service.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : service.additionalFieldsArr[i + ""].fieldValue
                            : ""
                          : ""
                      );
                    }
                  }
                  emailData.html = str;
                }
                addtoautomatedMail(emailData, userId);
              }
            })
            } else if (type == "invoice") {
              getSalePipelines(userId).then(salePipeline=>{
                salePipelines = salePipeline.salePipelines;
              if (!!invoice && !!assignedTo) {
                emailData.html = template.body
                  .replace(
                    /\#\[invoice.Date\]/g,
                    convertDate(
                      invoice.docData.docDate,
                      superUserDetails.timeZone
                    )
                  )
                  .replace(
                    /\#\[invoice.Doc Prefix\]/g,
                    invoice.docData.docPrefix ? invoice.docData.docPrefix : ""
                  )
                  .replace(
                    /\#\[invoice.Doc No\]/g,
                    invoice.docData.docNumber ? invoice.docData.docNumber : ""
                  )
                  .replace(
                    /\#\[invoice.Due Date\]/g,
                    convertDate(
                      invoice.docData.dueDate,
                      superUserDetails.timeZone
                    )
                  )
                  .replace(
                    /\#\[invoice.Currency\]/g,
                    invoice.docData.currency ? invoice.docData.currency : ""
                  )
                  .replace(
                    /\#\[invoice.Bank Details\]/g,
                    invoice.docData.bankDetails ? invoice.docData.bankDetails : ""
                  )
                  .replace(
                    /\#\[invoice.Amount Including Tax\]/g,
                    invoice.docData.totalInclTax
                      ? invoice.docData.totalInclTax
                      : ""
                  )
                  .replace(
                    /\#\[invoice.Sale\]/g,
                    invoice.docData.saleTitle ? invoice.docData.saleTitle : ""
                  )
                  .replace(
                    /\#\[invoice.Customer\]/g,
                    invoice.customerData.fname1 +
                      " " +
                      (invoice.customerData.sname
                        ? invoice.customerData.sname
                        : "")
                  )
                  .replace(
                    /\#\[invoice.Notes\]/g,
                    invoice.docData.notes ? invoice.docData.notes : ""
                  )
                  .replace(
                    /\#\[invoice.Amount Collected\]/g,
                    invoice.docData.collectedAmount
                      ? invoice.docData.collectedAmount
                      : ""
                  )
                  .replace(
                    /\#\[invoice.Doc URL\]/g,
                    invoice.sharedDocId ? invoice.sharedDocId : ""
                  )
                  .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
                  .replace(
                    /\#\[user.Last Name\]/g,
                    assignedTo.lastname ? assignedTo.lastname : ""
                  )
                  .replace(
                    /\#\[user.Contact No\]/g,
                    assignedTo.phone ? assignedTo.phone : ""
                  )
                  .replace(
                    /\#\[user.Email\]/g,
                    assignedTo.email ? assignedTo.email : ""
                  );

                // rwplacing sale seperately
                if (!!sale) {
                  let teststr1 = emailData.html;
                  teststr1 = teststr1
                    .replace(
                      /\#\[sale.Sale Title\]/g,
                      sale.saleTitle ? sale.saleTitle : ""
                    )
                    .replace(
                      /\#\[sale.Estimated Value\]/g,
                      sale.estimatedValue ? sale.estimatedValue : ""
                    )
                    .replace(
                      /\#\[sale.Start Date\]/g,
                      convertDate(sale.startDate, superUserDetails.timeZone)
                    )
                    .replace(
                      /\#\[sale.Expected Completion Date\]/g,
                      convertDate(
                        sale.expCompletionDate,
                        superUserDetails.timeZone
                      )
                    )
                    .replace(
                      /\#\[sale.Stage\]/g,
                      sale.salesStage ? getStatusName(salePipelines, sale.selectedSalePipeline,sale.salesStage) : ""
                    )
                    .replace(/\#\[sale.Priority\]/g, sale.priority)
                    .replace(/\#\[sale.Assigned To\]/g, sale.assignedToName)
                    .replace(
                      /\#\[sale.Description\]/g,
                      sale.description ? sale.description : ""
                    );

                  emailData.html = teststr1;
                }

                // replacing contact part seperately
                if (!!contact) {
                  let teststr2 = emailData.html;
                  teststr2 = teststr2
                    .replace(
                      /\#\[contact.Company Name\]/g,
                      contact.companyName ? contact.companyName : ""
                    )
                    .replace(/\#\[contact.First Name\]/g, contact.firstName)
                    .replace(
                      /\#\[contact.Second Name\]/g,
                      contact.secondName ? contact.secondName : ""
                    )
                    .replace(
                      /\#\[contact.Contact No\]/g,
                      contact.contactNo ? contact.contactNo : ""
                    )
                    .replace(
                      /\#\[contact.Email\]/g,
                      contact.email ? contact.email : ""
                    )
                    .replace(/\#\[contact.Priority\]/g, contact.priority)
                    .replace(/\#\[contact.Status\]/g, getStatusName(contactPipelines,contact.selectedContactPipeline,contact.status))
                    .replace(
                      /\#\[contact.Assigned To\]/g,
                      contact.assignedToName
                    );

                  emailData.html = teststr2;
                }

                // contact additional fields
                if (!!contact && superUserDetails.customFieldsContact) {
                  let teststring = emailData.html;
                  for (
                    let i = 0;
                    i < superUserDetails.customFieldsContact.length;
                    i++
                  ) {
                    if (
                      superUserDetails.customFieldsContact[i].isActive === true
                    ) {
                      var str1 =
                        "\\#\\[contact." +
                        superUserDetails.customFieldsContact[i].fieldName +
                        "\\]";
                      var re = new RegExp(str1, "g");
                      teststring = teststring.replace(
                        re,
                        contact.additionalFieldsArr[i + ""]
                          ? contact.additionalFieldsArr[i + ""].fieldValue
                            ? superUserDetails.customFieldsContact[i].fieldType ==
                              "date"
                              ? convertDate(
                                  contact.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : superUserDetails.customFieldsContact[i]
                                  .fieldType == "date_time"
                              ? convertDateTime(
                                  contact.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : contact.additionalFieldsArr[i + ""].fieldValue
                            : ""
                          : ""
                      );
                    }
                  }
                  emailData.html = teststring;
                }

                // sale additional fields
                if (!!sale && superUserDetails.customFieldsSale) {
                  let str = emailData.html;
                  for (
                    let i = 0;
                    i < superUserDetails.customFieldsSale.length;
                    i++
                  ) {
                    if (superUserDetails.customFieldsSale[i].isActive == true) {
                      var str1 =
                        "\\#\\[sale." +
                        superUserDetails.customFieldsSale[i].fieldName +
                        "\\]";
                      var re = new RegExp(str1, "g");
                      str = str.replace(
                        re,
                        sale.additionalFieldsArr[i + ""]
                          ? sale.additionalFieldsArr[i + ""].fieldValue
                            ? superUserDetails.customFieldsSale[i].fieldType ==
                              "date"
                              ? convertDate(
                                  sale.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : superUserDetails.customFieldsSale[i].fieldType ==
                                "date_time"
                              ? convertDateTime(
                                  sale.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : sale.additionalFieldsArr[i + ""].fieldValue
                            : ""
                          : ""
                      );
                    }
                  }
                  emailData.html = str;
                }

                // additional fields: customFieldsInvoices
                if (superUserDetails.customFieldsInvoices) {
                  let teststring = emailData.html;
                  for (
                    let i = 0;
                    i < superUserDetails.customFieldsInvoices.length;
                    i++
                  ) {
                    if (
                      superUserDetails.customFieldsInvoices[i].isActive == true
                    ) {
                      var str1 =
                        "\\#\\[invoice." +
                        superUserDetails.customFieldsInvoices[i].fieldName +
                        "\\]";

                      var re = new RegExp(str1, "g");
                      teststring = teststring.replace(
                        re,
                        invoice.additionalFieldsArr[i + ""]
                          ? invoice.additionalFieldsArr[i + ""].fieldValue
                            ? superUserDetails.customFieldsInvoices[i]
                                .fieldType == "date"
                              ? convertDate(
                                  invoice.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : superUserDetails.customFieldsInvoices[i]
                                  .fieldType == "date_time"
                              ? convertDateTime(
                                  invoice.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : invoice.additionalFieldsArr[i + ""].fieldValue
                            : ""
                          : ""
                      );
                    }
                  }

                  emailData.html = teststring;
                }
                addtoautomatedMail(emailData, userId);
              }
            })
            } else if (type == "quotation") {
              getSalePipelines(userId).then(salePipeline=>{
                salePipelines = salePipeline.salePipelines;
              if (!!quotation && !!assignedTo) {
                emailData.html = template.body
                  .replace(
                    /\#\[quotation.Date\]/g,
                    convertDate(
                      quotation.docData.docDate,
                      superUserDetails.timeZone
                    )
                  )
                  .replace(
                    /\#\[quotation.Doc Prefix\]/g,
                    quotation.docData.docPrefix ? quotation.docData.docPrefix : ""
                  )
                  .replace(
                    /\#\[quotation.Doc No\]/g,
                    quotation.docData.docNumber ? quotation.docData.docNumber : ""
                  )
                  .replace(
                    /\#\[quotation.Validity\]/g,
                    convertDate(
                      quotation.docData.docValidity,
                      superUserDetails.timeZone
                    )
                  )
                  .replace(
                    /\#\[quotation.Currency\]/g,
                    quotation.docData.currency ? quotation.docData.currency : ""
                  )
                  .replace(
                    /\#\[quotation.Bank Details\]/g,
                    quotation.docData.bankDetails
                      ? quotation.docData.bankDetails
                      : ""
                  )
                  .replace(
                    /\#\[quotation.Amount Including Tax\]/g,
                    quotation.docData.totalInclTax
                      ? quotation.docData.totalInclTax
                      : ""
                  )
                  .replace(
                    /\#\[quotation.Sale\]/g,
                    quotation.docData.saleTitle ? quotation.docData.saleTitle : ""
                  )
                  .replace(
                    /\#\[quotation.Customer\]/g,
                    quotation.customerData.fname1 +
                      " " +
                      (quotation.customerData.sname
                        ? quotation.customerData.sname
                        : "")
                  )
                  .replace(
                    /\#\[quotation.Notes\]/g,
                    quotation.docData.notes ? quotation.docData.notes : ""
                  )
                  .replace(
                    /\#\[quotation.Amount Collected\]/g,
                    quotation.docData.collectedAmount
                      ? quotation.docData.collectedAmount
                      : ""
                  )
                  .replace(
                    /\#\[quotation.Doc URL\]/g,
                    quotation.sharedDocId ? quotation.sharedDocId : ""
                  )
                  .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
                  .replace(
                    /\#\[user.Last Name\]/g,
                    assignedTo.lastname ? assignedTo.lastname : ""
                  )
                  .replace(
                    /\#\[user.Contact No\]/g,
                    assignedTo.phone ? assignedTo.phone : ""
                  )
                  .replace(
                    /\#\[user.Email\]/g,
                    assignedTo.email ? assignedTo.email : ""
                  );

                // replacing sale seperately
                if (!!sale) {
                  let teststr1 = emailData.html;
                  teststr1 = teststr1
                    .replace(
                      /\#\[sale.Sale Title\]/g,
                      sale.saleTitle ? sale.saleTitle : ""
                    )
                    .replace(
                      /\#\[sale.Estimated Value\]/g,
                      sale.estimatedValue ? sale.estimatedValue : ""
                    )
                    .replace(
                      /\#\[sale.Start Date\]/g,
                      convertDate(sale.startDate, superUserDetails.timeZone)
                    )
                    .replace(
                      /\#\[sale.Expected Completion Date\]/g,
                      convertDate(
                        sale.expCompletionDate,
                        superUserDetails.timeZone
                      )
                    )
                    .replace(/\#\[sale.Stage\]/g, getStatusName(salePipelines, sale.selectedSalePipeline,sale.salesStage))
                    .replace(/\#\[sale.Priority\]/g, sale.priority)
                    .replace(/\#\[sale.Assigned To\]/g, sale.assignedToName)
                    .replace(
                      /\#\[sale.Description\]/g,
                      sale.description ? sale.description : ""
                    );

                  emailData.html = teststr1;
                }

                // replacing contact part seperately
                if (!!contact) {
                  let teststr2 = emailData.html;
                  teststr2 = teststr2
                    .replace(
                      /\#\[contact.Company Name\]/g,
                      contact.companyName ? contact.companyName : ""
                    )
                    .replace(/\#\[contact.First Name\]/g, contact.firstName)
                    .replace(
                      /\#\[contact.Second Name\]/g,
                      contact.secondName ? contact.secondName : ""
                    )
                    .replace(
                      /\#\[contact.Contact No\]/g,
                      contact.contactNo ? contact.contactNo : ""
                    )
                    .replace(
                      /\#\[contact.Email\]/g,
                      contact.email ? contact.email : ""
                    )
                    .replace(/\#\[contact.Priority\]/g, contact.priority)
                    .replace(/\#\[contact.Status\]/g, getStatusName(contactPipelines,contact.selectedContactPipeline,contact.status))
                    .replace(
                      /\#\[contact.Assigned To\]/g,
                      contact.assignedToName
                    );

                  emailData.html = teststr2;
                }

                // contact additional fields
                if (!!contact && superUserDetails.customFieldsContact) {

                  let teststring = emailData.html;
                  for (
                    let i = 0;
                    i < superUserDetails.customFieldsContact.length;
                    i++
                  ) {
                    if (
                      superUserDetails.customFieldsContact[i].isActive === true
                    ) {
                      var str1 =
                        "\\#\\[contact." +
                        superUserDetails.customFieldsContact[i].fieldName +
                        "\\]";

                      var re = new RegExp(str1, "g");
                      teststring = teststring.replace(
                        re,
                        contact.additionalFieldsArr[i + ""]
                          ? contact.additionalFieldsArr[i + ""].fieldValue
                            ? superUserDetails.customFieldsContact[i].fieldType ==
                              "date"
                              ? convertDate(
                                  contact.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : superUserDetails.customFieldsContact[i]
                                  .fieldType == "date_time"
                              ? convertDateTime(
                                  contact.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : contact.additionalFieldsArr[i + ""].fieldValue
                            : ""
                          : ""
                      );
                    }
                  }

                  emailData.html = teststring;
                }

                // sale additional fields
                if (!!sale && superUserDetails.customFieldsSale) {
                  let str = emailData.html;
                  for (
                    let i = 0;
                    i < superUserDetails.customFieldsSale.length;
                    i++
                  ) {
                    if (superUserDetails.customFieldsSale[i].isActive === true) {
                      var str1 =
                        "\\#\\[sale." +
                        superUserDetails.customFieldsSale[i].fieldName +
                        "\\]";
                      var re = new RegExp(str1, "g");
                      str = str.replace(
                        re,
                        sale.additionalFieldsArr[i + ""]
                          ? sale.additionalFieldsArr[i + ""].fieldValue
                            ? superUserDetails.customFieldsSale[i].fieldType ==
                              "date"
                              ? convertDate(
                                  sale.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : superUserDetails.customFieldsSale[i].fieldType ==
                                "date_time"
                              ? convertDateTime(
                                  sale.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : sale.additionalFieldsArr[i + ""].fieldValue
                            : ""
                          : ""
                      );
                    }
                  }
                  emailData.html = str;
                }

                // additional fields: customFieldsQuotation
                if (superUserDetails.customFieldsQuotation) {
                  let teststring = emailData.html;
                  for (
                    let i = 0;
                    i < superUserDetails.customFieldsQuotation.length;
                    i++
                  ) {
                    if (
                      superUserDetails.customFieldsQuotation[i].isActive === true
                    ) {
                      var str1 =
                        "\\#\\[quotation." +
                        superUserDetails.customFieldsQuotation[i].fieldName +
                        "\\]";

                      var re = new RegExp(str1, "g");
                      teststring = teststring.replace(
                        re,
                        quotation.additionalFieldsArr[i + ""]
                          ? quotation.additionalFieldsArr[i + ""].fieldValue
                            ? superUserDetails.customFieldsQuotation[i]
                                .fieldType == "date"
                              ? convertDate(
                                  quotation.additionalFieldsArr[i + ""]
                                    .fieldValue,
                                  superUserDetails.timeZone
                                )
                              : superUserDetails.customFieldsQuotation[i]
                                  .fieldType == "date_time"
                              ? convertDateTime(
                                  quotation.additionalFieldsArr[i + ""]
                                    .fieldValue,
                                  superUserDetails.timeZone
                                )
                              : quotation.additionalFieldsArr[i + ""].fieldValue
                            : ""
                          : ""
                      );
                    }
                  }
                  emailData.html = teststring;
                }

                addtoautomatedMail(emailData, userId);
              }
            })
            } else if (type == "estimate") {
              getSalePipelines(userId).then(salePipeline=>{
                salePipelines = salePipeline.salePipelines;
              if (!!estimate && !!assignedTo) {
                emailData.html = template.body
                  .replace(
                    /\#\[estimate.Date\]/g,
                    convertDate(
                      estimate.docData.docDate,
                      superUserDetails.timeZone
                    )
                  )
                  .replace(
                    /\#\[estimate.Doc Prefix\]/g,
                    estimate.docData.adocPrefix ? estimate.docData.docPrefix : ""
                  )
                  .replace(
                    /\#\[estimate.Doc No\]/g,
                    estimate.docData.docNumber ? estimate.docData.docNumber : ""
                  )
                  .replace(
                    /\#\[estimate.Validity\]/g,
                    convertDate(
                      estimate.docData.docValidity,
                      superUserDetails.timeZone
                    )
                  )
                  .replace(
                    /\#\[estimate.Currency\]/g,
                    estimate.docData.currency ? estimate.docData.currency : ""
                  )
                  .replace(
                    /\#\[estimate.Bank Details\]/g,
                    estimate.docData.bankDetails
                      ? estimate.docData.bankDetails
                      : ""
                  )
                  .replace(
                    /\#\[estimate.Amount Including Tax\]/g,
                    estimate.docData.totalInclTax
                      ? estimate.docData.totalInclTax
                      : ""
                  )
                  .replace(
                    /\#\[estimate.Sale\]/g,
                    estimate.docData.saleTitle ? estimate.docData.saleTitle : ""
                  )
                  .replace(
                    /\#\[estimate.Customer\]/g,
                    estimate.customerData.fname1 +
                      " " +
                      (estimate.customerData.sname
                        ? estimate.customerData.sname
                        : "")
                  )
                  .replace(
                    /\#\[estimate.Notes\]/g,
                    estimate.docData.notes ? estimate.docData.notes : ""
                  )
                  .replace(
                    /\#\[estimate.Amount Collected\]/g,
                    estimate.docData.collectedAmount
                      ? estimate.docData.collectedAmount
                      : ""
                  )
                  .replace(
                    /\#\[estimate.Doc URL\]/g,
                    estimate.sharedDocId ? estimate.sharedDocId : ""
                  )
                  .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
                  .replace(
                    /\#\[user.Last Name\]/g,
                    assignedTo.lastname ? assignedTo.lastname : ""
                  )
                  .replace(
                    /\#\[user.Contact No\]/g,
                    assignedTo.phone ? assignedTo.phone : ""
                  )
                  .replace(
                    /\#\[user.Email\]/g,
                    assignedTo.email ? assignedTo.email : ""
                  );
                // replacing sale seperately
                if (!!sale) {
                  let teststr1 = emailData.html;
                  teststr1 = teststr1
                    .replace(
                      /\#\[sale.Sale Title\]/g,
                      sale.saleTitle ? sale.saleTitle : ""
                    )
                    .replace(
                      /\#\[sale.Estimated Value\]/g,
                      sale.estimatedValue ? sale.estimatedValue : ""
                    )
                    .replace(
                      /\#\[sale.Start Date\]/g,
                      convertDate(sale.startDate, superUserDetails.timeZone)
                    )
                    .replace(
                      /\#\[sale.Expected Completion Date\]/g,
                      convertDate(
                        sale.expCompletionDate,
                        superUserDetails.timeZone
                      )
                    )
                    .replace(/\#\[sale.Stage\]/g, getStatusName(salePipelines, sale.selectedSalePipeline,sale.salesStage))
                    .replace(/\#\[sale.Priority\]/g, sale.priority)
                    .replace(/\#\[sale.Assigned To\]/g, sale.assignedToName)
                    .replace(
                      /\#\[sale.Description\]/g,
                      sale.description ? sale.description : ""
                    );

                  emailData.html = teststr1;
                }

                // replacing contact part seperately
                if (!!contact) {
                  let teststr2 = emailData.html;
                  teststr2 = teststr2
                    .replace(/\#\[contact.Company Name\]/g, contact.companyName)
                    .replace(/\#\[contact.First Name\]/g, contact.firstName)
                    .replace(
                      /\#\[contact.Second Name\]/g,
                      contact.secondName ? contact.secondName : ""
                    )
                    .replace(
                      /\#\[contact.Contact No\]/g,
                      contact.contactNo ? contact.contactNo : ""
                    )
                    .replace(
                      /\#\[contact.Email\]/g,
                      contact.email ? contact.email : ""
                    )
                    .replace(/\#\[contact.Priority\]/g, contact.priority)
                    .replace(/\#\[contact.Status\]/g, getStatusName(contactPipelines,contact.selectedContactPipeline,contact.status))
                    .replace(
                      /\#\[contact.Assigned To\]/g,
                      contact.assignedToName
                    );

                  emailData.html = teststr2;
                }

                // contact additional fields
                if (!!contact && superUserDetails.customFieldsContact) {

                  let teststring = emailData.html;
                  for (
                    let i = 0;
                    i < superUserDetails.customFieldsContact.length;
                    i++
                  ) {
                    if (
                      superUserDetails.customFieldsContact[i].isActive === true
                    ) {
                      var str1 =
                        "\\#\\[contact." +
                        superUserDetails.customFieldsContact[i].fieldName +
                        "\\]";

                      var re = new RegExp(str1, "g");
                      teststring = teststring.replace(
                        re,
                        contact.additionalFieldsArr[i + ""]
                          ? contact.additionalFieldsArr[i + ""].fieldValue
                            ? superUserDetails.customFieldsContact[i].fieldType ==
                              "date"
                              ? convertDate(
                                  contact.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : superUserDetails.customFieldsContact[i]
                                  .fieldType == "date_time"
                              ? convertDateTime(
                                  contact.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : contact.additionalFieldsArr[i + ""].fieldValue
                            : ""
                          : ""
                      );
                    }
                  }

                  emailData.html = teststring;
                }

                // sale additional fields
                if (!!sale && superUserDetails.customFieldsSale) {
                  let str = emailData.html;
                  for (
                    let i = 0;
                    i < superUserDetails.customFieldsSale.length;
                    i++
                  ) {
                    if (superUserDetails.customFieldsSale[i].isActive == true) {
                      var str1 =
                        "\\#\\[sale." +
                        superUserDetails.customFieldsSale[i].fieldName +
                        "\\]";
                      var re = new RegExp(str1, "g");
                      str = str.replace(
                        re,
                        sale.additionalFieldsArr[i + ""]
                          ? sale.additionalFieldsArr[i + ""].fieldValue
                            ? superUserDetails.customFieldsSale[i].fieldType ==
                              "date"
                              ? convertDate(
                                  sale.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : superUserDetails.customFieldsSale[i].fieldType ==
                                "date_time"
                              ? convertDateTime(
                                  sale.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : sale.additionalFieldsArr[i + ""].fieldValue
                            : ""
                          : ""
                      );
                    }
                  }
                  emailData.html = str;
                }

                // additional fields: customFieldsEstimate
                if (superUserDetails.customFieldsEstimate) {
                  let teststring = emailData.html;
                  for (
                    let i = 0;
                    i < superUserDetails.customFieldsEstimate.length;
                    i++
                  ) {
                    if (
                      superUserDetails.customFieldsEstimate[i].isActive === true
                    ) {
                      var str1 =
                        "\\#\\[estimate." +
                        superUserDetails.customFieldsEstimate[i].fieldName +
                        "\\]";

                      var re = new RegExp(str1, "g");
                      teststring = teststring.replace(
                        re,
                        estimate.additionalFieldsArr[i + ""]
                          ? estimate.additionalFieldsArr[i + ""].fieldValue
                            ? superUserDetails.customFieldsEstimate[i]
                                .fieldType == "date"
                              ? convertDate(
                                  estimate.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : superUserDetails.customFieldsEstimate[i]
                                  .fieldType == "date_time"
                              ? convertDateTime(
                                  estimate.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : estimate.additionalFieldsArr[i + ""].fieldValue
                            : ""
                          : ""
                      );
                    }
                  }
                  emailData.html = teststring;
                }

                addtoautomatedMail(emailData, userId);
              }
            })
            } else if (type == "collection") {
              getSalePipelines(userId).then(salePipeline=>{
                salePipelines = salePipeline.salePipelines;
              if (!!collection && !!assignedTo) {
                emailData.html = template.body
                  .replace(
                    /\#\[collection.Payment Date\]/g,
                    convertDate(collection.paymentDate, superUserDetails.timeZone)
                  )
                  .replace(
                    /\#\[collection.Payment Mode\]/g,
                    collection.paymentMode ? collection.paymentMode : ""
                  )
                  .replace(
                    /\#\[collection.Payment Type\]/g,
                    collection.paymentType ? collection.paymentType : ""
                  )
                  .replace(
                    /\#\[collection.Sale\]/g,
                    collection.saleTitle ? collection.saleTitle : ""
                  )
                  .replace(
                    /\#\[collection.Customer\]/g,
                    collection.customerName ? collection.customerName : ""
                  ) //second name has to be included
                  .replace(
                    /\#\[collection.Amount Collected\]/g,
                    collection.amountCollected ? collection.amountCollected : ""
                  )
                  .replace(
                    /\#\[collection.Doc Prefix and No\]/g,
                    collection.invoiceprefixAndDocNumber
                      ? collection.invoiceprefixAndDocNumber
                      : ""
                  )
                  .replace(
                    /\#\[collection.Currency\]/g,
                    collection.currency ? collection.currency : ""
                  )
                  .replace(
                    /\#\[collection.Cheque details\]/g,
                    (collection.chequeNo ? collection.chequeNo : "") +
                      ", " +
                      (collection.chequeBank ? collection.chequeBank : "")
                  )
                  .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
                  .replace(
                    /\#\[user.Last Name\]/g,
                    assignedTo.lastname ? assignedTo.lastname : ""
                  )
                  .replace(
                    /\#\[user.Contact No\]/g,
                    assignedTo.phone ? assignedTo.phone : ""
                  )
                  .replace(
                    /\#\[user.Email\]/g,
                    assignedTo.email ? assignedTo.email : ""
                  );

                // replacing sale seperately
                if (!!sale) {
                  let teststr1 = emailData.html;
                  teststr1 = teststr1
                    .replace(
                      /\#\[sale.Estimated Value\]/g,
                      sale.estimatedValue ? sale.estimatedValue : ""
                    )
                    .replace(
                      /\#\[sale.Sale Title\]/g,
                      sale.saleTitle ? sale.saleTitle : ""
                    )
                    .replace(
                      /\#\[sale.Start Date\]/g,
                      convertDate(sale.startDate, superUserDetails.timeZone)
                    )
                    .replace(
                      /\#\[sale.Expected Completion Date\]/g,
                      convertDate(
                        sale.expCompletionDate,
                        superUserDetails.timeZone
                      )
                    )
                    .replace(/\#\[sale.Stage\]/g, getStatusName(salePipelines, sale.selectedSalePipeline,sale.salesStage))
                    .replace(/\#\[sale.Priority\]/g, sale.priority)
                    .replace(/\#\[sale.Assigned To\]/g, sale.assignedToName)
                    .replace(
                      /\#\[sale.Description\]/g,
                      sale.description ? sale.description : ""
                    );

                  emailData.html = teststr1;
                }

                // replacing contact part seperately
                if (!!contact) {
                  let teststr2 = emailData.html;
                  teststr2 = teststr2
                    .replace(/\#\[contact.Company Name\]/g, contact.companyName)
                    .replace(/\#\[contact.First Name\]/g, contact.firstName)
                    .replace(
                      /\#\[contact.Second Name\]/g,
                      contact.secondName ? contact.secondName : ""
                    )
                    .replace(
                      /\#\[contact.Contact No\]/g,
                      contact.contactNo ? contact.contactNo : ""
                    )
                    .replace(
                      /\#\[contact.Email\]/g,
                      contact.email ? contact.email : ""
                    )
                    .replace(/\#\[contact.Priority\]/g, contact.priority)
                    .replace(/\#\[contact.Status\]/g, getStatusName(contactPipelines,contact.selectedContactPipeline,contact.status))
                    .replace(
                      /\#\[contact.Assigned To\]/g,
                      contact.assignedToName
                    );

                  emailData.html = teststr2;
                }

                // contact additional fields
                if (!!contact && superUserDetails.customFieldsContact) {

                  let teststring = emailData.html;
                  for (
                    let i = 0;
                    i < superUserDetails.customFieldsContact.length;
                    i++
                  ) {
                    if (
                      superUserDetails.customFieldsContact[i].isActive === true
                    ) {
                      var str1 =
                        "\\#\\[contact." +
                        superUserDetails.customFieldsContact[i].fieldName +
                        "\\]";

                      var re = new RegExp(str1, "g");
                      teststring = teststring.replace(
                        re,
                        contact.additionalFieldsArr[i + ""]
                          ? contact.additionalFieldsArr[i + ""].fieldValue
                            ? superUserDetails.customFieldsContact[i].fieldType ==
                              "date"
                              ? convertDate(
                                  contact.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : superUserDetails.customFieldsContact[i]
                                  .fieldType == "date_time"
                              ? convertDateTime(
                                  contact.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : contact.additionalFieldsArr[i + ""].fieldValue
                            : ""
                          : ""
                      );
                    }
                  }

                  emailData.html = teststring;
                }

                // sale additional fields
                if (!!sale && superUserDetails.customFieldsSale) {
                  let str = emailData.html;
                  for (
                    let i = 0;
                    i < superUserDetails.customFieldsSale.length;
                    i++
                  ) {
                    if (superUserDetails.customFieldsSale[i].isActive === true) {
                      var str1 =
                        "\\#\\[sale." +
                        superUserDetails.customFieldsSale[i].fieldName +
                        "\\]";
                      var re = new RegExp(str1, "g");
                      str = str.replace(
                        re,
                        sale.additionalFieldsArr[i + ""]
                          ? sale.additionalFieldsArr[i + ""].fieldValue
                            ? superUserDetails.customFieldsSale[i].fieldType ==
                              "date"
                              ? convertDate(
                                  sale.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : superUserDetails.customFieldsSale[i].fieldType ==
                                "date_time"
                              ? convertDateTime(
                                  sale.additionalFieldsArr[i + ""].fieldValue,
                                  superUserDetails.timeZone
                                )
                              : sale.additionalFieldsArr[i + ""].fieldValue
                            : ""
                          : ""
                      );
                    }
                  }
                  emailData.html = str;
                }

                // additional fields: customFieldsPayment
                if (superUserDetails.customFieldsPayment) {
                  let teststring = emailData.html;
                  for (
                    let i = 0;
                    i < superUserDetails.customFieldsPayment.length;
                    i++
                  ) {
                    if (
                      superUserDetails.customFieldsPayment[i].isActive === true
                    ) {
                      var str1 =
                        "\\#\\[collection." +
                        superUserDetails.customFieldsPayment[i].fieldName +
                        "\\]";

                      var re = new RegExp(str1, "g");
                      teststring = teststring.replace(
                        re,
                        collection.additionalFieldsArr[i + ""]
                          ? collection.additionalFieldsArr[i + ""].fieldValue
                            ? superUserDetails.customFieldsPayment[i].fieldType ==
                              "date"
                              ? convertDate(
                                  collection.additionalFieldsArr[i + ""]
                                    .fieldValue,
                                  superUserDetails.timeZone
                                )
                              : superUserDetails.customFieldsPayment[i]
                                  .fieldType == "date_time"
                              ? convertDateTime(
                                  collection.additionalFieldsArr[i + ""]
                                    .fieldValue,
                                  superUserDetails.timeZone
                                )
                              : collection.additionalFieldsArr[i + ""].fieldValue
                            : ""
                          : ""
                      );
                    }
                  }
                  emailData.html = teststring;
                }

                addtoautomatedMail(emailData, userId);
              }
            })
            }
          }
        });
      }
    });
  })
}
function templateBodyConverter(
  type,
  superUserDetails,
  contactData,
  saleData,
  docData,
  assignedTodata,
  body
) {
  console.log("I'm called");
  var assignedTo = assignedTodata;
  if (type == "Contact") {
    var contact = docData;
    contact.saleId = null;
    contact.saleTitle = null;
    // console.log(contact)
  } else if (type == "Sale") {
    var sale = docData;
    var contact = contactData;
  } else if (type == "Service") {
    var service = docData;
    var contact = contactData;
  } else if (type == "Invoice") {
    var invoice = docData;
    var sale = saleData;
    var contact = contactData;
  } else if (type == "Estimate") {
    var estimate = docData;
    var sale = saleData;
    var contact = contactData;
  } else if (type == "Quotation") {
    var quotation = docData;
    var sale = saleData;
    var contact = contactData;
  } else if (type == "Collection") {
    var collection = docData;
    var sale = saleData;
    var contact = contactData;
  }
  var emailData = {};
  emailData.html = body;
  if (type == "Contact") {
    emailData.html = body
      .replace(/\#\[contact.Company Name\]/g, contact.companyName)
      .replace(/\#\[contact.First Name\]/g, contact.firstName)
      .replace(
        /\#\[contact.Second Name\]/g,
        contact.secondName ? contact.secondName : ""
      )
      .replace(
        /\#\[contact.Contact No\]/g,
        contact.contactNo ? contact.contactNo : ""
      )
      .replace(/\#\[contact.Email\]/g, contact.email ? contact.email : "")
      .replace(/\#\[contact.Priority\]/g, contact.priority)
      .replace(/\#\[contact.Status\]/g, contact.status)
      .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
      .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
      .replace(
        /\#\[user.Last Name\]/g,
        assignedTo.lastname ? assignedTo.lastname : ""
      )
      .replace(
        /\#\[user.Contact No\]/g,
        assignedTo.phone ? assignedTo.phone : ""
      )
      .replace(/\#\[user.Email\]/g, assignedTo.email ? assignedTo.email : "");

    if (superUserDetails.customFieldsContact) {
      // let str = "console.log(msgData.html";
      let teststring = emailData.html;
      for (let i = 0; i < superUserDetails.customFieldsContact.length; i++) {
        if (superUserDetails.customFieldsContact[i].isActive === true) {
          var str1 =
            "\\#\\[contact." +
            superUserDetails.customFieldsContact[i].fieldName +
            "\\]";
          // console.log(str1);
          // console.log(contact.additionalFieldsArr[i + ''].fieldValue);
          var re = new RegExp(str1, "g");
          teststring = teststring.replace(
            re,
            contact.additionalFieldsArr[i + ""]
              ? contact.additionalFieldsArr[i + ""].fieldValue
                ? superUserDetails.customFieldsContact[i].fieldType == "date"
                  ? convertDate(
                      contact.additionalFieldsArr[i + ""].fieldValue,
                      superUserDetails.timeZone
                    )
                  : superUserDetails.customFieldsContact[i].fieldType ==
                    "date_time"
                  ? convertDateTime(
                      contact.additionalFieldsArr[i + ""].fieldValue,
                      superUserDetails.timeZone
                    )
                  : contact.additionalFieldsArr[i + ""].fieldValue
                : ""
              : ""
          );
        }
      }
      // str += ")";
      // console.log(teststring);
      emailData.html = teststring;
    }
  } else if (type == "Sale") {
    if (contact) {
      // customername = sale.firstName + " " + sale.secondName;
      emailData.html = body
        .replace(/\#\[sale.Sale Title\]/g, sale.saleTitle ? sale.saleTitle : "")
        .replace(
          /\#\[sale.Estimated Value\]/g,
          sale.estimatedValue ? sale.estimatedValue : ""
        )
        .replace(
          /\#\[sale.Start Date\]/g,
          convertDate(sale.startDate, superUserDetails.timeZone)
        )
        .replace(
          /\#\[sale.Expected Completion Date\]/g,
          convertDate(sale.expCompletionDate, superUserDetails.timeZone)
        )
        .replace(/\#\[sale.Stage\]/g, getStatusName(salePipelines, sale.selectedSalePipeline,sale.salesStage))
        .replace(/\#\[sale.Priority\]/g, sale.priority)
        .replace(/\#\[sale.Assigned To\]/g, sale.assignedToName)
        .replace(
          /\#\[sale.Description\]/g,
          sale.description ? sale.description : ""
        )
        .replace(/\#\[contact.Company Name\]/g, contact.companyName)
        .replace(/\#\[contact.First Name\]/g, contact.firstName)
        .replace(
          /\#\[contact.Second Name\]/g,
          contact.secondName ? contact.secondName : ""
        )
        .replace(
          /\#\[contact.Contact No\]/g,
          contact.contactNo ? contact.contactNo : ""
        )
        .replace(/\#\[contact.Email\]/g, contact.email ? contact.email : "")
        .replace(/\#\[contact.Priority\]/g, contact.priority)
        .replace(/\#\[contact.Status\]/g, contact.status)
        .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
        .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
        .replace(
          /\#\[user.Last Name\]/g,
          assignedTo.lastname ? assignedTo.lastname : ""
        )
        .replace(
          /\#\[user.Contact No\]/g,
          assignedTo.phone ? assignedTo.phone : ""
        )
        .replace(/\#\[user.Email\]/g, assignedTo.email ? assignedTo.email : "");

      // contact additional fields
      if (superUserDetails.customFieldsContact) {
        // let str = "console.log(msgData.html";
        let teststring = emailData.html;
        for (let i = 0; i < superUserDetails.customFieldsContact.length; i++) {
          if (superUserDetails.customFieldsContact[i].isActive === true) {
            var str1 =
              "\\#\\[contact." +
              superUserDetails.customFieldsContact[i].fieldName +
              "\\]";
            // console.log(str1);
            // console.log(contact.additionalFieldsArr[i + ''].fieldValue);
            var re = new RegExp(str1, "g");
            teststring = teststring.replace(
              re,
              contact.additionalFieldsArr[i + ""]
                ? contact.additionalFieldsArr[i + ""].fieldValue
                  ? superUserDetails.customFieldsContact[i].fieldType == "date"
                    ? convertDate(
                        contact.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : superUserDetails.customFieldsContact[i].fieldType ==
                      "date_time"
                    ? convertDateTime(
                        contact.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : contact.additionalFieldsArr[i + ""].fieldValue
                  : ""
                : ""
            );
          }
        }
        // str += ")";
        // console.log(teststring);
        emailData.html = teststring;
      }

      // sale additional fields
      if (superUserDetails.customFieldsSale) {
        let str = emailData.html;
        for (let i = 0; i < superUserDetails.customFieldsSale.length; i++) {
          if (superUserDetails.customFieldsSale[i].isActive === true) {
            var str1 =
              "\\#\\[sale." +
              superUserDetails.customFieldsSale[i].fieldName +
              "\\]";
            var re = new RegExp(str1, "g");
            str = str.replace(
              re,
              sale.additionalFieldsArr[i + ""]
                ? sale.additionalFieldsArr[i + ""].fieldValue
                  ? superUserDetails.customFieldsSale[i].fieldType == "date"
                    ? convertDate(
                        sale.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : superUserDetails.customFieldsSale[i].fieldType ==
                      "date_time"
                    ? convertDateTime(
                        sale.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : sale.additionalFieldsArr[i + ""].fieldValue
                  : ""
                : ""
            );
          }
        }
        emailData.html = str;
      }
    }
  } else if (type == "Service") {
    if (contact) {
      // customername = service.firstName + " " + service.secondName;
      emailData.html = body
        .replace(
          /\#\[service.Service Title\]/g,
          service.serviceTitle ? service.serviceTitle : ""
        )
        .replace(
          /\#\[service.Estimated Value\]/g,
          service.estimatedValue ? service.estimatedValue : ""
        )
        .replace(
          /\#\[service.Start Date\]/g,
          convertDate(service.startDate, superUserDetails.timeZone)
        )
        .replace(
          /\#\[service.Expected Completion Date\]/g,
          convertDate(service.expCompletionDate, superUserDetails.timeZone)
        )
        .replace(/\#\[service.Stage\]/g, getStatusName(servicePipelines, service.selectedServPipeline,service.servicesStage))
        .replace(/\#\[service.Priority\]/g, service.priority)
        .replace(/\#\[service.Assigned To\]/g, service.assignedToName)
        .replace(
          /\#\[service.Description\]/g,
          service.description ? service.description : ""
        )
        .replace(/\#\[contact.Company Name\]/g, contact.companyName)
        .replace(/\#\[contact.First Name\]/g, contact.firstName)
        .replace(
          /\#\[contact.Second Name\]/g,
          contact.secondName ? contact.secondName : ""
        )
        .replace(
          /\#\[contact.Contact No\]/g,
          contact.contactNo ? contact.contactNo : ""
        )
        .replace(/\#\[contact.Email\]/g, contact.email ? contact.email : "")
        .replace(/\#\[contact.Priority\]/g, contact.priority)
        .replace(/\#\[contact.Status\]/g, contact.status)
        .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
        .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
        .replace(
          /\#\[user.Last Name\]/g,
          assignedTo.lastname ? assignedTo.lastname : ""
        )
        .replace(
          /\#\[user.Contact No\]/g,
          assignedTo.phone ? assignedTo.phone : ""
        )
        .replace(/\#\[user.Email\]/g, assignedTo.email ? assignedTo.email : "");

      // contact additional fields
      if (superUserDetails.customFieldsContact) {
        // let str = "console.log(msgData.html";
        let teststring = emailData.html;
        for (let i = 0; i < superUserDetails.customFieldsContact.length; i++) {
          if (superUserDetails.customFieldsContact[i].isActive === true) {
            var str1 =
              "\\#\\[contact." +
              superUserDetails.customFieldsContact[i].fieldName +
              "\\]";
            // console.log(str1);
            // console.log(contact.additionalFieldsArr[i + ''].fieldValue);
            var re = new RegExp(str1, "g");
            teststring = teststring.replace(
              re,
              contact.additionalFieldsArr[i + ""]
                ? contact.additionalFieldsArr[i + ""].fieldValue
                  ? superUserDetails.customFieldsContact[i].fieldType == "date"
                    ? convertDate(
                        contact.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : superUserDetails.customFieldsContact[i].fieldType ==
                      "date_time"
                    ? convertDateTime(
                        contact.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : contact.additionalFieldsArr[i + ""].fieldValue
                  : ""
                : ""
            );
          }
        }
        // str += ")";
        // console.log(teststring);
        emailData.html = teststring;
      }

      // service additional fields
      if (superUserDetails.customFieldsService) {
        let str = emailData.html;
        for (let i = 0; i < superUserDetails.customFieldsService.length; i++) {
          if (superUserDetails.customFieldsService[i].isActive == true) {
            var str1 =
              "\\#\\[service." +
              superUserDetails.customFieldsService[i].fieldName +
              "\\]";
            var re = new RegExp(str1, "g");
            str = str.replace(
              re,
              service.additionalFieldsArr[i + ""]
                ? service.additionalFieldsArr[i + ""].fieldValue
                  ? superUserDetails.customFieldsService[i].fieldType == "date"
                    ? convertDate(
                        service.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : superUserDetails.customFieldsService[i].fieldType ==
                      "date_time"
                    ? convertDateTime(
                        service.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : service.additionalFieldsArr[i + ""].fieldValue
                  : ""
                : ""
            );
          }
        }
        emailData.html = str;
      }
    }
  } else if (type == "Invoice") {
    if (!!sale && !!contact) {
      console.log("Invoice type template");
      console.log(invoice);
      console.log(sale);
      console.log(contact);
      emailData.html = body
        .replace(
          /\#\[invoice.Date\]/g,
          convertDate(invoice.docData.docDate, superUserDetails.timeZone)
        )
        .replace(
          /\#\[invoice.Doc Prefix\]/g,
          invoice.docData.docPrefix ? invoice.docData.docPrefix : ""
        )
        .replace(
          /\#\[invoice.Doc No\]/g,
          invoice.docData.docNumber ? invoice.docData.docNumber : ""
        )
        .replace(
          /\#\[invoice.Due Date\]/g,
          convertDate(invoice.docData.dueDate, superUserDetails.timeZone)
        )
        .replace(
          /\#\[invoice.Currency\]/g,
          invoice.docData.currency ? invoice.docData.currency : ""
        )
        .replace(
          /\#\[invoice.Bank Details\]/g,
          invoice.docData.bankDetails ? invoice.docData.bankDetails : ""
        )
        .replace(
          /\#\[invoice.Amount Including Tax\]/g,
          invoice.docData.totalInclTax ? invoice.docData.totalInclTax : ""
        )
        .replace(
          /\#\[invoice.Sale\]/g,
          invoice.docData.saleTitle ? invoice.docData.saleTitle : ""
        )
        .replace(
          /\#\[invoice.Customer\]/g,
          invoice.customerData.fname1 +
            " " +
            (invoice.customerData.sname ? invoice.customerData.sname : "")
        )
        .replace(
          /\#\[invoice.Notes\]/g,
          invoice.docData.notes ? invoice.docData.notes : ""
        )
        .replace(
          /\#\[invoice.Amount Collected\]/g,
          invoice.docData.collectedAmount ? invoice.docData.collectedAmount : ""
        )
        .replace(
          /\#\[invoice.Doc URL\]/g,
          invoice.sharedDocId ? invoice.sharedDocId : ""
        )
        .replace(/\#\[sale.Sale Title\]/g, sale.saleTitle ? sale.saleTitle : "")
        .replace(
          /\#\[sale.Estimated Value\]/g,
          sale.estimatedValue ? sale.estimatedValue : ""
        )
        .replace(
          /\#\[sale.Start Date\]/g,
          convertDate(sale.startDate, superUserDetails.timeZone)
        )
        .replace(
          /\#\[sale.Expected Completion Date\]/g,
          convertDate(sale.expCompletionDate, superUserDetails.timeZone)
        )
        .replace(/\#\[sale.Stage\]/g, sale.salesStage ? getStatusName(salePipelines, sale.selectedSalePipeline,sale.salesStage) : "")
        .replace(/\#\[sale.Priority\]/g, sale.priority)
        .replace(/\#\[sale.Assigned To\]/g, sale.assignedToName)
        .replace(
          /\#\[sale.Description\]/g,
          sale.description ? sale.description : ""
        )
        .replace(
          /\#\[contact.Company Name\]/g,
          contact.companyName ? contact.companyName : ""
        )
        .replace(/\#\[contact.First Name\]/g, contact.firstName)
        .replace(
          /\#\[contact.Second Name\]/g,
          contact.secondName ? contact.secondName : ""
        )
        .replace(
          /\#\[contact.Contact No\]/g,
          contact.contactNo ? contact.contactNo : ""
        )
        .replace(/\#\[contact.Email\]/g, contact.email ? contact.email : "")
        .replace(/\#\[contact.Priority\]/g, contact.priority)
        .replace(/\#\[contact.Status\]/g, contact.status)
        .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
        .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
        .replace(
          /\#\[user.Last Name\]/g,
          assignedTo.lastname ? assignedTo.lastname : ""
        )
        .replace(
          /\#\[user.Contact No\]/g,
          assignedTo.phone ? assignedTo.phone : ""
        )
        .replace(/\#\[user.Email\]/g, assignedTo.email ? assignedTo.email : "");

      // contact additional fields
      if (superUserDetails.customFieldsContact) {
        // let str = "console.log(msgData.html";
        let teststring = emailData.html;
        for (let i = 0; i < superUserDetails.customFieldsContact.length; i++) {
          if (superUserDetails.customFieldsContact[i].isActive === true) {
            var str1 =
              "\\#\\[contact." +
              superUserDetails.customFieldsContact[i].fieldName +
              "\\]";
            // console.log(str1);
            // console.log(contact.additionalFieldsArr[i + ''].fieldValue);
            var re = new RegExp(str1, "g");
            teststring = teststring.replace(
              re,
              contact.additionalFieldsArr[i + ""]
                ? contact.additionalFieldsArr[i + ""].fieldValue
                  ? superUserDetails.customFieldsContact[i].fieldType == "date"
                    ? convertDate(
                        contact.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : superUserDetails.customFieldsContact[i].fieldType ==
                      "date_time"
                    ? convertDateTime(
                        contact.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : contact.additionalFieldsArr[i + ""].fieldValue
                  : ""
                : ""
            );
          }
        }
        // str += ")";
        // console.log(teststring);
        emailData.html = teststring;
      }

      // sale additional fields
      if (superUserDetails.customFieldsSale) {
        let str = emailData.html;
        for (let i = 0; i < superUserDetails.customFieldsSale.length; i++) {
          if (superUserDetails.customFieldsSale[i].isActive === true) {
            var str1 =
              "\\#\\[sale." +
              superUserDetails.customFieldsSale[i].fieldName +
              "\\]";
            var re = new RegExp(str1, "g");
            str = str.replace(
              re,
              sale.additionalFieldsArr[i + ""]
                ? sale.additionalFieldsArr[i + ""].fieldValue
                  ? superUserDetails.customFieldsSale[i].fieldType == "date"
                    ? convertDate(
                        sale.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : superUserDetails.customFieldsSale[i].fieldType ==
                      "date_time"
                    ? convertDateTime(
                        sale.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : sale.additionalFieldsArr[i + ""].fieldValue
                  : ""
                : ""
            );
          }
        }
        emailData.html = str;
      }
    }
  } else if (type == "Quotation") {
    if (!!sale && !!contact) {
      emailData.html = template.body
        .replace(
          /\#\[quotation.Date\]/g,
          convertDate(quotation.docData.docDate, superUserDetails.timeZone)
        )
        .replace(
          /\#\[quotation.Doc Prefix\]/g,
          quotation.docData.docPrefix ? quotation.docData.docPrefix : ""
        )
        .replace(
          /\#\[quotation.Doc No\]/g,
          quotation.docData.docNumber ? quotation.docData.docNumber : ""
        )
        .replace(
          /\#\[quotation.Validity\]/g,
          convertDate(quotation.docData.docValidity, superUserDetails.timeZone)
        )
        .replace(
          /\#\[quotation.Currency\]/g,
          quotation.docData.currency ? quotation.docData.currency : ""
        )
        .replace(
          /\#\[quotation.Bank Details\]/g,
          quotation.docData.bankDetails ? quotation.docData.bankDetails : ""
        )
        .replace(
          /\#\[quotation.Amount Including Tax\]/g,
          quotation.docData.totalInclTax ? quotation.docData.totalInclTax : ""
        )
        .replace(
          /\#\[quotation.Sale\]/g,
          quotation.docData.saleTitle ? quotation.docData.saleTitle : ""
        )
        .replace(
          /\#\[quotation.Customer\]/g,
          quotation.customerData.fname1 +
            " " +
            (quotation.customerData.sname ? quotation.customerData.sname : "")
        )
        .replace(
          /\#\[quotation.Notes\]/g,
          quotation.docData.notes ? quotation.docData.notes : ""
        )
        .replace(
          /\#\[quotation.Amount Collected\]/g,
          quotation.docData.collectedAmount
            ? quotation.docData.collectedAmount
            : ""
        )
        .replace(
          /\#\[quotation.Doc URL\]/g,
          quotation.sharedDocId ? quotation.sharedDocId : ""
        )
        .replace(/\#\[sale.Sale Title\]/g, sale.saleTitle ? sale.saleTitle : "")
        .replace(
          /\#\[sale.Estimated Value\]/g,
          sale.estimatedValue ? sale.estimatedValue : ""
        )
        .replace(
          /\#\[sale.Start Date\]/g,
          convertDate(sale.startDate, superUserDetails.timeZone)
        )
        .replace(
          /\#\[sale.Expected Completion Date\]/g,
          convertDate(sale.expCompletionDate, superUserDetails.timeZone)
        )
        .replace(/\#\[sale.Stage\]/g, getStatusName(salePipelines, sale.selectedSalePipeline,sale.salesStage))
        .replace(/\#\[sale.Priority\]/g, sale.priority)
        .replace(/\#\[sale.Assigned To\]/g, sale.assignedToName)
        .replace(
          /\#\[sale.Description\]/g,
          sale.description ? sale.description : ""
        )
        .replace(
          /\#\[contact.Company Name\]/g,
          contact.companyName ? contact.companyName : ""
        )
        .replace(/\#\[contact.First Name\]/g, contact.firstName)
        .replace(
          /\#\[contact.Second Name\]/g,
          contact.secondName ? contact.secondName : ""
        )
        .replace(
          /\#\[contact.Contact No\]/g,
          contact.contactNo ? contact.contactNo : ""
        )
        .replace(/\#\[contact.Email\]/g, contact.email ? contact.email : "")
        .replace(/\#\[contact.Priority\]/g, contact.priority)
        .replace(/\#\[contact.Status\]/g, contact.status)
        .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
        .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
        .replace(
          /\#\[user.Last Name\]/g,
          assignedTo.lastname ? assignedTo.lastname : ""
        )
        .replace(
          /\#\[user.Contact No\]/g,
          assignedTo.phone ? assignedTo.phone : ""
        )
        .replace(/\#\[user.Email\]/g, assignedTo.email ? assignedTo.email : "");

      // contact additional fields
      if (superUserDetails.customFieldsContact) {
        // let str = "console.log(msgData.html";
        let teststring = emailData.html;
        for (let i = 0; i < superUserDetails.customFieldsContact.length; i++) {
          if (superUserDetails.customFieldsContact[i].isActive == true) {
            var str1 =
              "\\#\\[contact." +
              superUserDetails.customFieldsContact[i].fieldName +
              "\\]";
            console.log(str1);
            console.log(contact.additionalFieldsArr[i + ""].fieldValue);
            var re = new RegExp(str1, "g");
            teststring = teststring.replace(
              re,
              contact.additionalFieldsArr[i + ""]
                ? contact.additionalFieldsArr[i + ""].fieldValue
                  ? superUserDetails.customFieldsContact[i].fieldType == "date"
                    ? convertDate(
                        contact.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : superUserDetails.customFieldsContact[i].fieldType ==
                      "date_time"
                    ? convertDateTime(
                        contact.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : contact.additionalFieldsArr[i + ""].fieldValue
                  : ""
                : ""
            );
          }
        }
        // str += ")";
        // console.log(teststring);
        emailData.html = teststring;
      }

      // sale additional fields
      if (superUserDetails.customFieldsSale) {
        let str = emailData.html;
        for (let i = 0; i < superUserDetails.customFieldsSale.length; i++) {
          var str1 =
            "\\#\\[sale." +
            superUserDetails.customFieldsSale[i].fieldName +
            "\\]";
          var re = new RegExp(str1, "g");
          str = str.replace(
            re,
            sale.additionalFieldsArr[i + ""]
              ? sale.additionalFieldsArr[i + ""].fieldValue
                ? superUserDetails.customFieldsSale[i].fieldType == "date"
                  ? convertDate(
                      sale.additionalFieldsArr[i + ""].fieldValue,
                      superUserDetails.timeZone
                    )
                  : superUserDetails.customFieldsSale[i].fieldType ==
                    "date_time"
                  ? convertDateTime(
                      sale.additionalFieldsArr[i + ""].fieldValue,
                      superUserDetails.timeZone
                    )
                  : sale.additionalFieldsArr[i + ""].fieldValue
                : ""
              : ""
          );
        }
        emailData.html = str;
      }
    }
  } else if (type == "Estimate") {
    if (!!sale && !!contact) {
      emailData.html = body
        .replace(
          /\#\[estimate.Date\]/g,
          convertDate(estimate.docData.docDate, superUserDetails.timeZone)
        )
        .replace(
          /\#\[estimate.Doc Prefix\]/g,
          estimate.docData.adocPrefix ? estimate.docData.docPrefix : ""
        )
        .replace(
          /\#\[estimate.Doc No\]/g,
          estimate.docData.docNumber ? estimate.docData.docNumber : ""
        )
        .replace(
          /\#\[estimate.Validity\]/g,
          convertDate(estimate.docData.docValidity, superUserDetails.timeZone)
        )
        .replace(
          /\#\[estimate.Currency\]/g,
          estimate.docData.currency ? estimate.docData.currency : ""
        )
        .replace(
          /\#\[estimate.Bank Details\]/g,
          estimate.docData.bankDetails ? estimate.docData.bankDetails : ""
        )
        .replace(
          /\#\[estimate.Amount Including Tax\]/g,
          estimate.docData.totalInclTax ? estimate.docData.totalInclTax : ""
        )
        .replace(
          /\#\[estimate.Sale\]/g,
          estimate.docData.saleTitle ? estimate.docData.saleTitle : ""
        )
        .replace(
          /\#\[estimate.Customer\]/g,
          estimate.customerData.fname1 +
            " " +
            (estimate.customerData.sname ? estimate.customerData.sname : "")
        )
        .replace(
          /\#\[estimate.Notes\]/g,
          estimate.docData.notes ? estimate.docData.notes : ""
        )
        .replace(
          /\#\[estimate.Amount Collected\]/g,
          estimate.docData.collectedAmount
            ? estimate.docData.collectedAmount
            : ""
        )
        .replace(
          /\#\[estimate.Doc URL\]/g,
          estimate.sharedDocId ? estimate.sharedDocId : ""
        )
        .replace(/\#\[sale.Sale Title\]/g, sale.saleTitle ? sale.saleTitle : "")
        .replace(
          /\#\[sale.Estimated Value\]/g,
          sale.estimatedValue ? sale.estimatedValue : ""
        )
        .replace(
          /\#\[sale.Start Date\]/g,
          convertDate(sale.startDate, superUserDetails.timeZone)
        )
        .replace(
          /\#\[sale.Expected Completion Date\]/g,
          convertDate(sale.expCompletionDate, superUserDetails.timeZone)
        )
        .replace(/\#\[sale.Stage\]/g, getStatusName(salePipelines, sale.selectedSalePipeline,sale.salesStage))
        .replace(/\#\[sale.Priority\]/g, sale.priority)
        .replace(/\#\[sale.Assigned To\]/g, sale.assignedToName)
        .replace(
          /\#\[sale.Description\]/g,
          sale.description ? sale.description : ""
        )
        .replace(/\#\[contact.Company Name\]/g, contact.companyName)
        .replace(/\#\[contact.First Name\]/g, contact.firstName)
        .replace(
          /\#\[contact.Second Name\]/g,
          contact.secondName ? contact.secondName : ""
        )
        .replace(
          /\#\[contact.Contact No\]/g,
          contact.contactNo ? contact.contactNo : ""
        )
        .replace(/\#\[contact.Email\]/g, contact.email ? contact.email : "")
        .replace(/\#\[contact.Priority\]/g, contact.priority)
        .replace(/\#\[contact.Status\]/g, contact.status)
        .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
        .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
        .replace(
          /\#\[user.Last Name\]/g,
          assignedTo.lastname ? assignedTo.lastname : ""
        )
        .replace(
          /\#\[user.Contact No\]/g,
          assignedTo.phone ? assignedTo.phone : ""
        )
        .replace(/\#\[user.Email\]/g, assignedTo.email ? assignedTo.email : "");

      // contact additional fields
      if (superUserDetails.customFieldsContact) {
        // let str = "console.log(msgData.html";
        let teststring = emailData.html;
        for (let i = 0; i < superUserDetails.customFieldsContact.length; i++) {
          if (superUserDetails.customFieldsContact[i].isActive === true) {
            var str1 =
              "\\#\\[contact." +
              superUserDetails.customFieldsContact[i].fieldName +
              "\\]";
            console.log(str1);
            console.log(contact.additionalFieldsArr[i + ""].fieldValue);
            var re = new RegExp(str1, "g");
            teststring = teststring.replace(
              re,
              contact.additionalFieldsArr[i + ""]
                ? contact.additionalFieldsArr[i + ""].fieldValue
                  ? superUserDetails.customFieldsContact[i].fieldType == "date"
                    ? convertDate(
                        contact.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : superUserDetails.customFieldsContact[i].fieldType ==
                      "date_time"
                    ? convertDateTime(
                        contact.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : contact.additionalFieldsArr[i + ""].fieldValue
                  : ""
                : ""
            );
          }
        }
        // str += ")";
        // console.log(teststring);
        emailData.html = teststring;
      }

      // sale additional fields
      if (superUserDetails.customFieldsSale) {
        let str = emailData.html;
        for (let i = 0; i < superUserDetails.customFieldsSale.length; i++) {
          if (superUserDetails.customFieldsSale[i].isActive === true) {
            var str1 =
              "\\#\\[sale." +
              superUserDetails.customFieldsSale[i].fieldName +
              "\\]";
            var re = new RegExp(str1, "g");
            str = str.replace(
              re,
              sale.additionalFieldsArr[i + ""]
                ? sale.additionalFieldsArr[i + ""].fieldValue
                  ? superUserDetails.customFieldsSale[i].fieldType == "date"
                    ? convertDate(
                        sale.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : superUserDetails.customFieldsSale[i].fieldType ==
                      "date_time"
                    ? convertDateTime(
                        sale.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : sale.additionalFieldsArr[i + ""].fieldValue
                  : ""
                : ""
            );
          }
        }
        emailData.html = str;
      }
    }
  } else if (type == "Collection") {
    if (!!sale && !!contact) {
      emailData.html = body
        .replace(
          /\#\[collection.Payment Date\]/g,
          convertDate(collection.paymentDate, superUserDetails.timeZone)
        )
        .replace(
          /\#\[collection.Payment Mode\]/g,
          collection.paymentMode ? collection.paymentMode : ""
        )
        .replace(
          /\#\[collection.Payment Type\]/g,
          collection.paymentType ? collection.paymentType : ""
        )
        .replace(
          /\#\[collection.Sale\]/g,
          collection.saleTitle ? collection.saleTitle : ""
        )
        .replace(
          /\#\[collection.Customer\]/g,
          collection.customerName ? collection.customerName : ""
        ) //second name has to be included
        .replace(
          /\#\[collection.Amount Collected\]/g,
          collection.amountCollected ? collection.amountCollected : ""
        )
        .replace(
          /\#\[collection.Doc Prefix and No\]/g,
          collection.invoiceprefixAndDocNumber
            ? collection.invoiceprefixAndDocNumber
            : ""
        )
        .replace(
          /\#\[collection.Currency\]/g,
          collection.currency ? collection.currency : ""
        )
        .replace(
          /\#\[collection.Cheque details\]/g,
          (collection.chequeNo ? collection.chequeNo : "") +
            ", " +
            (collection.chequeBank ? collection.chequeBank : "")
        )
        .replace(
          /\#\[sale.Estimated Value\]/g,
          sale.estimatedValue ? sale.estimatedValue : ""
        )
        .replace(/\#\[sale.Sale Title\]/g, sale.saleTitle ? sale.saleTitle : "")
        .replace(
          /\#\[sale.Start Date\]/g,
          convertDate(sale.startDate, superUserDetails.timeZone)
        )
        .replace(
          /\#\[sale.Expected Completion Date\]/g,
          convertDate(sale.expCompletionDate, superUserDetails.timeZone)
        )
        .replace(/\#\[sale.Stage\]/g, getStatusName(salePipelines, sale.selectedSalePipeline,sale.salesStage))
        .replace(/\#\[sale.Priority\]/g, sale.priority)
        .replace(/\#\[sale.Assigned To\]/g, sale.assignedToName)
        .replace(
          /\#\[sale.Description\]/g,
          sale.description ? sale.description : ""
        )
        .replace(/\#\[contact.Company Name\]/g, contact.companyName)
        .replace(/\#\[contact.First Name\]/g, contact.firstName)
        .replace(
          /\#\[contact.Second Name\]/g,
          contact.secondName ? contact.secondName : ""
        )
        .replace(
          /\#\[contact.Contact No\]/g,
          contact.contactNo ? contact.contactNo : ""
        )
        .replace(/\#\[contact.Email\]/g, contact.email ? contact.email : "")
        .replace(/\#\[contact.Priority\]/g, contact.priority)
        .replace(/\#\[contact.Status\]/g, contact.status)
        .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
        .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
        .replace(
          /\#\[user.Last Name\]/g,
          assignedTo.lastname ? assignedTo.lastname : ""
        )
        .replace(
          /\#\[user.Contact No\]/g,
          assignedTo.phone ? assignedTo.phone : ""
        )
        .replace(/\#\[user.Email\]/g, assignedTo.email ? assignedTo.email : "");

      // contact additional fields
      if (superUserDetails.customFieldsContact) {
        // let str = "console.log(msgData.html";
        let teststring = emailData.html;
        for (let i = 0; i < superUserDetails.customFieldsContact.length; i++) {
          if (superUserDetails.customFieldsContact[i].isActive == true) {
            var str1 =
              "\\#\\[contact." +
              superUserDetails.customFieldsContact[i].fieldName +
              "\\]";
            console.log(str1);
            console.log(contact.additionalFieldsArr[i + ""].fieldValue);
            var re = new RegExp(str1, "g");
            teststring = teststring.replace(
              re,
              contact.additionalFieldsArr[i + ""]
                ? contact.additionalFieldsArr[i + ""].fieldValue
                  ? superUserDetails.customFieldsContact[i].fieldType == "date"
                    ? convertDate(
                        contact.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : superUserDetails.customFieldsContact[i].fieldType ==
                      "date_time"
                    ? convertDateTime(
                        contact.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : contact.additionalFieldsArr[i + ""].fieldValue
                  : ""
                : ""
            );
          }
        }
        // str += ")";
        // console.log(teststring);
        emailData.html = teststring;
      }

      // sale additional fields
      if (superUserDetails.customFieldsSale) {
        let str = emailData.html;
        for (let i = 0; i < superUserDetails.customFieldsSale.length; i++) {
          if (superUserDetails.customFieldsSale[i].isActive == true) {
            var str1 =
              "\\#\\[sale." +
              superUserDetails.customFieldsSale[i].fieldName +
              "\\]";
            var re = new RegExp(str1, "g");
            str = str.replace(
              re,
              sale.additionalFieldsArr[i + ""]
                ? sale.additionalFieldsArr[i + ""].fieldValue
                  ? superUserDetails.customFieldsSale[i].fieldType == "date"
                    ? convertDate(
                        sale.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : superUserDetails.customFieldsSale[i].fieldType ==
                      "date_time"
                    ? convertDateTime(
                        sale.additionalFieldsArr[i + ""].fieldValue,
                        superUserDetails.timeZone
                      )
                    : sale.additionalFieldsArr[i + ""].fieldValue
                  : ""
                : ""
            );
          }
        }
        emailData.html = str;
      }
    }
  }
  return emailData.html;
}
function getContactPipelines(userId){
  return new Promise(function (resolve, reject) {
    admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("pipelines")
      .doc("customerPipelines")
      .get()
      .then((data) => {
        // console.log(data.data());
        resolve(data.data());
      });
  });
}
function getSalePipelines(userId){
  return new Promise(function (resolve, reject) {
    admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("pipelines")
      .doc("salePipelines")
      .get()
      .then((data) => {
        console.log(data.data());
        resolve(data.data());
      });
  });
}
function getServicePipelines(userId){
  return new Promise(function (resolve, reject) {
    admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("pipelines")
      .doc("servicePipelines")
      .get()
      .then((data) => {
        console.log(data.data());
        resolve(data.data());
      });
  });
}
function getEmailTemplate(userId, templateId) {
  console.log("1");
  return new Promise(function (resolve, reject) {
    admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("emailTemplates")
      .doc(templateId)
      .get()
      .then((data) => {
        // console.log(data.data());
        resolve(data.data());
      });
  });
}

function addtoautomatedMail(emailData, userId) {
  console.log(emailData)
  admin
    .firestore()
    .collection("users")
    .doc(userId)
    .collection("automatedMail")
    .add(emailData)
    .then((data) => {});
}

function encryptPass(password) {}

function decryptPass(encryptedPass) {}

exports.subscriptionUpdateWebhook = functions
  .region(region)
  .https.onRequest((req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        console.log(req.body.payload.subscription.entity);
        // var planObject = {
        //   plan_HzzTs3K4RsVF9s: "diamond",
        //   plan_HzzTGb8mkk5PXs: "diamond",
        //   plan_HUM0WNozVCbSHX: "gold",
        //   plan_HUM07eOoNPL468: "gold",
        // };
        // // console.log(req.body.payload.subscription.entity);
        // var data = req.body.payload.subscription.entity;
        // res.status(200).send("Success");
        // return admin
        //   .firestore()
        //   .collectionGroup("subscription")
        //   .where("id", "==", data.id)
        //   .get()
        //   .then((data1) => {
        //     if (data1.size > 0) {
        //       var newpaymentHistory = [];
        //       path = data1.docs[0].ref.path.replace(
        //         "/subscription/" + data.id,
        //         ""
        //       );
        //       console.log(path);
        //       return admin
        //         .firestore()
        //         .doc(path)
        //         .get()
        //         .then((data2) => {
        //           var quantity = data.quantity;
        //           var paymentHistory = data2.data().paymentHistory;
        //           newpaymentHistory = data2.data().paymentHistory;
        //           console.log(paymentHistory);
        //           for (i = 0; i < paymentHistory.length; i++) {
        //             if (paymentHistory[i].subscription_id) {
        //               if (paymentHistory[i].subscription_id == data.id) {
        //                 if (
        //                   paymentHistory[i].plan != planObject[data.plan_id]
        //                 ) {
        //                   newpaymentHistory[i].plan = planObject[data.plan_id];
        //                 }
        //               }
        //             }
        //           }
        //           if (
        //             newpaymentHistory != paymentHistory ||
        //             data2.noSubusers != data.quantity - 1
        //           ) {
        //             admin
        //               .firestore()
        //               .doc(path)
        //               .update({
        //                 paymentHistory: newpaymentHistory,
        //                 noSubusers: quantity - 1,
        //               })
        //               .then((data3) => {
        //                 admin
        //                   .firestore()
        //                   .doc(data1.docs[0].ref.path)
        //                   .set(data)
        //                   .then((data) => {})
        //                   .catch((err) => console.log(err));
        //               })
        //               .catch((err) => console.log(err));
        //           }
        //         })
        //         .catch((err) => {
        //           console.log(err);
        //         });
        //       //  data1.forEach(ele=>console.log(ele.data()))
        //     }
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
      });
    }
  });
//Function to generate FB long lived user access token and the associated pages
  exports.getLong_FB_UAT = functions.https.onCall(async (data, context) => {
    let shortUAT  = data.shortUAT;
    let response;
    try {
      // Get lead details by lead ID from Facebook API
       response =  await axios.get(
        `https://graph.facebook.com/v16.0/oauth/access_token?grant_type=fb_exchange_token&client_id=961512658158567&client_secret=c385cb5edcce9179908226b3b3e38f38&fb_exchange_token=${shortUAT}`
      )
      //console.warn("Token response", response.data.access_token)
      //console.warn("Token response", response.body)
      //getFBPages(response.data.access_token)
      let long_UAT = response.data.access_token
      try {
        // Get lead details by lead ID from Facebook API
         pageResponse =  await axios.get(
          `https://graph.facebook.com/v16.0/me/accounts?access_token=${long_UAT}`

        )
        console.warn("pages response", pageResponse.data)
        //console.warn("Token response", response.body)

      } catch (err) {
        // Log errors
        return console.warn(
          `An invalid response was received from the Facebook API for pages:`,
          err.response.data ? JSON.stringify(err.response.data) : err.response
        );
      }
      return {
        LongUAT : long_UAT,
        pages : pageResponse.data
      };
    } catch (err) {
      // Log errors
      return console.warn(
        `An invalid response was received from the Facebook API for long user access token:`,
        err.response.data ? JSON.stringify(err.response.data) : err.response
      );
    }
  }
  )


async function getFBLead(leadgen_id, longPAT , superUserId, form_id) {


  console.log("Lead gen id passed", leadgen_id);

  let response;
  //first fetch the page access token from db for the page
  try {
    // Get lead details by lead ID from Facebook API
    response = await axios.get(
      `https://graph.facebook.com/v16.0/${leadgen_id}/?access_token=${longPAT}`
    );
    getFormData(form_id,response.data.field_data);
  } catch (err) {
    // Log errors
    return console.warn(
      `An invalid response was received from the Facebook API:`,
      err.response.data ? JSON.stringify(err.response.data) : err.response
    );
  }

  // Ensure valid API response returned
  if (
    !response.data ||
    (response.data && (response.data.error || !response.data.field_data))
  ) {
    return console.warn(
      `An invalid response was received from the Facebook API: ${response}`
    );
  }

  // Lead fields
  const leadForm = [];

  // Extract fields
  for (const field of response.data.field_data) {
    // Get field name & value
    const fieldName = field.name;
    const fieldValue = field.values[0];

    // Store in lead array
    leadForm.push(`${fieldName}: ${fieldValue}`);
  }

  // Implode into string with newlines in between fields
  const leadInfo = leadForm.join("\n");

  // Log to console
  console.log("A new lead was received!\n", leadInfo);

  // Use a library like "nodemailer" to notify you about the new lead
  //
  // Send plaintext e-mail with nodemailer
  // transporter.sendMail({
  //     from: `Admin <admin@example.com>`,
  //     to: `You <you@example.com>`,
  //     subject: 'New Lead: ' + name,
  //     text: new Buffer(leadInfo),
  //     headers: { 'X-Entity-Ref-ID': 1 }
  // }, function (err) {
  //     if (err) return console.log(err);
  //     console.log('Message sent successfully.');
  // });

}


//Function to subscribe to FB leads app and add records
exports.fb_trial = functions
  .region(region)
  .https.onRequest(async (req, res) => {
    //Note - in php hub.mode is replaced by hub_mode - be mindful of this while refering to documentation

    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
// GET request section is used for validating and connecting the application via webhook
    if (req.method == "GET") {
      if (
        req.query["hub.mode"] === "subscribe" &&
        req.query["hub.verify_token"] === "abc123"
      ) {
        console.log("Validating webhook");
        res.status(200).send(req.query["hub.challenge"]);
      } else {
        console.error(
          "Failed validation. Make sure the validation tokens match."
        );
        res.sendStatus(403);
      }
    }
    //POST request section is used for receiving the lead gen data
    else if (req.method == "POST") {
      console.log("Data received1", req.body.object);
      console.log(
        "Data received2",
        req.body.entry[0].changes[0].value.leadgen_id
      );
      let leadgen_id = req.body.entry[0].changes[0].value.leadgen_id; //Get the lead id - used for getting the lead data

      let form_id = req.body.entry[0].changes[0].value.form_id; //Get the form id
      let page_id = req.body.entry[0].changes[0].value.page_id; //Get the page id


      //Next based on the page id, identify the super user, and get the page access long token and retrieve the lead using API
      admin
      .firestore()
      .doc("FBPages/" + page_id)
      .get()
      .then( async (FBPageData) => {
        let longPAT = FBPageData.data().pageToken;
        let superUserId = FBPageData.data().superUserID;
      console.log("FB Page details", longPAT, superUserId)
      await getFBLead(leadgen_id, longPAT , superUserId, form_id);
      res.sendStatus(200);

    })

    }
    //console.log("fb_trial called",token,challenge);
    //replace the token as a configuration from production environment and update in fb app configuration as well

    /*if (token === "abc123") {
    res.status(200).send(challenge);
  }*/
    //console.log("Data received1",req.body.object);
    //console.log("Data received2",req.body.entry[0].changes[0].value.leadgen_id);
  });
// create Sub merchant
exports.createSubMerchant = functions
  .region(region)
  .https.onRequest((req, res) => {
    if (path.includes(req.headers.origin)) {
      res.set("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        const axios = require("axios").default;
        // console.log(req.body);
        var data = JSON.stringify({
          email: req.body.email,
          phone: req.body.phNumber,
          legal_business_name: req.body.legalBusinessName,
          business_type: req.body.businessType,
          customer_facing_business_name: req.body.customerFacingName,
          profile: {
            category: req.body.businessCategory,
            subcategory: req.body.businessSubCategory,
            description: req.body.description,
            addresses: {
              registered: {
                street1: req.body.address1,
                street2: req.body.address2,
                city: req.body.city,
                state: req.body.state,
                postal_code: req.body.postalCode,
                country: req.body.country,
              },
            },
            business_model: req.body.businessModel,
          },
        });
        var credentials = Buffer.from(
          `${key_partner_id}:${key_partner_secret}`,
          "binary"
        ).toString("base64");
        const config = {
          method: "post",
          url: `https://api.razorpay.com/v2/accounts`,
          headers: {
            Authorization: "Basic " + credentials,
            "Content-Type": "application/json",
          },
          data: data,
        };
        // console.log(config);

        // var url = `https://${key_id}:${key_secret}@api.razorpay.com/v1/subscriptions/${req.body.subscription_id}/`;
        axios(config)
          .then(function (response) {
            console.log(response.data);
            const data2 = JSON.stringify({
              url: razorpayWebhookUrl,
              // alert_email: "gaurav.kumar@example.com",
              // secret: "12345",
              events: ["payment_link.paid"],
            });
            const config2 = {
              method: "post",
              url: `https://api.razorpay.com/v2/accounts/${response.data.id}/webhooks`,
              headers: {
                Authorization: "Basic " + credentials,
                "Content-Type": "application/json",
              },
              data: data2,
            };
            axios(config2)
              .then(function (response2) {
                console.log(response2.data);
                res
                  .send({ account: response.data, webhook: response2.data })
                  .status(200);
              })
              .catch(function (error) {
                res
                  .send({ webhook: error, account: response.data })
                  .status(200);
              });
          })
          .catch(function (error) {
            console.log("error 1st step");
            console.log(error);
            res.send(error).status(400);
          });
      });
      // });
      // });
    }
  });
exports.createSubMerchantPayLink = functions
  .region(region)
  .https.onRequest((req, res) => {
    if (path.includes(req.headers.origin)) {
      res.set("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        const axios = require("axios").default;
        // console.log(req.body);
        const amount = Number(req.body.amount);
        var data = JSON.stringify({
          account_id: req.body.account_id,
          amount: amount,
          currency: req.body.currency,
          customer: {
            name: req.body.name,
            contact: req.body.contact,
            email: req.body.email,
          },
          notify: {
            email: true,
            sms: true,
          },
        });
        var credentials = Buffer.from(
          `${key_partner_id}:${key_partner_secret}`,
          "binary"
        ).toString("base64");
        var config = {
          method: "post",
          url: `https://api.razorpay.com/v1/payment_links`,
          headers: {
            Authorization: "Basic " + credentials,
            "Content-Type": "application/json",
          },
          data: data,
        };
        // console.log(config);

        // var url = `https://${key_id}:${key_secret}@api.razorpay.com/v1/subscriptions/${req.body.subscription_id}/`;
        axios(config)
          .then(function (response) {
            console.log(response.data);
            res.send(response.data);
          })
          .catch(function (error) {
            console.log(error);
            res.send(error);
          });
      });
      // });
      // });
    }
  });

exports.createStripeAccount = functions
  .region(region)
  .https.onRequest((req, res) => {
    if (path.includes(req.headers.origin)) {
      res.set("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        const stripe = require("stripe")(stripe_key);
        console.log(req.body);
        const account = stripe.accounts.create({
          type: "standard",
          country: req.body.country,
          // email: req.body.email,
        });
        account
          .then((data1) => {
            if (data1.id) {
              stripe.accountLinks
                .create({
                  account: data1.id,
                  refresh_url:
                    req.headers.origin + "/stripe/striperefreshurl/" + data1.id,
                  return_url: req.headers.origin + "/dash/home",
                  type: "account_onboarding",
                })
                .then((data) => {
                  console.log(data);
                  res.status(200).send({ ...data, accountId: data1.id });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).send(err);
                });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send(err);
          });
      });
      // });
      // });
    }
  });

exports.createAccountLink = functions
  .region(region)
  .https.onRequest((req, res) => {
    if (path.includes(req.headers.origin)) {
      res.set("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        const stripe = require("stripe")(stripe_key);
        console.log(req.body);

        if (!!req.body.accountId) {
          stripe.accountLinks
            .create({
              account: req.body.accountId,
              refresh_url:
                req.headers.origin + "/stripe/striperefreshurl/" + req.body.id,
              return_url: req.headers.origin + "/dash/home",
              type: "account_onboarding",
            })
            .then((data) => {
              console.log(data);
              res.send({ ...data, accountId: req.body.id }).status(200);
            })
            .catch((err) => {
              res.send(err).status(400);
            });
        }
        // })
      });
      // });
      // });
    }
  });

exports.retrieveStripeAccount = functions
  .region(region)
  .https.onRequest((req, res) => {
    if (path.includes(req.headers.origin)) {
      res.set("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        const stripe = require("stripe")(stripe_key);
        console.log(req.body);
        const account = stripe.accounts.retrieve(req.body.stripeAccountId);
        account
          .then((data) => {
            res.send(data).status(200);
          })
          .catch((err) => {
            console.log(err);
            res.send(err).status(400);
          });
      });
      // });
      // });
    }
  });

exports.createStripeCheckoutSession = functions
  .region(region)
  .https.onRequest((req, res) => {
    if (path.includes(req.headers.origin)) {
      res.set("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        const stripe = require("stripe")(stripe_key);
        console.log(req.body);
        const objData = {
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: req.body.currency,
                product_data: {
                  name: req.body.type + " Id:" + req.body.docId,
                },
                unit_amount: req.body.amount,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url:
            req.headers.origin +
            "/stripe/success/" +
            req.body.userId +
            "/" +
            req.body.docId +
            "/" +
            req.body.type,
          cancel_url: req.headers.origin + "/stripe/cancel",
        };
        console.log(objData);
        const session = stripe.checkout.sessions.create(objData, {
          stripeAccount: req.body.stripeAccountId,
        });
        session
          .then((data) => {
            console.log(data);
            var stripeCheckoutSessions = {
              sessionId: data.id,
              superUserId: req.body.superUserId,
              docId: req.body.docId,
              paymentIntent: data.payment_intent,
              createdById: req.body.createdById,
              customerCompany: req.body.customerCompany,
              customerId: req.body.customerId,
              customerName: req.body.customerName,
              customerSecondName: req.body.customerSecondName,
              currency: req.body.currency,
              saleTitle: req.body.saleTitle,
              saleid: req.body.saleid,
              paidFlag: false,
              type: req.body.type,
            };
            if (req.body.docprefixAndDocNumber) {
              stripeCheckoutSessions.docprefixAndDocNumber =
                req.body.docprefixAndDocNumber;
            }
            return admin
              .firestore()
              .doc("StripeSessions/" + data.payment_intent)
              .set(stripeCheckoutSessions)
              .then(() => {
                res.send({ sessionId: data.id }).status(200);
              });
          })
          .catch((err) => {
            console.log(err);
            res.send(err).status(400);
          });
      });
      // });
      // });
    }
  });

exports.retireveStripeCheckoutSession = functions
  .region(region)
  .https.onRequest((req, res) => {
    if (path.includes(req.headers.origin)) {
      res.set("Access-Control-Allow-Origin", req.headers.origin);
    }
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        const stripe = require("stripe")(stripe_key);
        // console.log(req.body);
        const session = stripe.checkout.sessions.retrieve(req.body.sessionId, {
          stripeAccount: req.body.stripeAccountId,
        });
        session
          .then((data) => {
            res.send(data).status(200);
          })
          .catch((err) => {
            console.log(err);
            // res.send(err).status(400);
          });
      });
      // });
      // });
    }
  });

exports.stripeWebhookTest = functions
  .region(region)
  .https.onRequest((req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      // Send response to OPTIONS requests
      res.set("Access-Control-Allow-Methods", "POST");
      res.set(
        "Content-Type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      res.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
      );
      res.set("Access-Control-Max-Age", "3600");
      res.status(204).send("");
    } else {
      return cors(req, res, () => {
        res.status(200).send({});
        console.log(req.body);
        if (req.body.type == "payment_intent.succeeded") {
          return admin
            .firestore()
            .doc("StripeSessions/" + req.body.data.object.id)
            .get()
            .then((sessionData) => {
              console.log(sessionData.data());
              if (!sessionData.data().paidFlag) {
                const collectionData = {
                  amountCollected: req.body.data.object.amount_received / 100,
                  createDate: Date.now(),
                  createdById: sessionData.data().createdById,
                  customerCompany: sessionData.data().customerCompany,
                  customerId: sessionData.data().customerId,
                  customerName: sessionData.data().customerName,
                  customerSecondName: sessionData.data().customerSecondName,
                  // invoiceno: sessionData.data().docId,
                  currency: req.body.data.object.currency.toUpperCase(),
                  saleTitle: sessionData.data().saleTitle,
                  saleid: sessionData.data().saleid,
                  paymentDate: new Date(),
                  // paymentType: "Against Invoice",
                  paymentMode: "Online through Zenys App",
                };
                if (sessionData.data().type == "Invoice") {
                  collectionData.invoiceprefixAndDocNumber = sessionData.data()
                    .docprefixAndDocNumber
                    ? sessionData.data().docprefixAndDocNumber
                    : "";
                  collectionData.paymentType = "Against Invoice";
                  collectionData.invoiceno = sessionData.data().docId;
                } else collectionData.paymentType = "Advance payment";

                return admin
                  .firestore()
                  .collection(
                    "users/" +
                      sessionData.data().superUserId +
                      "/paymentsreceived/"
                  )
                  .add(collectionData)
                  .then(() => {
                    console.log("added payment in payment recieved");
                    return admin
                      .firestore()
                      .doc("StripeSessions/" + req.body.data.object.id)
                      .update({
                        paidFlag: true,
                      })
                      .then(() => {
                        console.log("session document updated");
                        if (sessionData.data().type != "Invoice") {
                          return admin
                            .firestore()
                            .doc(
                              "users/" +
                                sessionData.data().superUserId +
                                "/" +
                                sessionData.data().type +
                                "s/" +
                                sessionData.data().docId
                            )
                            .update({
                              collectedAmount:
                                req.body.data.object.amount_received / 100,
                            });
                        }
                      });
                  })
                  .catch((e) => {
                    console.log(e);
                  })
                  .catch((e) => {
                    res.status(400).send(e);
                  });
              }
            });
        }
      });
    }
  });
// used in invoice and product dd
function getSaleDeatils(userId, saleID) {
  return new Promise(function (resolve, reject) {
    admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("sales")
      .doc(saleID)
      .get()
      .then((data) => {
        resolve(data.data());
      });
  });
}
// used in invoice and product dd
function getContactDeatils(userId, customerID) {
  return new Promise(function (resolve, reject) {
    admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("customers")
      .doc(customerID)
      .get()
      .then((data) => {
        resolve(data.data());
      });
  });
}
// on create invoice update the sale, org and customer invoiced amout
exports.onInvoiceCreateUpdateDetails = functions
  .region(region)
  .firestore.document("/users/{userId}/Invoices/{documentId}")
  .onCreate((snap, context) => {
    var userId = context.params.userId;
    let transactionPromiseSale;
    if (snap.data().docData.saleID) {
      transactionPromiseSale = admin
        .firestore()
        .runTransaction((t) => {
          const saleDeailRef = admin
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("sales")
            .doc(snap.data().docData.saleID);

          return t.get(saleDeailRef).then((doc) => {
            let totalInvoiceAmout =
              doc.data().invoicedAmount + snap.data().docData.totalInclTax;

            let newTotalInvoiceAmout = totalInvoiceAmout;
            if (typeof totalInvoiceAmout == "number") {
              newTotalInvoiceAmout = Number(totalInvoiceAmout).toFixed(2);
            }
            t.update(saleDeailRef, {
              invoicedAmount: Number(newTotalInvoiceAmout),
            });
          });
        })
        .then((result) => {
          console.info("Transaction success!");
        })
        .catch((err) => {
          console.error("Transaction failure:", err);
        });
    }
    let transactionPromiseCustomer;
    if (snap.data().customerData.custID) {
      transactionPromiseCustomer = admin
        .firestore()
        .runTransaction((t) => {
          const customerDeailRef = admin
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("customers")
            .doc(snap.data().customerData.custID);

          return t.get(customerDeailRef).then((doc) => {
            let totalInvoiceAmoutCust =
              doc.data().invoicedAmount + snap.data().docData.totalInclTax;

            let newTotalInvoiceAmoutCust = totalInvoiceAmoutCust;
            if (typeof totalInvoiceAmoutCust == "number") {
              newTotalInvoiceAmoutCust = Number(totalInvoiceAmoutCust).toFixed(
                2
              );
            }
            t.update(customerDeailRef, {
              invoicedAmount: Number(newTotalInvoiceAmoutCust),
            });
          });
        })
        .then((result) => {
          console.info("Transaction success!");
        })
        .catch((err) => {
          console.error("Transaction failure:", err);
        });
    }
    let transactionPromiseOrg;
    if (snap.data().customerData.orgID) {
      transactionPromiseOrg = admin
        .firestore()
        .runTransaction((t) => {
          const orgDeailRef = admin
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("Organisations")
            .doc(snap.data().customerData.orgID);

          return t.get(orgDeailRef).then((doc) => {
            let totalInvoiceAmoutOrg =
              doc.data().invoiced + snap.data().docData.totalInclTax;

            let newTotalInvoiceAmoutOrg = totalInvoiceAmoutOrg;
            if (typeof totalInvoiceAmoutOrg == "number") {
              newTotalInvoiceAmoutOrg = Number(totalInvoiceAmoutOrg).toFixed(2);
            }
            t.update(orgDeailRef, {
              invoiced: Number(newTotalInvoiceAmoutOrg),
            });
          });
        })
        .then((result) => {
          console.info("Transaction success!");
        })
        .catch((err) => {
          console.error("Transaction failure:", err);
        });
    }
    return Promise.all([
      transactionPromiseSale,
      transactionPromiseCustomer,
      transactionPromiseOrg,
    ]);
  });
// on edit invoice update the sale and customer invoiced amout
exports.onInvoiceEditUpdateDetails = functions
  .region(region)
  .firestore.document("/users/{userId}/Invoices/{documentId}")
  .onUpdate(async (change, context) => {
    var invoiceDetails = change.after.data();
    var previousInvoiceDetails = change.before.data();
    var userId = context.params.userId;
    if (invoiceDetails.docData.cancel) {
      if (!previousInvoiceDetails.docData.cancel) {
        let transactionPromiseSale;
        if (change.after.data().docData.saleID) {
          transactionPromiseSale = admin
            .firestore()
            .runTransaction((t) => {
              const saleDeailRef = admin
                .firestore()
                .collection("users")
                .doc(userId)
                .collection("sales")
                .doc(change.after.data().docData.saleID);
              return t.get(saleDeailRef).then((doc) => {
                let totalInvoiceAmout =
                  doc.data().invoicedAmount -
                  change.after.data().docData.totalInclTax;

                let newTotalInvoiceAmout = totalInvoiceAmout;
                if (typeof totalInvoiceAmout == "number") {
                  newTotalInvoiceAmout = Number(totalInvoiceAmout).toFixed(2);
                }
                t.update(saleDeailRef, {
                  invoicedAmount: Number(newTotalInvoiceAmout),
                });
              });
            })
            .then((result) => {
              console.info("Transaction success!");
            })
            .catch((err) => {
              console.error("Transaction failure:", err);
            });
        }
        let transactionPromiseCustomer;
        if (change.after.data().customerData.custID) {
          transactionPromiseCustomer = admin
            .firestore()
            .runTransaction((t) => {
              const customerDeailRef = admin
                .firestore()
                .collection("users")
                .doc(userId)
                .collection("customers")
                .doc(change.after.data().customerData.custID);
              return t.get(customerDeailRef).then((doc) => {
                let totalInvoiceAmoutCust =
                  doc.data().invoicedAmount -
                  change.after.data().docData.totalInclTax;

                let newTotalInvoiceAmoutCust = totalInvoiceAmoutCust;
                if (typeof totalInvoiceAmoutCust == "number") {
                  newTotalInvoiceAmoutCust = Number(
                    totalInvoiceAmoutCust
                  ).toFixed(2);
                }
                t.update(customerDeailRef, {
                  invoicedAmount: Number(newTotalInvoiceAmoutCust),
                });
              });
            })
            .then((result) => {
              console.info("Transaction success!");
            })
            .catch((err) => {
              console.error("Transaction failure:", err);
            });
        }
        let transactionPromiseOrg;
        if (change.after.data().customerData.orgID) {
          transactionPromiseOrg = admin
            .firestore()
            .runTransaction((t) => {
              const orgDeailRef = admin
                .firestore()
                .collection("users")
                .doc(userId)
                .collection("Organisations")
                .doc(change.after.data().customerData.orgID);
              return t.get(orgDeailRef).then((doc) => {
                let totalInvoiceAmoutOrg =
                  doc.data().invoiced -
                  change.after.data().docData.totalInclTax;

                let newTotalInvoiceAmoutOrg = totalInvoiceAmoutOrg;
                if (typeof totalInvoiceAmoutOrg == "number") {
                  newTotalInvoiceAmoutOrg =
                    Number(totalInvoiceAmoutOrg).toFixed(2);
                }
                t.update(orgDeailRef, {
                  invoiced: Number(newTotalInvoiceAmoutOrg),
                });
              });
            })
            .then((result) => {
              console.info("Transaction success!");
            })
            .catch((err) => {
              console.error("Transaction failure:", err);
            });
        }
        return Promise.all([
          transactionPromiseSale,
          transactionPromiseCustomer,
          transactionPromiseOrg,
        ]);
      }
    } else {
      // if old and new invoiced amount is different
      if (
        previousInvoiceDetails.docData.totalInclTax !=
        invoiceDetails.docData.totalInclTax
      ) {
        // calculate the difference and add the invoice value
        var previoutTotalIncomeTax =
          previousInvoiceDetails.docData.totalInclTax;
        var currentIncomeTax = invoiceDetails.docData.totalInclTax;
        var incomeTaxVariation = currentIncomeTax - previoutTotalIncomeTax;
        let transactionPromiseSale;
        if (change.after.data().docData.saleID) {
          if (
            change.after.data().docData.saleID ==
            change.before.data().docData.saleID
          ) {
            transactionPromiseSale = admin
              .firestore()
              .runTransaction((t) => {
                const saleDeailRef = admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("sales")
                  .doc(change.after.data().docData.saleID);
                return t.get(saleDeailRef).then((doc) => {
                  let totalInvoiceAmout =
                    doc.data().invoicedAmount + incomeTaxVariation;

                  let newTotalInvoiceAmout = totalInvoiceAmout;
                  if (typeof totalInvoiceAmout == "number") {
                    newTotalInvoiceAmout = Number(totalInvoiceAmout).toFixed(2);
                  }
                  t.update(saleDeailRef, {
                    invoicedAmount: Number(newTotalInvoiceAmout),
                  });
                });
              })
              .then((result) => {
                console.info("Transaction success!");
              })
              .catch((err) => {
                console.error("Transaction failure:", err);
              });
          } else {
            transactionPromiseSale = admin
              .firestore()
              .runTransaction((t) => {
                const saleDeailRef = admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("sales")
                  .doc(change.after.data().docData.saleID);
                return t.get(saleDeailRef).then((doc) => {
                  let totalInvoiceAmout =
                    doc.data().invoicedAmount +
                    change.after.data().docData.totalInclTax;

                  let newTotalInvoiceAmout = totalInvoiceAmout;
                  if (typeof totalInvoiceAmout == "number") {
                    newTotalInvoiceAmout = Number(totalInvoiceAmout).toFixed(2);
                  }
                  t.update(saleDeailRef, {
                    invoicedAmount: Number(newTotalInvoiceAmout),
                  });
                });
              })
              .then((result) => {
                console.info("Transaction success!");
              })
              .catch((err) => {
                console.error("Transaction failure:", err);
              });
          }
        }

        let transactionPromiseCustomer;
        if (change.after.data().customerData.custID) {
          if (
            change.after.data().customerData.custID ==
            change.before.data().customerData.custID
          ) {
            transactionPromiseCustomer = admin
              .firestore()
              .runTransaction((t) => {
                const customerDeailRef = admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("customers")
                  .doc(change.after.data().customerData.custID);
                return t.get(customerDeailRef).then((doc) => {
                  let totalInvoiceAmoutCust =
                    doc.data().invoicedAmount + incomeTaxVariation;

                  let newTotalInvoiceAmoutCust = totalInvoiceAmoutCust;
                  if (typeof totalInvoiceAmoutCust == "number") {
                    newTotalInvoiceAmoutCust = Number(
                      totalInvoiceAmoutCust
                    ).toFixed(2);
                  }
                  t.update(customerDeailRef, {
                    invoicedAmount: Number(newTotalInvoiceAmoutCust),
                  });
                });
              })
              .then((result) => {
                console.info("Transaction success!");
              })
              .catch((err) => {
                console.error("Transaction failure:", err);
              });
          } else {
            transactionPromiseCustomer = admin
              .firestore()
              .runTransaction((t) => {
                const customerDeailRef = admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("customers")
                  .doc(change.after.data().customerData.custID);
                return t.get(customerDeailRef).then((doc) => {
                  let totalInvoiceAmoutCust =
                    doc.data().invoicedAmount +
                    change.after.data().docData.totalInclTax;

                  let newTotalInvoiceAmoutCust = totalInvoiceAmoutCust;
                  if (typeof totalInvoiceAmoutCust == "number") {
                    newTotalInvoiceAmoutCust = Number(
                      totalInvoiceAmoutCust
                    ).toFixed(2);
                  }
                  t.update(customerDeailRef, {
                    invoicedAmount: Number(newTotalInvoiceAmoutCust),
                  });
                });
              })
              .then((result) => {
                console.info("Transaction success!");
              })
              .catch((err) => {
                console.error("Transaction failure:", err);
              });
          }
        }
        let transactionPromiseOrg;
        if (change.after.data().customerData.orgID) {
          if (
            change.after.data().customerData.orgID ==
            change.before.data().customerData.orgID
          ) {
            transactionPromiseOrg = admin
              .firestore()
              .runTransaction((t) => {
                const orgDeailRef = admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("Organisations")
                  .doc(change.after.data().customerData.orgID);
                return t.get(orgDeailRef).then((doc) => {
                  let totalInvoiceAmoutOrg =
                    doc.data().invoiced + incomeTaxVariation;

                  let newTotalInvoiceAmoutOrg = totalInvoiceAmoutOrg;
                  if (typeof totalInvoiceAmoutOrg == "number") {
                    newTotalInvoiceAmoutOrg =
                      Number(totalInvoiceAmoutOrg).toFixed(2);
                  }
                  t.update(orgDeailRef, {
                    invoiced: Number(newTotalInvoiceAmoutOrg),
                  });
                });
              })
              .then((result) => {
                console.info("Transaction success!");
              })
              .catch((err) => {
                console.error("Transaction failure:", err);
              });
          } else {
            transactionPromiseOrg = admin
              .firestore()
              .runTransaction((t) => {
                const orgDeailRef = admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("Organisations")
                  .doc(change.after.data().customerData.orgID);
                return t.get(orgDeailRef).then((doc) => {
                  let totalInvoiceAmoutOrg =
                    doc.data().invoiced +
                    change.after.data().docData.totalInclTax;

                  let newTotalInvoiceAmoutOrg = totalInvoiceAmoutOrg;
                  if (typeof totalInvoiceAmoutOrg == "number") {
                    newTotalInvoiceAmoutOrg =
                      Number(totalInvoiceAmoutOrg).toFixed(2);
                  }
                  t.update(orgDeailRef, {
                    invoiced: Number(newTotalInvoiceAmoutOrg),
                  });
                });
              })
              .then((result) => {
                console.info("Transaction success!");
              })
              .catch((err) => {
                console.error("Transaction failure:", err);
              });
          }
        }

        return Promise.all([
          transactionPromiseSale,
          transactionPromiseCustomer,
          transactionPromiseOrg,
        ]);
      } else {
        let transactionPromiseSale;
        if (change.after.data().docData.saleID) {
          if (
            change.after.data().docData.saleID !=
            change.before.data().docData.saleID
          ) {
            transactionPromiseSale = admin
              .firestore()
              .runTransaction((t) => {
                const saleDeailRef = admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("sales")
                  .doc(change.after.data().docData.saleID);
                return t.get(saleDeailRef).then((doc) => {
                  let totalInvoiceAmout =
                    doc.data().invoicedAmount +
                    change.after.data().docData.totalInclTax;

                  let newTotalInvoiceAmout = totalInvoiceAmout;
                  if (typeof totalInvoiceAmout == "number") {
                    newTotalInvoiceAmout = Number(totalInvoiceAmout).toFixed(2);
                  }
                  t.update(saleDeailRef, {
                    invoicedAmount: Number(newTotalInvoiceAmout),
                  });
                });
              })
              .then((result) => {
                console.info("Transaction success!");
              })
              .catch((err) => {
                console.error("Transaction failure:", err);
              });
          }
        }
        let transactionPromiseCustomer;
        if (change.after.data().customerData.custID) {
          if (
            change.after.data().customerData.custID !=
            change.before.data().customerData.custID
          ) {
            transactionPromiseCustomer = admin
              .firestore()
              .runTransaction((t) => {
                const customerDeailRef = admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("customers")
                  .doc(change.after.data().customerData.custID);
                return t.get(customerDeailRef).then((doc) => {
                  let totalInvoiceAmoutCust =
                    doc.data().invoicedAmount +
                    change.after.data().docData.totalInclTax;

                  let newTotalInvoiceAmoutCust = totalInvoiceAmoutCust;
                  if (typeof totalInvoiceAmoutCust == "number") {
                    newTotalInvoiceAmoutCust = Number(
                      totalInvoiceAmoutCust
                    ).toFixed(2);
                  }
                  t.update(customerDeailRef, {
                    invoicedAmount: Number(newTotalInvoiceAmoutCust),
                  });
                });
              })
              .then((result) => {
                console.info("Transaction success!");
              })
              .catch((err) => {
                console.error("Transaction failure:", err);
              });
          }
        }
        let transactionPromiseOrg;
        if (change.after.data().customerData.orgID) {
          if (
            change.after.data().customerData.orgID !=
            change.before.data().customerData.orgID
          ) {
            transactionPromiseOrg = admin
              .firestore()
              .runTransaction((t) => {
                const orgDeailRef = admin
                  .firestore()
                  .collection("users")
                  .doc(userId)
                  .collection("Organisations")
                  .doc(change.after.data().customerData.orgID);
                return t.get(orgDeailRef).then((doc) => {
                  let totalInvoiceAmoutOrg =
                    doc.data().invoiced +
                    change.after.data().docData.totalInclTax;

                  let newTotalInvoiceAmoutOrg = totalInvoiceAmoutOrg;
                  if (typeof totalInvoiceAmoutOrg == "number") {
                    newTotalInvoiceAmoutOrg =
                      Number(totalInvoiceAmoutOrg).toFixed(2);
                  }
                  t.update(orgDeailRef, {
                    invoiced: Number(newTotalInvoiceAmoutOrg),
                  });
                });
              })
              .then((result) => {
                console.info("Transaction success!");
              })
              .catch((err) => {
                console.error("Transaction failure:", err);
              });
          }
        }
        return Promise.all([
          transactionPromiseSale,
          transactionPromiseCustomer,
          transactionPromiseOrg,
        ]);
      }
    }
  });

// test starts here
function sendSMS(data, rule, type, userId) {
  var msgData = {
    to: "",
    html: "",
  }; //sms data format

  let superUserDetails = data.superData; //superuser details saving to local variable

  // sms credentials
  const smsApiUserName = superUserDetails.smsApiUserName;
  const smsApiPwd = superUserDetails.smsApiPwd;
  const smsApiSenderId = superUserDetails.smsApiSenderId;
  const smsApiEntityId = superUserDetails.smsApiEntityId;

  // whatsapp credentials
  const waBusProvider = superUserDetails.waBusProvider;
  const waBusAuthKey = superUserDetails.waBusAuthKey;
  const waBusURL = superUserDetails.waBusURL;
  const waBusIntId = superUserDetails.waBusIntId;
  const waBusAppId = superUserDetails.waBusAppId;
  const waBusSourceNo = superUserDetails.waBusSourceNo;
  let contactPipelines = []; //contact pipelines saved under pipelines collections of a superuser
  let salePipelines = []; //sale pipelines saved under pipelines collections of a superuser
  let servicePipelines = []; //service pipelines saved under pipelines collections of a superuser


  getContactPipelines(userId).then(pipeline=>{
    contactPipelines = pipeline.customerPipelines;
    if (type == "contact") {
      var contact = data;
      var assignedTo;

      // get superuser details first
      // getassignedToUser(userId).then((superUserDetails) => {
      if (superUserDetails) {
        // we need to fetch other details of assigned to user
        getassignedToUser(data.assignedTo).then((assUser) => {
          assignedTo = assUser;

          if (assignedTo) {
            getSMSTemplate(userId, rule.data.templateId).then((template) => {
              msgData.to = eval(rule.data.To);
              if (template) {
                if (template.templateType === "SMS") {
                  const smsApiTemplateId = template.smsApiTemplateId;
                  msgData.html = template.body
                    .replace(/\#\[contact.Company Name\]/g, contact.companyName)
                    .replace(/\#\[contact.First Name\]/g, contact.firstName)
                    .replace(
                      /\#\[contact.Second Name\]/g,
                      contact.secondName ? contact.secondName : ""
                    )
                    .replace(
                      /\#\[contact.Contact No\]/g,
                      contact.contactNo
                        ? contact.contactNo
                        : "Contact Number not provided"
                    )
                    .replace(
                      /\#\[contact.Email\]/g,
                      contact.email ? contact.email : "Email not provided"
                    )
                    .replace(/\#\[contact.Priority\]/g, contact.priority)
                    .replace(/\#\[contact.Status\]/g, getStatusName(contactPipelines,contact.selectedContactPipeline,contact.status))
                    .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
                    .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
                    .replace(
                      /\#\[user.Last Name\]/g,
                      assignedTo.lastname ? assignedTo.lastname : ""
                    )
                    .replace(
                      /\#\[user.Contact No\]/g,
                      assignedTo.phone
                        ? assignedTo.phone
                        : "Contact Number not provided"
                    )
                    .replace(
                      /\#\[user.Email\]/g,
                      assignedTo.email ? assignedTo.email : "Email not provided"
                    );

                  if (superUserDetails.customFieldsContact) {
                    let teststring = msgData.html;
                    for (
                      let i = 0;
                      i < superUserDetails.customFieldsContact.length;
                      i++
                    ) {
                      if (
                        superUserDetails.customFieldsContact[i].isActive === true
                      ) {
                        var str1 =
                          "\\#\\[contact." +
                          superUserDetails.customFieldsContact[i].fieldName +
                          "\\]";

                        var re = new RegExp(str1, "g");
                        teststring = teststring.replace(
                          re,
                          contact.additionalFieldsArr[i + ""]
                            ? contact.additionalFieldsArr[i + ""].fieldValue
                              ? superUserDetails.customFieldsContact[i]
                                  .fieldType == "date"
                                ? convertDate(
                                    contact.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : superUserDetails.customFieldsContact[i]
                                    .fieldType == "date_time"
                                ? convertDateTime(
                                    contact.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : contact.additionalFieldsArr[i + ""].fieldValue
                              : ""
                            : ""
                        );
                      }
                    }
                    msgData.html = teststring;
                  }
                  messageConverted(msgData.html).then((data) => {
                    sendSMSfn(
                      msgData.to,
                      data,
                      smsApiUserName,
                      smsApiPwd,
                      smsApiSenderId,
                      smsApiEntityId,
                      smsApiTemplateId
                    );
                  });
                } else if (template.templateType === "WhatsApp") {
                  // call send whatsapp fn with datas
                  sendWhatsappmsg(
                    contactPipelines,
                    salePipelines,
                    servicePipelines,
                    superUserDetails.timeZone
                      ? superUserDetails.timeZone
                      : "Asia/Calcutta",
                    superUserDetails.customFieldsContact
                      ? superUserDetails.customFieldsContact
                      : null,
                    superUserDetails.customFieldsSale
                      ? superUserDetails.customFieldsSale
                      : null,
                    superUserDetails.customFieldsService
                      ? superUserDetails.customFieldsService
                      : null,
                    superUserDetails.customFieldsEstimate
                      ? superUserDetails.customFieldsEstimate
                      : null,
                    superUserDetails.customFieldsQuotation
                      ? superUserDetails.customFieldsQuotation
                      : null,
                    superUserDetails.customFieldsInvoices
                      ? superUserDetails.customFieldsInvoices
                      : null,
                    superUserDetails.customFieldsPayment
                      ? superUserDetails.customFieldsPayment
                      : null,
                    waBusProvider ? waBusProvider : null,
                    waBusAuthKey ? waBusAuthKey : null,
                    waBusURL ? waBusURL : null,
                    waBusIntId ? waBusIntId : null,
                    waBusAppId ? waBusAppId : null,
                    waBusSourceNo ? waBusSourceNo : null,
                    msgData.to,
                    template.body,
                    template.templateNameSpaceWa
                      ? template.templateNameSpaceWa
                      : null,
                    template.templateName ? template.templateName : null,
                    template.tLangCode ? template.tLangCode : null,
                    template.image_link ? template.image_link : null,
                    template.video_link ? template.video_link : null,
                    template.document_link ? template.document_link : null,
                    template.document_name ? template.document_name : null,
                    assignedTo,
                    contact,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                  );
                }
              }
            });
          }
        });
      }
      // });
    } else if (type == "sale") {
      var sale = data;
      var contact;
      var assignedTo;

      getSalePipelines(userId).then(salePipeline=>{
        salePipelines = salePipeline.salePipelines;
      // we need to fetch contact and assigned user details
      if (superUserDetails) {
        // we need to fetch other details of assigned to user
        getassignedToUser(sale.assignedTo).then((assUser) => {
          assignedTo = assUser;
          if (assignedTo) {
            // getContactDetails(userId, sale.customerId).then((saleCont) => {
            contact = sale.contData;
            if (contact) {
              getSMSTemplate(userId, rule.data.templateId).then((template) => {
                msgData.to = eval(rule.data.To);
                if (template) {
                  if (template.templateType === "SMS") {
                    const smsApiTemplateId = template.smsApiTemplateId;
                    msgData.html = template.body
                      .replace(/\#\[sale.Sale Title\]/g, sale.saleTitle)
                      .replace(/\#\[sale.Estimated Value\]/g, sale.estimatedValue)
                      .replace(
                        /\#\[sale.Start Date\]/g,
                        convertDate(sale.startDate, superUserDetails.timeZone)
                      )
                      .replace(
                        /\#\[sale.Expected Completion Date\]/g,
                        convertDate(
                          sale.expCompletionDate,
                          superUserDetails.timeZone
                        )
                      )
                      .replace(/\#\[sale.Stage\]/g, getStatusName(salePipelines, sale.selectedSalePipeline,sale.salesStage))
                      .replace(/\#\[sale.Priority\]/g, sale.priority)
                      .replace(/\#\[sale.Assigned To\]/g, sale.assignedToName)
                      .replace(
                        /\#\[sale.Description\]/g,
                        sale.description
                          ? sale.description
                          : "Sale Description not provided"
                      )
                      .replace(/\#\[contact.Company Name\]/g, contact.companyName)
                      .replace(/\#\[contact.First Name\]/g, contact.firstName)
                      .replace(
                        /\#\[contact.Second Name\]/g,
                        contact.secondName ? contact.secondName : ""
                      )
                      .replace(
                        /\#\[contact.Contact No\]/g,
                        contact.contactNo
                          ? contact.contactNo
                          : "Contact Number not provided"
                      )
                      .replace(
                        /\#\[contact.Email\]/g,
                        contact.email ? contact.email : "Email not provided"
                      )
                      .replace(/\#\[contact.Priority\]/g, contact.priority)
                      .replace(/\#\[contact.Status\]/g, getStatusName(contactPipelines,contact.selectedContactPipeline,contact.status))
                      .replace(
                        /\#\[contact.Assigned To\]/g,
                        contact.assignedToName
                      )
                      .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
                      .replace(
                        /\#\[user.Last Name\]/g,
                        assignedTo.lastname ? assignedTo.lastname : ""
                      )
                      .replace(
                        /\#\[user.Contact No\]/g,
                        assignedTo.phone
                          ? assignedTo.phone
                          : "Contact Number not provided"
                      )
                      .replace(
                        /\#\[user.Email\]/g,
                        assignedTo.email ? assignedTo.email : ""
                      );

                    // contact additional fields
                    if (superUserDetails.customFieldsContact) {
                      let teststring = msgData.html;
                      for (
                        let i = 0;
                        i < superUserDetails.customFieldsContact.length;
                        i++
                      ) {
                        if (
                          superUserDetails.customFieldsContact[i].isActive ===
                          true
                        ) {
                          var str1 =
                            "\\#\\[contact." +
                            superUserDetails.customFieldsContact[i].fieldName +
                            "\\]";

                          var re = new RegExp(str1, "g");
                          teststring = teststring.replace(
                            re,
                            contact.additionalFieldsArr[i + ""]
                              ? contact.additionalFieldsArr[i + ""].fieldValue
                                ? superUserDetails.customFieldsContact[i]
                                    .fieldType == "date"
                                  ? convertDate(
                                      contact.additionalFieldsArr[i + ""]
                                        .fieldValue,
                                      superUserDetails.timeZone
                                    )
                                  : superUserDetails.customFieldsContact[i]
                                      .fieldType == "date_time"
                                  ? convertDateTime(
                                      contact.additionalFieldsArr[i + ""]
                                        .fieldValue,
                                      superUserDetails.timeZone
                                    )
                                  : contact.additionalFieldsArr[i + ""].fieldValue
                                : ""
                              : ""
                          );
                        }
                      }

                      msgData.html = teststring;
                    }

                    // sale additional fields
                    if (superUserDetails.customFieldsSale) {
                      let str = msgData.html;
                      for (
                        let i = 0;
                        i < superUserDetails.customFieldsSale.length;
                        i++
                      ) {
                        if (
                          superUserDetails.customFieldsSale[i].isActive === true
                        ) {
                          var str1 =
                            "\\#\\[sale." +
                            superUserDetails.customFieldsSale[i].fieldName +
                            "\\]";
                          var re = new RegExp(str1, "g");
                          str = str.replace(
                            re,
                            sale.additionalFieldsArr[i + ""]
                              ? sale.additionalFieldsArr[i + ""].fieldValue
                                ? superUserDetails.customFieldsSale[i]
                                    .fieldType == "date"
                                  ? convertDate(
                                      sale.additionalFieldsArr[i + ""].fieldValue,
                                      superUserDetails.timeZone
                                    )
                                  : superUserDetails.customFieldsSale[i]
                                      .fieldType == "date_time"
                                  ? convertDateTime(
                                      sale.additionalFieldsArr[i + ""].fieldValue,
                                      superUserDetails.timeZone
                                    )
                                  : sale.additionalFieldsArr[i + ""].fieldValue
                                : ""
                              : ""
                          );
                        }
                      }
                      msgData.html = str;
                    }
                    messageConverted(msgData.html).then((data) => {
                      sendSMSfn(
                        msgData.to,
                        data,
                        smsApiUserName,
                        smsApiPwd,
                        smsApiSenderId,
                        smsApiEntityId,
                        smsApiTemplateId
                      );
                    });
                  } else if (template.templateType === "WhatsApp") {
                    // call send whatsapp fn with datas
                    sendWhatsappmsg(
                      contactPipelines,
                      salePipelines,
                      servicePipelines,
                      superUserDetails.timeZone
                        ? superUserDetails.timeZone
                        : "Asia/Calcutta",
                      superUserDetails.customFieldsContact
                        ? superUserDetails.customFieldsContact
                        : null,
                      superUserDetails.customFieldsSale
                        ? superUserDetails.customFieldsSale
                        : null,
                      superUserDetails.customFieldsService
                        ? superUserDetails.customFieldsService
                        : null,
                      superUserDetails.customFieldsEstimate
                        ? superUserDetails.customFieldsEstimate
                        : null,
                      superUserDetails.customFieldsQuotation
                        ? superUserDetails.customFieldsQuotation
                        : null,
                      superUserDetails.customFieldsInvoices
                        ? superUserDetails.customFieldsInvoices
                        : null,
                      superUserDetails.customFieldsPayment
                        ? superUserDetails.customFieldsPayment
                        : null,
                      waBusProvider ? waBusProvider : null,
                      waBusAuthKey ? waBusAuthKey : null,
                      waBusURL ? waBusURL : null,
                      waBusIntId ? waBusIntId : null,
                      waBusAppId ? waBusAppId : null,
                      waBusSourceNo ? waBusSourceNo : null,
                      msgData.to,
                      template.body,
                      template.templateNameSpaceWa
                        ? template.templateNameSpaceWa
                        : null,
                      template.templateName ? template.templateName : null,
                      template.tLangCode ? template.tLangCode : null,
                      template.image_link ? template.image_link : null,
                      template.video_link ? template.video_link : null,
                      template.document_link ? template.document_link : null,
                      template.document_name ? template.document_name : null,
                      assignedTo,
                      contact,
                      sale,
                      null,
                      null,
                      null,
                      null,
                      null
                    );
                  }
                }
              });
            }
            // });
          }
        });
      }
      });
    } else if (type == "service") {
      var service = data;
      var contact;
      var assignedTo;

      // we need to fetch contact and assigned user details
      getServicePipelines(userId).then(servicePipeline=>{
        servicePipelines = servicePipeline.servicePipelines;
      if (superUserDetails) {
        // we need to fetch other details of assigned to user
        getassignedToUser(service.assignedTo).then((assUser) => {
          assignedTo = assUser;
          if (assignedTo) {
            // getContactDetails(userId, service.customerId).then((serviceCont) => {
            contact = service.contData;
            if (contact) {
              getSMSTemplate(userId, rule.data.templateId).then((template) => {
                msgData.to = eval(rule.data.To);
                if (template) {
                  if (template.templateType === "SMS") {
                    const smsApiTemplateId = template.smsApiTemplateId;
                    msgData.html = template.body
                      .replace(
                        /\#\[service.Service Title\]/g,
                        service.serviceTitle
                      )
                      .replace(
                        /\#\[service.Estimated Value\]/g,
                        service.estimatedValue
                      )
                      .replace(
                        /\#\[service.Start Date\]/g,
                        convertDate(service.startDate, superUserDetails.timeZone)
                      )
                      .replace(
                        /\#\[service.Expected Completion Date\]/g,
                        convertDate(
                          service.expCompletionDate,
                          superUserDetails.timeZone
                        )
                      )
                      .replace(/\#\[service.Stage\]/g, getStatusName(servicePipelines, service.selectedServPipeline,service.servicesStage))
                      .replace(/\#\[service.Priority\]/g, service.priority)
                      .replace(
                        /\#\[service.Assigned To\]/g,
                        service.assignedToName
                      )
                      .replace(
                        /\#\[service.Description\]/g,
                        service.description
                          ? service.description
                          : "Service Description not provided"
                      )
                      .replace(/\#\[contact.Company Name\]/g, contact.companyName)
                      .replace(/\#\[contact.First Name\]/g, contact.firstName)
                      .replace(
                        /\#\[contact.Second Name\]/g,
                        contact.secondName ? contact.secondName : ""
                      )
                      .replace(
                        /\#\[contact.Contact No\]/g,
                        contact.contactNo
                          ? contact.contactNo
                          : "Contact Number not provided"
                      )
                      .replace(
                        /\#\[contact.Email\]/g,
                        contact.email ? contact.email : "Email not provided"
                      )
                      .replace(/\#\[contact.Priority\]/g, contact.priority)
                      .replace(/\#\[contact.Status\]/g, getStatusName(contactPipelines,contact.selectedContactPipeline,contact.status))
                      .replace(
                        /\#\[contact.Assigned To\]/g,
                        contact.assignedToName
                      )
                      .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
                      .replace(
                        /\#\[user.Last Name\]/g,
                        assignedTo.lastname ? assignedTo.lastname : ""
                      )
                      .replace(
                        /\#\[user.Contact No\]/g,
                        assignedTo.phone
                          ? assignedTo.phone
                          : "Contact Number not provided"
                      )
                      .replace(
                        /\#\[user.Email\]/g,
                        assignedTo.email ? assignedTo.email : ""
                      );

                    // contact additional fields
                    if (superUserDetails.customFieldsContact) {
                      let teststring = msgData.html;
                      for (
                        let i = 0;
                        i < superUserDetails.customFieldsContact.length;
                        i++
                      ) {
                        if (
                          superUserDetails.customFieldsContact[i].isActive ===
                          true
                        ) {
                          var str1 =
                            "\\#\\[contact." +
                            superUserDetails.customFieldsContact[i].fieldName +
                            "\\]";

                          var re = new RegExp(str1, "g");
                          teststring = teststring.replace(
                            re,
                            contact.additionalFieldsArr[i + ""]
                              ? contact.additionalFieldsArr[i + ""].fieldValue
                                ? superUserDetails.customFieldsContact[i]
                                    .fieldType == "date"
                                  ? convertDate(
                                      contact.additionalFieldsArr[i + ""]
                                        .fieldValue,
                                      superUserDetails.timeZone
                                    )
                                  : superUserDetails.customFieldsContact[i]
                                      .fieldType == "date_time"
                                  ? convertDateTime(
                                      contact.additionalFieldsArr[i + ""]
                                        .fieldValue,
                                      superUserDetails.timeZone
                                    )
                                  : contact.additionalFieldsArr[i + ""].fieldValue
                                : ""
                              : ""
                          );
                        }
                      }

                      msgData.html = teststring;
                    }

                    // service additional fields
                    if (superUserDetails.customFieldsService) {
                      let str = msgData.html;
                      for (
                        let i = 0;
                        i < superUserDetails.customFieldsService.length;
                        i++
                      ) {
                        if (
                          superUserDetails.customFieldsService[i].isActive ===
                          true
                        ) {
                          var str1 =
                            "\\#\\[service." +
                            superUserDetails.customFieldsService[i].fieldName +
                            "\\]";
                          var re = new RegExp(str1, "g");
                          str = str.replace(
                            re,
                            service.additionalFieldsArr[i + ""]
                              ? service.additionalFieldsArr[i + ""].fieldValue
                                ? superUserDetails.customFieldsService[i]
                                    .fieldType == "date"
                                  ? convertDate(
                                      service.additionalFieldsArr[i + ""]
                                        .fieldValue,
                                      superUserDetails.timeZone
                                    )
                                  : superUserDetails.customFieldsService[i]
                                      .fieldType == "date_time"
                                  ? convertDateTime(
                                      service.additionalFieldsArr[i + ""]
                                        .fieldValue,
                                      superUserDetails.timeZone
                                    )
                                  : service.additionalFieldsArr[i + ""].fieldValue
                                : ""
                              : ""
                          );
                        }
                      }
                      msgData.html = str;
                    }
                    messageConverted(msgData.html).then((data) => {
                      sendSMSfn(
                        msgData.to,
                        data,
                        smsApiUserName,
                        smsApiPwd,
                        smsApiSenderId,
                        smsApiEntityId,
                        smsApiTemplateId
                      );
                    });
                  } else if (template.templateType === "WhatsApp") {
                    // call send whatsapp fn with datas
                    sendWhatsappmsg(
                      contactPipelines,
                      salePipelines,
                      servicePipelines,
                      superUserDetails.timeZone
                        ? superUserDetails.timeZone
                        : "Asia/Calcutta",
                      superUserDetails.customFieldsContact
                        ? superUserDetails.customFieldsContact
                        : null,
                      superUserDetails.customFieldsSale
                        ? superUserDetails.customFieldsSale
                        : null,
                      superUserDetails.customFieldsService
                        ? superUserDetails.customFieldsService
                        : null,
                      superUserDetails.customFieldsEstimate
                        ? superUserDetails.customFieldsEstimate
                        : null,
                      superUserDetails.customFieldsQuotation
                        ? superUserDetails.customFieldsQuotation
                        : null,
                      superUserDetails.customFieldsInvoices
                        ? superUserDetails.customFieldsInvoices
                        : null,
                      superUserDetails.customFieldsPayment
                        ? superUserDetails.customFieldsPayment
                        : null,
                      waBusProvider ? waBusProvider : null,
                      waBusAuthKey ? waBusAuthKey : null,
                      waBusURL ? waBusURL : null,
                      waBusIntId ? waBusIntId : null,
                      waBusAppId ? waBusAppId : null,
                      waBusSourceNo ? waBusSourceNo : null,
                      msgData.to,
                      template.body,
                      template.templateNameSpaceWa
                        ? template.templateNameSpaceWa
                        : null,
                      template.templateName ? template.templateName : null,
                      template.tLangCode ? template.tLangCode : null,
                      template.image_link ? template.image_link : null,
                      template.video_link ? template.video_link : null,
                      template.document_link ? template.document_link : null,
                      template.document_name ? template.document_name : null,
                      assignedTo,
                      contact,
                      null,
                      service,
                      null,
                      null,
                      null,
                      null
                    );
                  }
                }
              });
            }
            // });
          }
        });
      }
      });
    } else if (type == "invoice") {
      var invoice = data;
      var assignedTo;
      var sale = invoice.saleData;
      var contact = invoice.contData;
      var assignedToId;
      if (!!sale) {
        assignedToId = sale.assignedToId;
      } else {
        assignedToId = contact.assignedTo;
      }
      getSalePipelines(userId).then(salePipeline=>{
        salePipelines = salePipeline.salePipelines;
      if (superUserDetails) {
        getassignedToUser(assignedToId).then((assUser) => {
          assignedTo = assUser;
          if (assignedTo) {
            getSMSTemplate(userId, rule.data.templateId).then((template) => {
              msgData.to = eval(rule.data.To);
              if (template) {
                if (template.templateType === "SMS") {
                  const smsApiTemplateId = template.smsApiTemplateId;
                  msgData.html = template.body
                    .replace(
                      /\#\[invoice.Date\]/g,
                      convertDate(
                        invoice.docData.docDate,
                        superUserDetails.timeZone
                      )
                    )
                    .replace(
                      /\#\[invoice.Doc Prefix\]/g,
                      invoice.docData.docPrefix
                        ? invoice.docData.docPrefix
                        : "Prefix not provided"
                    )
                    .replace(
                      /\#\[invoice.Doc No\]/g,
                      invoice.docData.docNumber
                        ? invoice.docData.docNumber
                        : "Document Number not provided"
                    )
                    .replace(
                      /\#\[invoice.Due Date\]/g,
                      convertDate(
                        invoice.docData.dueDate,
                        superUserDetails.timeZone
                      )
                    )
                    .replace(/\#\[invoice.Currency\]/g, invoice.docData.currency)
                    .replace(
                      /\#\[invoice.Bank Details\]/g,
                      invoice.docData.bankDetails
                        ? invoice.docData.bankDetails
                        : "Bank details not provided"
                    )
                    .replace(
                      /\#\[invoice.Amount Including Tax\]/g,
                      invoice.docData.totalInclTax
                        ? invoice.docData.totalInclTax
                        : "0"
                    )
                    .replace(/\#\[invoice.Sale\]/g, invoice.docData.saleTitle)
                    .replace(
                      /\#\[invoice.Customer\]/g,
                      invoice.customerData.fname1 +
                        " " +
                        (invoice.customerData.sname
                          ? invoice.customerData.sname
                          : "")
                    )
                    .replace(
                      /\#\[invoice.Notes\]/g,
                      invoice.docData.notes
                        ? invoice.docData.notes
                        : "Notes not provided"
                    )
                    .replace(
                      /\#\[invoice.Amount Collected\]/g,
                      invoice.docData.collectedAmount
                        ? invoice.docData.collectedAmount
                        : "0"
                    )
                    .replace(
                      /\#\[invoice.Doc URL\]/g,
                      invoice.sharedDocId ? invoice.sharedDocId : ""
                    )
                    .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
                    .replace(
                      /\#\[user.Last Name\]/g,
                      assignedTo.lastname ? assignedTo.lastname : ""
                    )
                    .replace(
                      /\#\[user.Contact No\]/g,
                      assignedTo.phone ? assignedTo.phone : "Number not provided"
                    )
                    .replace(/\#\[user.Email\]/g, assignedTo.email);

                  // replacing sale seperately
                  if (!!sale) {
                    let teststr1 = msgData.html;
                    teststr1 = teststr1
                      .replace(/\#\[sale.Sale Title\]/g, sale.saleTitle)
                      .replace(/\#\[sale.Estimated Value\]/g, sale.estimatedValue)
                      .replace(
                        /\#\[sale.Start Date\]/g,
                        convertDate(sale.startDate, superUserDetails.timeZone)
                      )
                      .replace(
                        /\#\[sale.Expected Completion Date\]/g,
                        convertDate(
                          sale.expCompletionDate,
                          superUserDetails.timeZone
                        )
                      )
                      .replace(/\#\[sale.Stage\]/g, getStatusName(salePipelines, sale.selectedSalePipeline,sale.salesStage))
                      .replace(/\#\[sale.Priority\]/g, sale.priority)
                      .replace(/\#\[sale.Assigned To\]/g, sale.assignedToName)
                      .replace(
                        /\#\[sale.Description\]/g,
                        sale.description
                          ? sale.description
                          : "Description not provided"
                      );

                    msgData.html = teststr1;
                  }

                  // replacing contact part seperately
                  if (!!contact) {
                    let teststr2 = msgData.html;
                    teststr2 = teststr2
                      .replace(/\#\[contact.Company Name\]/g, contact.companyName)
                      .replace(/\#\[contact.First Name\]/g, contact.firstName)
                      .replace(
                        /\#\[contact.Second Name\]/g,
                        contact.secondName ? contact.secondName : ""
                      )
                      .replace(
                        /\#\[contact.Contact No\]/g,
                        contact.contactNo
                          ? contact.contactNo
                          : "Number not provided"
                      )
                      .replace(
                        /\#\[contact.Email\]/g,
                        contact.email ? contact.email : "Email not provided"
                      )
                      .replace(/\#\[contact.Priority\]/g, contact.priority)
                      .replace(/\#\[contact.Status\]/g, getStatusName(contactPipelines,contact.selectedContactPipeline,contact.status))
                      .replace(
                        /\#\[contact.Assigned To\]/g,
                        contact.assignedToName
                      );

                    msgData.html = teststr2;
                  }

                  // contact additional fields
                  if (!!contact && superUserDetails.customFieldsContact) {
                    let teststring = msgData.html;
                    for (
                      let i = 0;
                      i < superUserDetails.customFieldsContact.length;
                      i++
                    ) {
                      if (
                        superUserDetails.customFieldsContact[i].isActive === true
                      ) {
                        var str1 =
                          "\\#\\[contact." +
                          superUserDetails.customFieldsContact[i].fieldName +
                          "\\]";

                        var re = new RegExp(str1, "g");
                        teststring = teststring.replace(
                          re,
                          contact.additionalFieldsArr[i + ""]
                            ? contact.additionalFieldsArr[i + ""].fieldValue
                              ? superUserDetails.customFieldsContact[i]
                                  .fieldType == "date"
                                ? convertDate(
                                    contact.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : superUserDetails.customFieldsContact[i]
                                    .fieldType == "date_time"
                                ? convertDateTime(
                                    contact.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : contact.additionalFieldsArr[i + ""].fieldValue
                              : ""
                            : ""
                        );
                      }
                    }

                    msgData.html = teststring;
                  }

                  // sale additional fields
                  if (!!sale && superUserDetails.customFieldsSale) {
                    let str = msgData.html;
                    for (
                      let i = 0;
                      i < superUserDetails.customFieldsSale.length;
                      i++
                    ) {
                      if (
                        superUserDetails.customFieldsSale[i].isActive === true
                      ) {
                        var str1 =
                          "\\#\\[sale." +
                          superUserDetails.customFieldsSale[i].fieldName +
                          "\\]";
                        var re = new RegExp(str1, "g");
                        str = str.replace(
                          re,
                          sale.additionalFieldsArr[i + ""]
                            ? sale.additionalFieldsArr[i + ""].fieldValue
                              ? superUserDetails.customFieldsSale[i].fieldType ==
                                "date"
                                ? convertDate(
                                    sale.additionalFieldsArr[i + ""].fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : superUserDetails.customFieldsSale[i]
                                    .fieldType == "date_time"
                                ? convertDateTime(
                                    sale.additionalFieldsArr[i + ""].fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : sale.additionalFieldsArr[i + ""].fieldValue
                              : ""
                            : ""
                        );
                      }
                    }
                    msgData.html = str;
                  }

                  // additional fields: customFieldsInvoices
                  if (superUserDetails.customFieldsInvoices) {
                    let teststring = msgData.html;
                    for (
                      let i = 0;
                      i < superUserDetails.customFieldsInvoices.length;
                      i++
                    ) {
                      if (
                        superUserDetails.customFieldsInvoices[i].isActive === true
                      ) {
                        var str1 =
                          "\\#\\[invoice." +
                          superUserDetails.customFieldsInvoices[i].fieldName +
                          "\\]";

                        var re = new RegExp(str1, "g");
                        teststring = teststring.replace(
                          re,
                          invoice.additionalFieldsArr[i + ""]
                            ? invoice.additionalFieldsArr[i + ""].fieldValue
                              ? superUserDetails.customFieldsInvoices[i]
                                  .fieldType == "date"
                                ? convertDate(
                                    invoice.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : superUserDetails.customFieldsInvoices[i]
                                    .fieldType == "date_time"
                                ? convertDateTime(
                                    invoice.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : invoice.additionalFieldsArr[i + ""].fieldValue
                              : ""
                            : ""
                        );
                      }
                    }
                    msgData.html = teststring;
                  }
                  messageConverted(msgData.html).then((data) => {
                    sendSMSfn(
                      msgData.to,
                      data,
                      smsApiUserName,
                      smsApiPwd,
                      smsApiSenderId,
                      smsApiEntityId,
                      smsApiTemplateId
                    );
                  });
                } else if (template.templateType === "WhatsApp") {
                  // call send whatsapp fn with datas
                  sendWhatsappmsg(
                    contactPipelines,
                    salePipelines,
                    servicePipelines,
                    superUserDetails.timeZone
                      ? superUserDetails.timeZone
                      : "Asia/Calcutta",
                    superUserDetails.customFieldsContact
                      ? superUserDetails.customFieldsContact
                      : null,
                    superUserDetails.customFieldsSale
                      ? superUserDetails.customFieldsSale
                      : null,
                    superUserDetails.customFieldsService
                      ? superUserDetails.customFieldsService
                      : null,
                    superUserDetails.customFieldsEstimate
                      ? superUserDetails.customFieldsEstimate
                      : null,
                    superUserDetails.customFieldsQuotation
                      ? superUserDetails.customFieldsQuotation
                      : null,
                    superUserDetails.customFieldsInvoices
                      ? superUserDetails.customFieldsInvoices
                      : null,
                    superUserDetails.customFieldsPayment
                      ? superUserDetails.customFieldsPayment
                      : null,
                    waBusProvider ? waBusProvider : null,
                    waBusAuthKey ? waBusAuthKey : null,
                    waBusURL ? waBusURL : null,
                    waBusIntId ? waBusIntId : null,
                    waBusAppId ? waBusAppId : null,
                    waBusSourceNo ? waBusSourceNo : null,
                    msgData.to,
                    template.body,
                    template.templateNameSpaceWa
                      ? template.templateNameSpaceWa
                      : null,
                    template.templateName ? template.templateName : null,
                    template.tLangCode ? template.tLangCode : null,
                    template.image_link ? template.image_link : null,
                    template.video_link ? template.video_link : null,
                    template.document_link ? template.document_link : null,
                    template.document_name ? template.document_name : null,
                    assignedTo,
                    contact,
                    sale,
                    null,
                    null,
                    null,
                    invoice,
                    null
                  );
                }
              }
            });
          }
        });
      }
      });
    } else if (type == "estimate") {
      var estimate = data;
      var assignedTo;
      var sale = estimate.saleData;
      var contact = estimate.contData;
      var assignedToId;
      if (!!sale) {
        assignedToId = sale.assignedToId;
      } else {
        assignedToId = contact.assignedTo;
      }
      getSalePipelines(userId).then(salePipeline=>{
        salePipelines = salePipeline.salePipelines;
      if (superUserDetails) {
        getassignedToUser(assignedToId).then((assUser) => {
          assignedTo = assUser;
          if (assignedTo) {
            getSMSTemplate(userId, rule.data.templateId).then((template) => {
              msgData.to = eval(rule.data.To);
              if (template) {
                if (template.templateType === "SMS") {
                  const smsApiTemplateId = template.smsApiTemplateId;
                  msgData.html = template.body
                    .replace(
                      /\#\[estimate.Date\]/g,
                      convertDate(
                        estimate.docData.docDate,
                        superUserDetails.timeZone
                      )
                    )
                    .replace(
                      /\#\[estimate.Doc Prefix\]/g,
                      estimate.docData.docPrefix
                        ? estimate.docData.docPrefix
                        : "Prefix not provided"
                    )
                    .replace(
                      /\#\[estimate.Doc No\]/g,
                      estimate.docData.docNumber
                        ? estimate.docData.docNumber
                        : "Document Number not provided"
                    )
                    .replace(
                      /\#\[estimate.Validity\]/g,
                      convertDate(
                        estimate.docData.docValidity,
                        superUserDetails.timeZone
                      )
                    )
                    .replace(
                      /\#\[estimate.Currency\]/g,
                      estimate.docData.currency
                    )
                    .replace(
                      /\#\[estimate.Bank Details\]/g,
                      estimate.docData.bankDetails
                        ? estimate.docData.bankDetails
                        : "Bank Details not provided"
                    )
                    .replace(
                      /\#\[estimate.Amount Including Tax\]/g,
                      estimate.docData.totalInclTax
                        ? estimate.docData.totalInclTax
                        : "0"
                    )
                    .replace(/\#\[estimate.Sale\]/g, estimate.docData.saleTitle)
                    .replace(
                      /\#\[estimate.Customer\]/g,
                      estimate.customerData.fname1 +
                        " " +
                        (estimate.customerData.sname
                          ? estimate.customerData.sname
                          : "")
                    )
                    .replace(
                      /\#\[estimate.Notes\]/g,
                      estimate.docData.notes
                        ? estimate.docData.notes
                        : "Notes not provided"
                    )
                    .replace(
                      /\#\[estimate.Amount Collected\]/g,
                      estimate.docData.collectedAmount
                        ? estimate.docData.collectedAmount
                        : "0"
                    )
                    .replace(
                      /\#\[estimate.Doc URL\]/g,
                      estimate.sharedDocId ? estimate.sharedDocId : ""
                    )
                    .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
                    .replace(
                      /\#\[user.Last Name\]/g,
                      assignedTo.lastname ? assignedTo.lastname : ""
                    )
                    .replace(
                      /\#\[user.Contact No\]/g,
                      assignedTo.phone ? assignedTo.phone : "Nuumber not provided"
                    )
                    .replace(/\#\[user.Email\]/g, assignedTo.email);

                  // replacing sale seperately
                  if (!!sale) {
                    let teststr1 = msgData.html;
                    teststr1 = teststr1
                      .replace(/\#\[sale.Sale Title\]/g, sale.saleTitle)
                      .replace(/\#\[sale.Estimated Value\]/g, sale.estimatedValue)
                      .replace(
                        /\#\[sale.Start Date\]/g,
                        convertDate(sale.startDate, superUserDetails.timeZone)
                      )
                      .replace(
                        /\#\[sale.Expected Completion Date\]/g,
                        convertDate(
                          sale.expCompletionDate,
                          superUserDetails.timeZone
                        )
                      )
                      .replace(/\#\[sale.Stage\]/g, getStatusName(salePipelines, sale.selectedSalePipeline,sale.salesStage))
                      .replace(/\#\[sale.Priority\]/g, sale.priority)
                      .replace(/\#\[sale.Assigned To\]/g, sale.assignedToName)
                      .replace(
                        /\#\[sale.Description\]/g,
                        sale.description
                          ? sale.description
                          : "Description not provided"
                      );

                    msgData.html = teststr1;
                  }

                  // replacing contact part seperately
                  if (!!contact) {
                    let teststr2 = msgData.html;
                    teststr2 = teststr2
                      .replace(/\#\[contact.Company Name\]/g, contact.companyName)
                      .replace(/\#\[contact.First Name\]/g, contact.firstName)
                      .replace(
                        /\#\[contact.Second Name\]/g,
                        contact.secondName ? contact.secondName : ""
                      )
                      .replace(
                        /\#\[contact.Contact No\]/g,
                        contact.contactNo
                          ? contact.contactNo
                          : "Number not provided"
                      )
                      .replace(
                        /\#\[contact.Email\]/g,
                        contact.email ? contact.email : "Email not provided"
                      )
                      .replace(/\#\[contact.Priority\]/g, contact.priority)
                      .replace(/\#\[contact.Status\]/g, getStatusName(contactPipelines,contact.selectedContactPipeline,contact.status))
                      .replace(
                        /\#\[contact.Assigned To\]/g,
                        contact.assignedToName
                      );

                    msgData.html = teststr2;
                  }

                  // contact additional fields
                  if (!!contact && superUserDetails.customFieldsContact) {
                    let teststring = msgData.html;
                    for (
                      let i = 0;
                      i < superUserDetails.customFieldsContact.length;
                      i++
                    ) {
                      if (
                        superUserDetails.customFieldsContact[i].isActive === true
                      ) {
                        var str1 =
                          "\\#\\[contact." +
                          superUserDetails.customFieldsContact[i].fieldName +
                          "\\]";

                        var re = new RegExp(str1, "g");
                        teststring = teststring.replace(
                          re,
                          contact.additionalFieldsArr[i + ""]
                            ? contact.additionalFieldsArr[i + ""].fieldValue
                              ? superUserDetails.customFieldsContact[i]
                                  .fieldType == "date"
                                ? convertDate(
                                    contact.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : superUserDetails.customFieldsContact[i]
                                    .fieldType == "date_time"
                                ? convertDateTime(
                                    contact.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : contact.additionalFieldsArr[i + ""].fieldValue
                              : ""
                            : ""
                        );
                      }
                    }

                    msgData.html = teststring;
                  }

                  // sale additional fields
                  if (!!sale && superUserDetails.customFieldsSale) {
                    let str = msgData.html;
                    for (
                      let i = 0;
                      i < superUserDetails.customFieldsSale.length;
                      i++
                    ) {
                      if (
                        superUserDetails.customFieldsSale[i].isActive === true
                      ) {
                        var str1 =
                          "\\#\\[sale." +
                          superUserDetails.customFieldsSale[i].fieldName +
                          "\\]";
                        var re = new RegExp(str1, "g");
                        str = str.replace(
                          re,
                          sale.additionalFieldsArr[i + ""]
                            ? sale.additionalFieldsArr[i + ""].fieldValue
                              ? superUserDetails.customFieldsSale[i].fieldType ==
                                "date"
                                ? convertDate(
                                    sale.additionalFieldsArr[i + ""].fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : superUserDetails.customFieldsSale[i]
                                    .fieldType == "date_time"
                                ? convertDateTime(
                                    sale.additionalFieldsArr[i + ""].fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : sale.additionalFieldsArr[i + ""].fieldValue
                              : ""
                            : ""
                        );
                      }
                    }
                    msgData.html = str;
                  }

                  // additional fields: customFieldsEstimate
                  if (superUserDetails.customFieldsEstimate) {
                    let teststring = msgData.html;
                    for (
                      let i = 0;
                      i < superUserDetails.customFieldsEstimate.length;
                      i++
                    ) {
                      if (
                        superUserDetails.customFieldsEstimate[i].isActive === true
                      ) {
                        var str1 =
                          "\\#\\[estimate." +
                          superUserDetails.customFieldsEstimate[i].fieldName +
                          "\\]";

                        var re = new RegExp(str1, "g");
                        teststring = teststring.replace(
                          re,
                          estimate.additionalFieldsArr[i + ""]
                            ? estimate.additionalFieldsArr[i + ""].fieldValue
                              ? superUserDetails.customFieldsEstimate[i]
                                  .fieldType == "date"
                                ? convertDate(
                                    estimate.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : superUserDetails.customFieldsEstimate[i]
                                    .fieldType == "date_time"
                                ? convertDateTime(
                                    estimate.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : estimate.additionalFieldsArr[i + ""].fieldValue
                              : ""
                            : ""
                        );
                      }
                    }
                    msgData.html = teststring;
                  }
                  messageConverted(msgData.html).then((data) => {

                    sendSMSfn(
                      msgData.to,
                      data,
                      smsApiUserName,
                      smsApiPwd,
                      smsApiSenderId,
                      smsApiEntityId,
                      smsApiTemplateId
                    );
                  });
                } else if (template.templateType === "WhatsApp") {
                  // call send whatsapp fn with datas
                  sendWhatsappmsg(
                    contactPipelines,
                    salePipelines,
                    servicePipelines,
                    superUserDetails.timeZone
                      ? superUserDetails.timeZone
                      : "Asia/Calcutta",
                    superUserDetails.customFieldsContact
                      ? superUserDetails.customFieldsContact
                      : null,
                    superUserDetails.customFieldsSale
                      ? superUserDetails.customFieldsSale
                      : null,
                    superUserDetails.customFieldsService
                      ? superUserDetails.customFieldsService
                      : null,
                    superUserDetails.customFieldsEstimate
                      ? superUserDetails.customFieldsEstimate
                      : null,
                    superUserDetails.customFieldsQuotation
                      ? superUserDetails.customFieldsQuotation
                      : null,
                    superUserDetails.customFieldsInvoices
                      ? superUserDetails.customFieldsInvoices
                      : null,
                    superUserDetails.customFieldsPayment
                      ? superUserDetails.customFieldsPayment
                      : null,
                    waBusProvider ? waBusProvider : null,
                    waBusAuthKey ? waBusAuthKey : null,
                    waBusURL ? waBusURL : null,
                    waBusIntId ? waBusIntId : null,
                    waBusAppId ? waBusAppId : null,
                    waBusSourceNo ? waBusSourceNo : null,
                    msgData.to,
                    template.body,
                    template.templateNameSpaceWa
                      ? template.templateNameSpaceWa
                      : null,
                    template.templateName ? template.templateName : null,
                    template.tLangCode ? template.tLangCode : null,
                    template.image_link ? template.image_link : null,
                    template.video_link ? template.video_link : null,
                    template.document_link ? template.document_link : null,
                    template.document_name ? template.document_name : null,
                    assignedTo,
                    contact,
                    sale,
                    null,
                    estimate,
                    null,
                    null,
                    null
                  );
                }
              }
            });
          }
        });
      }
      });
    } else if (type == "quotation") {
      var quotation = data;
      var assignedTo;
      var sale = quotation.saleData;
      var contact = quotation.contData;
      var assignedToId;
      if (!!sale) {
        assignedToId = sale.assignedToId;
      } else {
        assignedToId = contact.assignedTo;
      }
      getSalePipelines(userId).then(salePipeline=>{
        salePipelines = salePipeline.salePipelines;
      if (superUserDetails) {
        getassignedToUser(assignedToId).then((assUser) => {
          assignedTo = assUser;
          if (assignedTo) {
            getSMSTemplate(userId, rule.data.templateId).then((template) => {
              msgData.to = eval(rule.data.To);
              if (template) {
                if (template.templateType === "SMS") {
                  const smsApiTemplateId = template.smsApiTemplateId;
                  msgData.html = template.body
                    .replace(
                      /\#\[quotation.Date\]/g,
                      convertDate(
                        quotation.docData.docDate,
                        superUserDetails.timeZone
                      )
                    )
                    .replace(
                      /\#\[quotation.Doc Prefix\]/g,
                      quotation.docData.docPrefix
                        ? quotation.docData.docPrefix
                        : "Prefix not provided"
                    )
                    .replace(
                      /\#\[quotation.Doc No\]/g,
                      quotation.docData.docNumber
                        ? quotation.docData.docNumber
                        : "Document Number not provided"
                    )
                    .replace(
                      /\#\[quotation.Validity\]/g,
                      convertDate(
                        quotation.docData.docValidity,
                        superUserDetails.timeZone
                      )
                    )
                    .replace(
                      /\#\[quotation.Currency\]/g,
                      quotation.docData.currency
                    )
                    .replace(
                      /\#\[quotation.Bank Details\]/g,
                      quotation.docData.bankDetails
                        ? quotation.docData.bankDetails
                        : "Bank Details not provided"
                    )
                    .replace(
                      /\#\[quotation.Amount Including Tax\]/g,
                      quotation.docData.totalInclTax
                        ? quotation.docData.totalInclTax
                        : "0"
                    )
                    .replace(/\#\[quotation.Sale\]/g, quotation.docData.saleTitle)
                    .replace(
                      /\#\[quotation.Customer\]/g,
                      quotation.customerData.fname1 +
                        " " +
                        (quotation.customerData.sname
                          ? quotation.customerData.sname
                          : "")
                    )
                    .replace(
                      /\#\[quotation.Notes\]/g,
                      quotation.docData.notes
                        ? quotation.docData.notes
                        : "Notes not provided"
                    )
                    .replace(
                      /\#\[quotation.Amount Collected\]/g,
                      quotation.docData.collectedAmount
                        ? quotation.docData.collectedAmount
                        : "0"
                    )
                    .replace(
                      /\#\[quotation.Doc URL\]/g,
                      quotation.sharedDocId ? quotation.sharedDocId : ""
                    )
                    .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
                    .replace(
                      /\#\[user.Last Name\]/g,
                      assignedTo.lastname ? assignedTo.lastname : ""
                    )
                    .replace(
                      /\#\[user.Contact No\]/g,
                      assignedTo.phone ? assignedTo.phone : "Number not provided"
                    )
                    .replace(/\#\[user.Email\]/g, assignedTo.email);

                  // replacing sale seperately
                  if (!!sale) {
                    let teststr1 = msgData.html;
                    teststr1 = teststr1
                      .replace(/\#\[sale.Sale Title\]/g, sale.saleTitle)
                      .replace(/\#\[sale.Estimated Value\]/g, sale.estimatedValue)
                      .replace(
                        /\#\[sale.Start Date\]/g,
                        convertDate(sale.startDate, superUserDetails.timeZone)
                      )
                      .replace(
                        /\#\[sale.Expected Completion Date\]/g,
                        convertDate(
                          sale.expCompletionDate,
                          superUserDetails.timeZone
                        )
                      )
                      .replace(/\#\[sale.Stage\]/g, getStatusName(salePipelines, sale.selectedSalePipeline,sale.salesStage))
                      .replace(/\#\[sale.Priority\]/g, sale.priority)
                      .replace(/\#\[sale.Assigned To\]/g, sale.assignedToName)
                      .replace(
                        /\#\[sale.Description\]/g,
                        sale.description
                          ? sale.description
                          : "Description not provided"
                      );

                    msgData.html = teststr1;
                  }

                  // replacing contact part seperately
                  if (!!contact) {
                    let teststr2 = msgData.html;
                    teststr2 = teststr2
                      .replace(/\#\[contact.Company Name\]/g, contact.companyName)
                      .replace(/\#\[contact.First Name\]/g, contact.firstName)
                      .replace(
                        /\#\[contact.Second Name\]/g,
                        contact.secondName ? contact.secondName : ""
                      )
                      .replace(
                        /\#\[contact.Contact No\]/g,
                        contact.contactNo
                          ? contact.contactNo
                          : "Number not provided"
                      )
                      .replace(
                        /\#\[contact.Email\]/g,
                        contact.email ? contact.email : "Email not provided"
                      )
                      .replace(/\#\[contact.Priority\]/g, contact.priority)
                      .replace(/\#\[contact.Status\]/g, getStatusName(contactPipelines,contact.selectedContactPipeline,contact.status))
                      .replace(
                        /\#\[contact.Assigned To\]/g,
                        contact.assignedToName
                      );

                    msgData.html = teststr2;
                  }

                  // contact additional fields
                  if (!!contact && superUserDetails.customFieldsContact) {
                    let teststring = msgData.html;
                    for (
                      let i = 0;
                      i < superUserDetails.customFieldsContact.length;
                      i++
                    ) {
                      if (
                        superUserDetails.customFieldsContact[i].isActive === true
                      ) {
                        var str1 =
                          "\\#\\[contact." +
                          superUserDetails.customFieldsContact[i].fieldName +
                          "\\]";

                        var re = new RegExp(str1, "g");
                        teststring = teststring.replace(
                          re,
                          contact.additionalFieldsArr[i + ""]
                            ? contact.additionalFieldsArr[i + ""].fieldValue
                              ? superUserDetails.customFieldsContact[i]
                                  .fieldType == "date"
                                ? convertDate(
                                    contact.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : superUserDetails.customFieldsContact[i]
                                    .fieldType == "date_time"
                                ? convertDateTime(
                                    contact.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : contact.additionalFieldsArr[i + ""].fieldValue
                              : ""
                            : ""
                        );
                      }
                    }

                    msgData.html = teststring;
                  }

                  // sale additional fields
                  if (!!sale && superUserDetails.customFieldsSale) {
                    let str = msgData.html;
                    for (
                      let i = 0;
                      i < superUserDetails.customFieldsSale.length;
                      i++
                    ) {
                      if (
                        superUserDetails.customFieldsSale[i].isActive === true
                      ) {
                        var str1 =
                          "\\#\\[sale." +
                          superUserDetails.customFieldsSale[i].fieldName +
                          "\\]";
                        var re = new RegExp(str1, "g");
                        str = str.replace(
                          re,
                          sale.additionalFieldsArr[i + ""]
                            ? sale.additionalFieldsArr[i + ""].fieldValue
                              ? superUserDetails.customFieldsSale[i].fieldType ==
                                "date"
                                ? convertDate(
                                    sale.additionalFieldsArr[i + ""].fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : superUserDetails.customFieldsSale[i]
                                    .fieldType == "date_time"
                                ? convertDateTime(
                                    sale.additionalFieldsArr[i + ""].fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : sale.additionalFieldsArr[i + ""].fieldValue
                              : ""
                            : ""
                        );
                      }
                    }
                    msgData.html = str;
                  }

                  // additional fields: customFieldsQuotation
                  if (superUserDetails.customFieldsQuotation) {
                    let teststring = msgData.html;
                    for (
                      let i = 0;
                      i < superUserDetails.customFieldsQuotation.length;
                      i++
                    ) {
                      if (
                        superUserDetails.customFieldsQuotation[i].isActive ===
                        true
                      ) {
                        var str1 =
                          "\\#\\[quotation." +
                          superUserDetails.customFieldsQuotation[i].fieldName +
                          "\\]";

                        var re = new RegExp(str1, "g");
                        teststring = teststring.replace(
                          re,
                          quotation.additionalFieldsArr[i + ""]
                            ? quotation.additionalFieldsArr[i + ""].fieldValue
                              ? superUserDetails.customFieldsQuotation[i]
                                  .fieldType == "date"
                                ? convertDate(
                                    quotation.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : superUserDetails.customFieldsQuotation[i]
                                    .fieldType == "date_time"
                                ? convertDateTime(
                                    quotation.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : quotation.additionalFieldsArr[i + ""].fieldValue
                              : ""
                            : ""
                        );
                      }
                    }
                    msgData.html = teststring;
                  }
                  messageConverted(msgData.html).then((data) => {

                    sendSMSfn(
                      msgData.to,
                      data,
                      smsApiUserName,
                      smsApiPwd,
                      smsApiSenderId,
                      smsApiEntityId,
                      smsApiTemplateId
                    );
                  });
                } else if (template.templateType === "WhatsApp") {
                  // call send whatsapp fn with datas
                  sendWhatsappmsg(
                    contactPipelines,
                    salePipelines,
                    servicePipelines,
                    superUserDetails.timeZone
                      ? superUserDetails.timeZone
                      : "Asia/Calcutta",
                    superUserDetails.customFieldsContact
                      ? superUserDetails.customFieldsContact
                      : null,
                    superUserDetails.customFieldsSale
                      ? superUserDetails.customFieldsSale
                      : null,
                    superUserDetails.customFieldsService
                      ? superUserDetails.customFieldsService
                      : null,
                    superUserDetails.customFieldsEstimate
                      ? superUserDetails.customFieldsEstimate
                      : null,
                    superUserDetails.customFieldsQuotation
                      ? superUserDetails.customFieldsQuotation
                      : null,
                    superUserDetails.customFieldsInvoices
                      ? superUserDetails.customFieldsInvoices
                      : null,
                    superUserDetails.customFieldsPayment
                      ? superUserDetails.customFieldsPayment
                      : null,
                    waBusProvider ? waBusProvider : null,
                    waBusAuthKey ? waBusAuthKey : null,
                    waBusURL ? waBusURL : null,
                    waBusIntId ? waBusIntId : null,
                    waBusAppId ? waBusAppId : null,
                    waBusSourceNo ? waBusSourceNo : null,
                    msgData.to,
                    template.body,
                    template.templateNameSpaceWa
                      ? template.templateNameSpaceWa
                      : null,
                    template.templateName ? template.templateName : null,
                    template.tLangCode ? template.tLangCode : null,
                    template.image_link ? template.image_link : null,
                    template.video_link ? template.video_link : null,
                    template.document_link ? template.document_link : null,
                    template.document_name ? template.document_name : null,
                    assignedTo,
                    contact,
                    sale,
                    null,
                    null,
                    null,
                    quotation,
                    null
                  );
                }
              }
            });
          }
        });
      }
      });
    } else if (type == "collection") {
      var collection = data;
      var assignedTo;
      var sale = collection.saleData;
      var contact = collection.contData;
      getSalePipelines(userId).then(salePipeline=>{
        salePipelines = salePipeline.salePipelines;
      if (superUserDetails) {
        getassignedToUser(data.assignedTo).then((assUser) => {
          assignedTo = assUser;
          if (assignedTo) {
            getSMSTemplate(userId, rule.data.templateId).then((template) => {
              msgData.to = eval(rule.data.To);
              if (template) {
                if (template.templateType === "SMS") {
                  const smsApiTemplateId = template.smsApiTemplateId;
                  msgData.html = template.body

                    .replace(
                      /\#\[collection.Payment Date\]/g,
                      convertDate(
                        collection.paymentDate,
                        superUserDetails.timeZone
                      )
                    )
                    .replace(
                      /\#\[collection.Payment Mode\]/g,
                      collection.paymentMode
                    )
                    .replace(
                      /\#\[collection.Payment Type\]/g,
                      collection.paymentType
                        ? collection.paymentType
                        : "Payment Type not provided"
                    )
                    .replace(/\#\[collection.Sale\]/g, collection.saleTitle)
                    .replace(
                      /\#\[collection.Customer\]/g,
                      collection.customerName
                    ) //second name has to be included
                    .replace(
                      /\#\[collection.Amount Collected\]/g,
                      collection.amountCollected
                        ? collection.amountCollected
                        : "0"
                    )
                    .replace(
                      /\#\[collection.Doc Prefix and No\]/g,
                      collection.invoiceprefixAndDocNumber
                        ? collection.invoiceprefixAndDocNumber
                        : "Prefix and DocNumber not provided"
                    )
                    .replace(/\#\[collection.Currency\]/g, collection.currency)
                    .replace(
                      /\#\[collection.Cheque details\]/g,
                      collection.chequeNo
                        ? collection.chequeNo + ", " + collection.chequeBank
                        : "Cheque Details not provided"
                    )
                    .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
                    .replace(
                      /\#\[user.Last Name\]/g,
                      assignedTo.lastname ? assignedTo.lastname : ""
                    )
                    .replace(
                      /\#\[user.Contact No\]/g,
                      assignedTo.phone ? assignedTo.phone : "Number not provided"
                    )
                    .replace(/\#\[user.Email\]/g, assignedTo.email);

                  // replacing sale seperately
                  if (!!sale) {
                    let teststr1 = msgData.html;
                    teststr1 = teststr1
                      .replace(/\#\[sale.Sale Title\]/g, sale.saleTitle)
                      .replace(/\#\[sale.Estimated Value\]/g, sale.estimatedValue)
                      .replace(
                        /\#\[sale.Start Date\]/g,
                        convertDate(sale.startDate, superUserDetails.timeZone)
                      )
                      .replace(
                        /\#\[sale.Expected Completion Date\]/g,
                        convertDate(
                          sale.expCompletionDate,
                          superUserDetails.timeZone
                        )
                      )
                      .replace(/\#\[sale.Stage\]/g, getStatusName(salePipelines, sale.selectedSalePipeline,sale.salesStage))
                      .replace(/\#\[sale.Priority\]/g, sale.priority)
                      .replace(/\#\[sale.Assigned To\]/g, sale.assignedToName)
                      .replace(
                        /\#\[sale.Description\]/g,
                        sale.description
                          ? sale.description
                          : "Description not provided"
                      );

                    msgData.html = teststr1;
                  }

                  // replacing contact part seperately
                  if (!!contact) {
                    let teststr2 = msgData.html;
                    teststr2 = teststr2
                      .replace(/\#\[contact.Company Name\]/g, contact.companyName)
                      .replace(/\#\[contact.First Name\]/g, contact.firstName)
                      .replace(
                        /\#\[contact.Second Name\]/g,
                        contact.secondName ? contact.secondName : ""
                      )
                      .replace(
                        /\#\[contact.Contact No\]/g,
                        contact.contactNo
                          ? contact.contactNo
                          : "Number not provided"
                      )
                      .replace(
                        /\#\[contact.Email\]/g,
                        contact.email ? contact.email : "Email not provided"
                      )
                      .replace(/\#\[contact.Priority\]/g, contact.priority)
                      .replace(/\#\[contact.Status\]/g, getStatusName(contactPipelines,contact.selectedContactPipeline,contact.status))
                      .replace(
                        /\#\[contact.Assigned To\]/g,
                        contact.assignedToName
                      );

                    msgData.html = teststr2;
                  }

                  // contact additional fields
                  if (!!contact && superUserDetails.customFieldsContact) {
                    let teststring = msgData.html;
                    for (
                      let i = 0;
                      i < superUserDetails.customFieldsContact.length;
                      i++
                    ) {
                      if (
                        superUserDetails.customFieldsContact[i].isActive === true
                      ) {
                        var str1 =
                          "\\#\\[contact." +
                          superUserDetails.customFieldsContact[i].fieldName +
                          "\\]";

                        var re = new RegExp(str1, "g");
                        teststring = teststring.replace(
                          re,
                          contact.additionalFieldsArr[i + ""]
                            ? contact.additionalFieldsArr[i + ""].fieldValue
                              ? superUserDetails.customFieldsContact[i]
                                  .fieldType == "date"
                                ? convertDate(
                                    contact.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : superUserDetails.customFieldsContact[i]
                                    .fieldType == "date_time"
                                ? convertDateTime(
                                    contact.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : contact.additionalFieldsArr[i + ""].fieldValue
                              : ""
                            : ""
                        );
                      }
                    }

                    msgData.html = teststring;
                  }

                  // sale additional fields
                  if (!!sale && superUserDetails.customFieldsSale) {
                    let str = msgData.html;
                    for (
                      let i = 0;
                      i < superUserDetails.customFieldsSale.length;
                      i++
                    ) {
                      if (
                        superUserDetails.customFieldsSale[i].isActive === true
                      ) {
                        var str1 =
                          "\\#\\[sale." +
                          superUserDetails.customFieldsSale[i].fieldName +
                          "\\]";
                        var re = new RegExp(str1, "g");
                        str = str.replace(
                          re,
                          sale.additionalFieldsArr[i + ""]
                            ? sale.additionalFieldsArr[i + ""].fieldValue
                              ? superUserDetails.customFieldsSale[i].fieldType ==
                                "date"
                                ? convertDate(
                                    sale.additionalFieldsArr[i + ""].fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : superUserDetails.customFieldsSale[i]
                                    .fieldType == "date_time"
                                ? convertDateTime(
                                    sale.additionalFieldsArr[i + ""].fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : sale.additionalFieldsArr[i + ""].fieldValue
                              : ""
                            : ""
                        );
                      }
                    }
                    msgData.html = str;
                  }

                  // additional fields: customFieldsPayment
                  if (superUserDetails.customFieldsPayment) {
                    let teststring = msgData.html;
                    for (
                      let i = 0;
                      i < superUserDetails.customFieldsPayment.length;
                      i++
                    ) {
                      if (
                        superUserDetails.customFieldsPayment[i].isActive === true
                      ) {
                        var str1 =
                          "\\#\\[collection." +
                          superUserDetails.customFieldsPayment[i].fieldName +
                          "\\]";

                        var re = new RegExp(str1, "g");
                        teststring = teststring.replace(
                          re,
                          collection.additionalFieldsArr[i + ""]
                            ? collection.additionalFieldsArr[i + ""].fieldValue
                              ? superUserDetails.customFieldsPayment[i]
                                  .fieldType == "date"
                                ? convertDate(
                                    collection.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : superUserDetails.customFieldsPayment[i]
                                    .fieldType == "date_time"
                                ? convertDateTime(
                                    collection.additionalFieldsArr[i + ""]
                                      .fieldValue,
                                    superUserDetails.timeZone
                                  )
                                : collection.additionalFieldsArr[i + ""]
                                    .fieldValue
                              : ""
                            : ""
                        );
                      }
                    }
                    msgData.html = teststring;
                  }
                  messageConverted(msgData.html).then((data) => {

                    sendSMSfn(
                      msgData.to,
                      data,
                      smsApiUserName,
                      smsApiPwd,
                      smsApiSenderId,
                      smsApiEntityId,
                      smsApiTemplateId
                    );
                  });
                } else if (template.templateType === "WhatsApp") {
                  // call send whatsapp fn with datas
                  sendWhatsappmsg(
                    contactPipelines,
                    salePipelines,
                    servicePipelines,
                    superUserDetails.timeZone
                      ? superUserDetails.timeZone
                      : "Asia/Calcutta",
                    superUserDetails.customFieldsContact
                      ? superUserDetails.customFieldsContact
                      : null,
                    superUserDetails.customFieldsSale
                      ? superUserDetails.customFieldsSale
                      : null,
                    superUserDetails.customFieldsService
                      ? superUserDetails.customFieldsService
                      : null,
                    superUserDetails.customFieldsEstimate
                      ? superUserDetails.customFieldsEstimate
                      : null,
                    superUserDetails.customFieldsQuotation
                      ? superUserDetails.customFieldsQuotation
                      : null,
                    superUserDetails.customFieldsInvoices
                      ? superUserDetails.customFieldsInvoices
                      : null,
                    superUserDetails.customFieldsPayment
                      ? superUserDetails.customFieldsPayment
                      : null,
                    waBusProvider ? waBusProvider : null,
                    waBusAuthKey ? waBusAuthKey : null,
                    waBusURL ? waBusURL : null,
                    waBusIntId ? waBusIntId : null,
                    waBusAppId ? waBusAppId : null,
                    waBusSourceNo ? waBusSourceNo : null,
                    msgData.to,
                    template.body,
                    template.templateNameSpaceWa
                      ? template.templateNameSpaceWa
                      : null,
                    template.templateName ? template.templateName : null,
                    template.tLangCode ? template.tLangCode : null,
                    template.image_link ? template.image_link : null,
                    template.video_link ? template.video_link : null,
                    template.document_link ? template.document_link : null,
                    template.document_name ? template.document_name : null,
                    assignedTo,
                    contact,
                    sale,
                    null,
                    null,
                    null,
                    null,
                    collection
                  );
                }
              }
            });
          }
        });
      }
      });
    }
  })
}

function getSMSTemplate(userId, templateId) {
  return new Promise(function (resolve, reject) {
    admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("messageTemplates")
      .doc(templateId)
      .get()
      .then((data) => {
        resolve(data.data());
      });
  });
}

function getassignedToUser(userId) {
  return new Promise(function (resolve, reject) {
    admin
      .firestore()
      .collection("users")
      .doc(userId)
      .get()
      .then((data) => {
        resolve(data.data());
      });
  });
}
// we are getting message body as html, need ti convert to plain text
function messageConverted(msg) {
  return new Promise(function (resolve, reject) {
    let html = msg.replace(/<\/div>/g, "</div>%0D%0A"); //replacing </div> with newline and </div> to ger new lines
    html = html.replace(/<\/p>/g, "</p>%0D%0A"); //replacing </p> with newline and </p> to ger new lines
    resolve(html.replace(/<[^>]+>/g, "")); //angle branckets are removed and return data
  });
}

function sendSMSfn(
  phN,
  msgBody,
  smsApiUserName,
  smsApiPwd,
  smsApiSenderId,
  smsApiEntityId,
  smsApiTemplateId
) {
  // for this api we need phno with out code
  let phNo = phN.substr(phN.indexOf("-") + 1); //in automation collection, we are saving phno as +91-999999999 format

  console.log(phNo, msgBody); //keep logs for reference
  // let phNo = phN.replace(/[^a-zA-Z0-9]/g, "");

  // let url = `https://secure.sdctechnologies.co.in/api/mt/SendSMS?user=crmhits&password=crm2020&senderid=WEBSMS&channel=Trans&DCS=0&flashsms=0&number=${phNo}&text=${msgBody}&route=14`;
  let url = `http://3.111.50.224/sendsms/bulksms.php?username=${smsApiUserName}&password=${smsApiPwd}&type=TEXT&sender=${smsApiSenderId}&entityId=${smsApiEntityId}&templateId=${smsApiTemplateId}&&mobile=${phNo}&message=${msgBody}`;
  const axios = require("axios");
  axios
    .get(url)
    .then((r) => {
      console.log("response" + r.data);
      console.log("r.status", r.status);
      // r.status(200).send("");
    })
    .catch((e) => {
      console.log("error" + e);
      // r.status(404).send("");
    });
}

// send whatsapp message function
function sendWhatsappmsg(
  contactPipelines,
  salePipelines,
  servicePipelines,
  superUserTimeZone,
  customFieldsContact,
  customFieldsSale,
  customFieldsService,
  customFieldsEstimate,
  customFieldsQuotation,
  customFieldsInvoices,
  customFieldsPayment,
  waBusProvider,
  waBusAuthKey,
  waBusURL,
  waBusIntId,
  waBusAppId,
  waBusSourceNo,
  destNo,
  message,
  templateNameSpaceWa,
  templateName,
  tLangCode,
  image_link,
  video_link,
  document_link,
  document_name,
  assignedTo,
  contact,
  sale,
  service,
  estimate,
  quotation,
  invoice,
  collection
) {
  let phNo = destNo.replace(/[^\w ]/g, ""); //remove + and - ;in automation collection, we are saving phno as +91-999999999 format

  let paramCheck = message.match(/(?<=\#\[)[^\][]*(?=])/g); //extract data inside #[]
  let paramsArray = []; // to save the corresponding values of general variables
  var output = ""; //to save the JSON stringify form of replaced variable

  if (!!paramCheck && paramCheck !== null && paramCheck.length > 0) {
    //if parameters inside #[] is present
    for (let i = 0; i < paramCheck.length; i++) {
      //add that mush elements to array after replacing the original value, handle dates also
      if (paramCheck[i] === "contact.First Name") {
        paramsArray.splice(i, 0, `${contact.firstName}`);
      } else if (paramCheck[i] === "contact.Second Name") {
        paramsArray.splice(i, 0, `${contact.secondName}`);
      } else if (paramCheck[i] === "contact.Company Name") {
        paramsArray.splice(i, 0, `${contact.companyName}`);
      } else if (paramCheck[i] === "contact.Email") {
        paramsArray.splice(i, 0, `${contact.email}`);
      } else if (paramCheck[i] === "contact.Contact No") {
        paramsArray.splice(i, 0, `${contact.contactNo}`);
      } else if (paramCheck[i] === "contact.Priority") {
        paramsArray.splice(i, 0, `${contact.priority}`);
      } else if (paramCheck[i] === "contact.Status") {
        paramsArray.splice(i, 0, `${getStatusName(contactPipelines,contact.selectedContactPipeline,contact.status)}`);
      } else if (paramCheck[i] === "contact.Assigned To") {
        paramsArray.splice(i, 0, `${contact.assignedToName}`);
      } else if (paramCheck[i] === "user.First Name") {
        paramsArray.splice(i, 0, `${assignedTo.firstname}`);
      } else if (paramCheck[i] === "user.Last Name") {
        paramsArray.splice(i, 0, `${assignedTo.lastname}`);
      } else if (paramCheck[i] === "user.Contact No") {
        paramsArray.splice(
          i,
          0,
          `+${assignedTo.countryCode}-${assignedTo.phone}`
        );
      } else if (paramCheck[i] === "user.Email") {
        paramsArray.splice(i, 0, `${assignedTo.email}`);
      } else if (paramCheck[i] === "sale.Sale Title") {
        paramsArray.splice(i, 0, `${sale.saleTitle}`);
      } else if (paramCheck[i] === "sale.Estimated Value") {
        paramsArray.splice(i, 0, `${sale.estimatedValue}`);
      } else if (paramCheck[i] === "sale.Start Date") {
        paramsArray.splice(
          i,
          0,
          `${convertDate(sale.startDate, superUserTimeZone)}`
        );
      } else if (paramCheck[i] === "sale.Expected Completion Date") {
        paramsArray.splice(
          i,
          0,
          `${convertDate(sale.expCompletionDate, superUserTimeZone)}`
        );
      } else if (paramCheck[i] === "sale.Stage") {
        paramsArray.splice(i, 0, `${getStatusName(salePipelines, sale.selectedSalePipeline,sale.salesStage)}`);
      } else if (paramCheck[i] === "sale.Priority") {
        paramsArray.splice(i, 0, `${sale.priority}`);
      } else if (paramCheck[i] === "sale.Assigned To") {
        paramsArray.splice(i, 0, `${sale.assignedToName}`);
      } else if (paramCheck[i] === "sale.Description") {
        paramsArray.splice(i, 0, `${sale.description}`);
      } else if (paramCheck[i] === "service.Service Title") {
        paramsArray.splice(i, 0, `${service.serviceTitle}`);
      } else if (paramCheck[i] === "service.Start Date") {
        paramsArray.splice(
          i,
          0,
          `${convertDate(service.startDate, superUserTimeZone)}`
        );
      } else if (paramCheck[i] === "service.Expected Completion Date") {
        paramsArray.splice(
          i,
          0,
          `${convertDate(service.expCompletionDate, superUserTimeZone)}`
        );
      } else if (paramCheck[i] === "service.Stage") {
        paramsArray.splice(i, 0, `${getStatusName(servicePipelines, service.selectedServPipeline,service.servicesStage)}`);
      } else if (paramCheck[i] === "service.Priority") {
        paramsArray.splice(i, 0, `${service.priority}`);
      } else if (paramCheck[i] === "service.Assigned To") {
        paramsArray.splice(i, 0, `${service.assignedToName}`);
      } else if (paramCheck[i] === "service.Description") {
        paramsArray.splice(i, 0, `${service.description}`); //inv
      } else if (paramCheck[i] === "invoice.Date") {
        paramsArray.splice(
          i,
          0,
          `${convertDate(invoice.docData.docDate, superUserTimeZone)}`
        );
      } else if (paramCheck[i] === "invoice.Doc Prefix") {
        paramsArray.splice(i, 0, `${invoice.docData.docPrefix}`);
      } else if (paramCheck[i] === "invoice.Doc No") {
        paramsArray.splice(i, 0, `${invoice.docData.docNumber}`);
      } else if (paramCheck[i] === "invoice.Due Date") {
        paramsArray.splice(
          i,
          0,
          `${convertDate(invoice.docData.dueDate, superUserTimeZone)}`
        );
      } else if (paramCheck[i] === "invoice.Currency") {
        paramsArray.splice(i, 0, `${invoice.docData.currency}`);
      } else if (paramCheck[i] === "invoice.Bank Details") {
        paramsArray.splice(i, 0, `${invoice.docData.bankDetails}`);
      } else if (paramCheck[i] === "invoice.Amount Including Tax") {
        paramsArray.splice(i, 0, `${invoice.docData.totalInclTax}`);
      } else if (paramCheck[i] === "invoice.Sale") {
        paramsArray.splice(i, 0, `${invoice.docData.saleTitle}`);
      } else if (paramCheck[i] === "invoice.Customer") {
        paramsArray.splice(
          i,
          0,
          `${invoice.customerData.fname1} ${
            invoice.customerData.sname ? invoice.customerData.sname : ""
          }`
        );
      } else if (paramCheck[i] === "invoice.Notes") {
        paramsArray.splice(i, 0, `${invoice.docData.notes}`);
      } else if (paramCheck[i] === "invoice.Amount Collected") {
        paramsArray.splice(i, 0, `${invoice.docData.collectedAmount}`);
      } else if (paramCheck[i] === "invoice.Doc URL") {
        paramsArray.splice(i, 0, `${invoice.sharedDocId}`); //estimate
      } else if (paramCheck[i] === "estimate.Date") {
        paramsArray.splice(
          i,
          0,
          `${convertDate(estimate.docData.docDate, superUserTimeZone)}`
        );
      } else if (paramCheck[i] === "estimate.Doc Prefix") {
        paramsArray.splice(i, 0, `${estimate.docData.docPrefix}`);
      } else if (paramCheck[i] === "estimate.Doc No") {
        paramsArray.splice(i, 0, `${estimate.docData.docNumber}`);
      } else if (paramCheck[i] === "estimate.Validity") {
        paramsArray.splice(
          i,
          0,
          `${convertDate(estimate.docData.docValidity, superUserTimeZone)}`
        );
      } else if (paramCheck[i] === "estimate.Currency") {
        paramsArray.splice(i, 0, `${estimate.docData.currency}`);
      } else if (paramCheck[i] === "estimate.Bank Details") {
        paramsArray.splice(i, 0, `${estimate.docData.bankDetails}`);
      } else if (paramCheck[i] === "estimate.Amount Including Tax") {
        paramsArray.splice(i, 0, `${estimate.docData.totalInclTax}`);
      } else if (paramCheck[i] === "estimate.Sale") {
        paramsArray.splice(i, 0, `${estimate.docData.saleTitle}`);
      } else if (paramCheck[i] === "estimate.Customer") {
        paramsArray.splice(
          i,
          0,
          `${estimate.customerData.fname1} ${
            estimate.customerData.sname ? estimate.customerData.sname : ""
          }`
        );
      } else if (paramCheck[i] === "estimate.Notes") {
        paramsArray.splice(i, 0, `${estimate.docData.notes}`);
      } else if (paramCheck[i] === "estimate.Amount Collected") {
        paramsArray.splice(i, 0, `${estimate.docData.collectedAmount}`);
      } else if (paramCheck[i] === "estimate.Doc URL") {
        paramsArray.splice(i, 0, `${estimate.sharedDocId}`); //quotation
      } else if (paramCheck[i] === "quotation.Date") {
        paramsArray.splice(
          i,
          0,
          `${convertDate(quotation.docData.docDate, superUserTimeZone)}`
        );
      } else if (paramCheck[i] === "quotation.Doc Prefix") {
        paramsArray.splice(i, 0, `${quotation.docData.docPrefix}`);
      } else if (paramCheck[i] === "quotation.Doc No") {
        paramsArray.splice(i, 0, `${quotation.docData.docNumber}`);
      } else if (paramCheck[i] === "quotation.Validity") {
        paramsArray.splice(
          i,
          0,
          `${convertDate(quotation.docData.docValidity, superUserTimeZone)}`
        );
      } else if (paramCheck[i] === "quotation.Currency") {
        paramsArray.splice(i, 0, `${quotation.docData.currency}`);
      } else if (paramCheck[i] === "quotation.Bank Details") {
        paramsArray.splice(i, 0, `${quotation.docData.bankDetails}`);
      } else if (paramCheck[i] === "quotation.Amount Including Tax") {
        paramsArray.splice(i, 0, `${quotation.docData.totalInclTax}`);
      } else if (paramCheck[i] === "quotation.Sale") {
        paramsArray.splice(i, 0, `${quotation.docData.saleTitle}`);
      } else if (paramCheck[i] === "quotation.Customer") {
        paramsArray.splice(
          i,
          0,
          `${quotation.customerData.fname1} ${
            quotation.customerData.sname ? quotation.customerData.sname : ""
          }`
        );
      } else if (paramCheck[i] === "quotation.Notes") {
        paramsArray.splice(i, 0, `${quotation.docData.notes}`);
      } else if (paramCheck[i] === "quotation.Amount Collected") {
        paramsArray.splice(i, 0, `${quotation.docData.collectedAmount}`);
      } else if (paramCheck[i] === "quotation.Doc URL") {
        paramsArray.splice(i, 0, `${quotation.sharedDocId}`);
      } else if (paramCheck[i] === "collection.Payment Date") {
        paramsArray.splice(
          i,
          0,
          `${convertDate(collection.paymentDate, superUserTimeZone)}`
        );
      } else if (paramCheck[i] === "collection.Payment Mode") {
        paramsArray.splice(i, 0, `${collection.paymentMode}`);
      } else if (paramCheck[i] === "collection.Payment Type") {
        paramsArray.splice(i, 0, `${collection.paymentType}`);
      } else if (paramCheck[i] === "collection.Sale") {
        paramsArray.splice(i, 0, `${collection.saleTitle}`);
      } else if (paramCheck[i] === "collection.Customer") {
        paramsArray.splice(i, 0, `${collection.customerName}`);
      } else if (paramCheck[i] === "collection.Amount Collected") {
        paramsArray.splice(i, 0, `${collection.amountCollected}`);
      } else if (paramCheck[i] === "collection.Doc Prefix and No") {
        paramsArray.splice(i, 0, `${collection.invoiceprefixAndDocNumber}`);
      } else if (paramCheck[i] === "collection.Currency") {
        paramsArray.splice(i, 0, `${collection.currency}`);
      } else if (paramCheck[i] === "collection.Cheque details") {
        paramsArray.splice(
          i,
          0,
          `${
            collection.chequeNo
              ? collection.chequeNo
              : "Check details not provided"
          } ${collection.chequeBank ? collection.chequeBank : ""}`
        );
      }

      // contact additional fields
      if (!!customFieldsContact) {
        for (let l = 0; l < customFieldsContact.length; l++) {
          if (
            paramCheck[i] ===
              `contact.${customFieldsContact[l + ""].fieldName}` &&
            !!contact.additionalFieldsArr[l + ""]
          ) {
            if (
              customFieldsContact[l + ""].fieldType === "date" &&
              !!contact.additionalFieldsArr[l + ""].fieldValue
            ) {
              paramsArray.splice(
                i,
                0,
                `${this.convertDate(
                  contact.additionalFieldsArr[l + ""].fieldValue,
                  superUserTimeZone
                )}`
              );
            } else if (
              customFieldsContact[l + ""].fieldType === "date_time" &&
              !!contact.additionalFieldsArr[l + ""].fieldValue
            ) {
              paramsArray.splice(
                i,
                0,
                `${this.convertDateTime(
                  contact.additionalFieldsArr[l + ""].fieldValue,
                  superUserTimeZone
                )}`
              );
            } else if (!!contact.additionalFieldsArr[l + ""].fieldValue) {
              paramsArray.splice(
                i,
                0,
                `${contact.additionalFieldsArr[l + ""].fieldValue}`
              );
            } else {
              paramsArray.splice(i, 0, `Value not provided`);
            }
          } else if (
            paramCheck[i] === `contact.${customFieldsContact[l + ""].fieldName}`
          ) {
            paramsArray.splice(i, 0, `Value not provided`);
          }
        }
      }

      // sale additional fields
      if (!!customFieldsSale) {
        for (let l = 0; l < customFieldsSale.length; l++) {
          if (
            paramCheck[i] === `sale.${customFieldsSale[l + ""].fieldName}` &&
            !!sale.additionalFieldsArr[l + ""]
          ) {
            if (
              customFieldsSale[l + ""].fieldType === "date" &&
              !!sale.additionalFieldsArr[l + ""].fieldValue
            ) {
              paramsArray.splice(
                i,
                0,
                `${this.convertDate(
                  sale.additionalFieldsArr[l + ""].fieldValue,
                  superUserTimeZone
                )}`
              );
            } else if (
              customFieldsSale[l + ""].fieldType === "date_time" &&
              !!sale.additionalFieldsArr[l + ""].fieldValue
            ) {
              paramsArray.splice(
                i,
                0,
                `${this.convertDateTime(
                  sale.additionalFieldsArr[l + ""].fieldValue,
                  superUserTimeZone
                )}`
              );
            } else if (!!sale.additionalFieldsArr[l + ""].fieldValue) {
              paramsArray.splice(
                i,
                0,
                `${sale.additionalFieldsArr[l + ""].fieldValue}`
              );
            } else {
              paramsArray.splice(i, 0, `Value not provided`);
            }
          } else if (
            paramCheck[i] === `sale.${customFieldsSale[l + ""].fieldName}`
          ) {
            paramsArray.splice(i, 0, `Value not provided`);
          }
        }
      }

      // service additional fields
      if (!!customFieldsService) {
        for (let l = 0; l < customFieldsService.length; l++) {
          if (
            paramCheck[i] ===
              `service.${customFieldsService[l + ""].fieldName}` &&
            !!service.additionalFieldsArr[l + ""]
          ) {
            if (
              customFieldsService[l + ""].fieldType === "date" &&
              !!service.additionalFieldsArr[l + ""].fieldValue
            ) {
              paramsArray.splice(
                i,
                0,
                `${this.convertDate(
                  service.additionalFieldsArr[l + ""].fieldValue,
                  superUserTimeZone
                )}`
              );
            } else if (
              customFieldsService[l + ""].fieldType === "date_time" &&
              !!service.additionalFieldsArr[l + ""].fieldValue
            ) {
              paramsArray.splice(
                i,
                0,
                `${this.convertDateTime(
                  service.additionalFieldsArr[l + ""].fieldValue,
                  superUserTimeZone
                )}`
              );
            } else if (!!service.additionalFieldsArr[l + ""].fieldValue) {
              paramsArray.splice(
                i,
                0,
                `${service.additionalFieldsArr[l + ""].fieldValue}`
              );
            } else {
              paramsArray.splice(i, 0, `Value not provided`);
            }
          } else if (
            paramCheck[i] === `service.${customFieldsService[l + ""].fieldName}`
          ) {
            paramsArray.splice(i, 0, `Value not provided`);
          }
        }
      }

      // estimate additional fields
      if (!!customFieldsEstimate) {
        for (let l = 0; l < customFieldsEstimate.length; l++) {
          if (
            paramCheck[i] ===
              `estimate.${customFieldsEstimate[l + ""].fieldName}` &&
            !!estimate.additionalFieldsArr[l + ""]
          ) {
            if (
              customFieldsEstimate[l + ""].fieldType === "date" &&
              !!estimate.additionalFieldsArr[l + ""].fieldValue
            ) {
              paramsArray.splice(
                i,
                0,
                `${this.convertDate(
                  estimate.additionalFieldsArr[l + ""].fieldValue,
                  superUserTimeZone
                )}`
              );
            } else if (
              customFieldsEstimate[l + ""].fieldType === "date_time" &&
              !!estimate.additionalFieldsArr[l + ""].fieldValue
            ) {
              paramsArray.splice(
                i,
                0,
                `${this.convertDateTime(
                  estimate.additionalFieldsArr[l + ""].fieldValue,
                  superUserTimeZone
                )}`
              );
            } else if (!!estimate.additionalFieldsArr[l + ""].fieldValue) {
              paramsArray.splice(
                i,
                0,
                `${estimate.additionalFieldsArr[l + ""].fieldValue}`
              );
            } else {
              paramsArray.splice(i, 0, `Value not provided`);
            }
          } else if (
            paramCheck[i] ===
            `estimate.${customFieldsEstimate[l + ""].fieldName}`
          ) {
            paramsArray.splice(i, 0, `Value not provided`);
          }
        }
      }

      // quotation additional fields
      if (!!customFieldsQuotation) {
        for (let l = 0; l < customFieldsQuotation.length; l++) {
          if (
            paramCheck[i] ===
              `quotation.${customFieldsQuotation[l + ""].fieldName}` &&
            !!quotation.additionalFieldsArr[l + ""]
          ) {
            if (
              customFieldsQuotation[l + ""].fieldType === "date" &&
              !!quotation.additionalFieldsArr[l + ""].fieldValue
            ) {
              paramsArray.splice(
                i,
                0,
                `${this.convertDate(
                  quotation.additionalFieldsArr[l + ""].fieldValue,
                  superUserTimeZone
                )}`
              );
            } else if (
              customFieldsQuotation[l + ""].fieldType === "date_time" &&
              !!quotation.additionalFieldsArr[l + ""].fieldValue
            ) {
              paramsArray.splice(
                i,
                0,
                `${this.convertDateTime(
                  quotation.additionalFieldsArr[l + ""].fieldValue,
                  superUserTimeZone
                )}`
              );
            } else if (!!quotation.additionalFieldsArr[l + ""].fieldValue) {
              paramsArray.splice(
                i,
                0,
                `${quotation.additionalFieldsArr[l + ""].fieldValue}`
              );
            } else {
              paramsArray.splice(i, 0, `Value not provided`);
            }
          } else if (
            paramCheck[i] ===
            `quotation.${customFieldsQuotation[l + ""].fieldName}`
          ) {
            paramsArray.splice(i, 0, `Value not provided`);
          }
        }
      }

      // invoice additional fields
      if (!!customFieldsInvoices) {
        for (let l = 0; l < customFieldsInvoices.length; l++) {
          if (
            paramCheck[i] ===
              `invoice.${customFieldsInvoices[l + ""].fieldName}` &&
            !!invoice.additionalFieldsArr[l + ""]
          ) {
            if (
              customFieldsInvoices[l + ""].fieldType === "date" &&
              !!invoice.additionalFieldsArr[l + ""].fieldValue
            ) {
              paramsArray.splice(
                i,
                0,
                `${this.convertDate(
                  invoice.additionalFieldsArr[l + ""].fieldValue,
                  superUserTimeZone
                )}`
              );
            } else if (
              customFieldsInvoices[l + ""].fieldType === "date_time" &&
              !!invoice.additionalFieldsArr[l + ""].fieldValue
            ) {
              paramsArray.splice(
                i,
                0,
                `${this.convertDateTime(
                  invoice.additionalFieldsArr[l + ""].fieldValue,
                  superUserTimeZone
                )}`
              );
            } else if (!!invoice.additionalFieldsArr[l + ""].fieldValue) {
              paramsArray.splice(
                i,
                0,
                `${invoice.additionalFieldsArr[l + ""].fieldValue}`
              );
            } else {
              paramsArray.splice(i, 0, `Value not provided`);
            }
          } else if (
            paramCheck[i] ===
            `invoice.${customFieldsInvoices[l + ""].fieldName}`
          ) {
            paramsArray.splice(i, 0, `Value not provided`);
          }
        }
      }

      // collection additional fields
      if (!!customFieldsPayment) {
        for (let l = 0; l < customFieldsPayment.length; l++) {
          if (
            paramCheck[i] ===
              `collection.${customFieldsPayment[l + ""].fieldName}` &&
            !!collection.additionalFieldsArr[l + ""]
          ) {
            if (
              customFieldsPayment[l + ""].fieldType === "date" &&
              !!collection.additionalFieldsArr[l + ""].fieldValue
            ) {
              paramsArray.splice(
                i,
                0,
                `${this.convertDate(
                  collection.additionalFieldsArr[l + ""].fieldValue,
                  superUserTimeZone
                )}`
              );
            } else if (
              customFieldsPayment[l + ""].fieldType === "date_time" &&
              !!collection.additionalFieldsArr[l + ""].fieldValue
            ) {
              paramsArray.splice(
                i,
                0,
                `${this.convertDateTime(
                  collection.additionalFieldsArr[l + ""].fieldValue,
                  superUserTimeZone
                )}`
              );
            } else if (!!collection.additionalFieldsArr[l + ""].fieldValue) {
              paramsArray.splice(
                i,
                0,
                `${collection.additionalFieldsArr[l + ""].fieldValue}`
              );
            } else {
              paramsArray.splice(i, 0, `Value not provided`);
            }
          } else if (
            paramCheck[i] ===
            `collection.${customFieldsPayment[l + ""].fieldName}`
          ) {
            paramsArray.splice(i, 0, `Value not provided`);
          }
        }
      }
    }
    output = ""; //ensure empty string
    if (waBusProvider === "moplet") {

        for (let i = 0; i < paramsArray.length; i++) {
          if (i === paramsArray.length - 1) {
            output += `{"type":"text","text":"${paramsArray[i]}"}`;
          } else {
            output += `{"type":"text","text":"${paramsArray[i]}"},`; //comma presnt if not last element
          }
        }

    } else if (waBusProvider === "gupshup") {

        output = `[`;
        for (let i = 0; i < paramsArray.length; i++) {
          // encoded data is needed
          if (i === paramsArray.length - 1) {
            output += `%22${paramsArray[i]}%22]`;
          } else {
            output += `%22${paramsArray[i]}%22,`; //comma presnt if not last element
          }
        }

    }
  }else{
    if (waBusProvider === "moplet"){
      output = '';
      output += `{"type":"text","text":"[]"}`;

    }else if (waBusProvider === "gupshup"){
      output = "[]"
    }
  }

  console.log("JSON parameters data", output); //keeping logs to check unapproved templates

  if (waBusProvider === "moplet") {
    // if no values are there to replace create a default datastring
    var dataString = `{"storage":"full","destination":{"integrationId":"${waBusIntId}","destinationId":"${phNo}"},"author":{"role":"appMaker"},"messageSchema":"whatsapp","message":{"type":"template","template":{"namespace":"${templateNameSpaceWa}","name":"${templateName}","language":{"policy":"deterministic","code":"${tLangCode}"},"components":[]}},"blocks":null}`;

    // if image/video/doc Urls present, add the data to the dataString
    if (!!image_link) {
      dataString = `{"storage":"full","destination":{"integrationId":"${waBusIntId}","destinationId":"${phNo}"},"author":{"role":"appMaker"},"messageSchema":"whatsapp","message":{"type":"template","template":{"namespace":"${templateNameSpaceWa}","name":"${templateName}","language":{"policy":"deterministic","code":"${tLangCode}"},"components":[{"parameters":[{"image":{"link":"${image_link}"},"type":"image"}],"type":"header"},{"parameters":[${output}],"type":"body"}]}},"blocks":null}`;
    } else if (!!video_link) {
      dataString = `{"storage":"full","destination":{"integrationId":"${waBusIntId}","destinationId":"${phNo}"},"author":{"role":"appMaker"},"messageSchema":"whatsapp","message":{"type":"template","template":{"namespace":"${templateNameSpaceWa}","name":"${templateName}","language":{"policy":"deterministic","code":"${tLangCode}"},"components":[{"parameters":[{"video":{"link":"${video_link}"},"type":"video"}],"type":"header"},{"parameters":[${output}],"type":"body"}]}},"blocks":null}`;
    } else if (!!document_link) {
      dataString = `{"storage":"full","destination":{"integrationId":"${waBusIntId}","destinationId":"${phNo}"},"author":{"role":"appMaker"},"messageSchema":"whatsapp","message":{"type":"template","template":{"namespace":"${templateNameSpaceWa}","name":"${templateName}","language":{"policy":"deterministic","code":"${tLangCode}"},"components":[{"parameters":[{"document":{"link":"${document_link}","filename":"${document_name}"},"type":"document"}],"type":"header"},{"parameters":[${output}],"type":"body"}]}},"blocks":null}`;
    } else {
      dataString = `{"storage":"full","destination":{"integrationId":"${waBusIntId}","destinationId":"${phNo}"},"author":{"role":"appMaker"},"messageSchema":"whatsapp","message":{"type":"template","template":{"namespace":"${templateNameSpaceWa}","name":"${templateName}","language":{"policy":"deterministic","code":"${tLangCode}"},"components":[{"type":"body","parameters":[${output}]}]}},"blocks":null}`;
    }

    var axios = require("axios");

    var config = {
      method: "post",
      url: `${waBusURL}/whatsapp/${waBusAppId}/notification`,
      headers: {
        Accept: ["application/json"],
        Authorization: [`Bearer ${waBusAuthKey}`],
        Connection: ["Keep-Alive"],
        "Content-Length": ["391"],
        "Content-Type": ["application/json"],
        "User-Agent": ["axios/0.21.4"],
        "X-Forwarded-For": ["65.1.252.196"],
        "X-Forwarded-Host": ["api.mapapi.io"],
        "X-Forwarded-Server": ["api.mapapi.io"],
      },
      data: dataString,
    };

    axios(config)
      .then(function (response) {
        console.log("response got", JSON.stringify(response.data)); //check rersponse
      })
      .catch(function (error) {
        console.log("error occured", error); //check error if error occured
      });
  } else if (waBusProvider === "gupshup") {
    const sourceNo = waBusSourceNo.replace(/[^\w ]/g, "");
    const axios = require("axios").default;
    let dataEncoded = "";
    // encode urls
    let imageLinkEnc = encodeURIComponent(image_link);
    let videoLinkEnc = encodeURIComponent(video_link);
    let doclinkEnc = encodeURIComponent(document_link);
    let fileNEnc = encodeURIComponent(document_name);

    // if image/video/doc Urls present, add the data to the dataString
    if (!!image_link) {
      dataEncoded = `source=${sourceNo}&destination=${phNo}&template=%7B%22id%22:%22${templateNameSpaceWa}%22,%22params%22:${output}%7D&message=%7B%22type%22:%22image%22,%22image%22:%7B%22link%22:%22${imageLinkEnc}%22%7D%7D`;
    } else if (!!video_link) {
      dataEncoded = `source=${sourceNo}&destination=${phNo}&template=%7B%22id%22:%22${templateNameSpaceWa}%22,%22params%22:${output}%7D&message=%7B%22type%22:%22video%22,%22video%22:%7B%22link%22:%22${videoLinkEnc}%22%7D%7D`;
    } else if (!!document_link) {
      dataEncoded = `source=${sourceNo}&destination=${phNo}&template=%7B%22id%22:%22${templateNameSpaceWa}%22,%22params%22:${output}%7D&message=%7B%22type%22:%22document%22,%22document%22:%7B%22link%22:%22${doclinkEnc}%22,%22filename%22:%22${fileNEnc}%22%7D%7D`;
    } else {
      dataEncoded = `source=${sourceNo}&destination=${phNo}&template=%7B%22id%22:%22${templateNameSpaceWa}%22,%22params%22:${output}%7D`;
    }

    // keeping logs and commented codes for future reference
    // const dataEncoded = `channel=whatsapp&source=917736660780&destination=${phNo}&message=%7B%22type%22:%22text%22,%22text%22:%22${dataEnc}%22%7D&src.name=${waBusAppId}`;
    // const dataEncoded = `channel=whatsapp&source=917834811114&destination=${phNo}&message=%7B%22type%22:%22text%22,%22text%22:%22${dataEnc}%22%7D&src.name=${waBusAppId}`;
    console.log("data final", dataEncoded);
    axios({
      method: "post", //you can set what request you want to be
      url: `${waBusURL}`,
      data: dataEncoded,
      headers: {
        apikey: `${waBusAuthKey}`,
        "Content-type": "application/x-www-form-urlencoded",
      },
    })
      .then((r) => {
        console.log("response" + JSON.stringify(r.data));
        console.log("r.status", r.status);
      })
      .catch((e) => {
        console.log("error" + e);
      });
  }
}

// send SMS
exports.callableSendSMS = functions.https.onCall((data, context) => {
  const template = data.templates;
  const selectedContacts = data.selected;
  const superUserDetails = data.superUserDetails;
  const allSubUsers = data.allSubUsers;
  // sms credentials
  const smsApiUserName = data.smsApiUserName;
  const smsApiPwd = data.smsApiPwd;
  const smsApiSenderId = data.smsApiSenderId;
  const smsApiEntityId = data.smsApiEntityId;
  const pipelines = data.pipelines;

  var contact;
  var assignedTo = {
    firstname: "",
    lastname: "",
    phone: "",
    countryCode: "",
    email: "",
  };
  var msgData = {
    to: "",
    html: "",
  }; //sms data format
  let countData = {
    counted: 0,
    type: "SMS",
    date: new Date(),
  };

  // if selected contacts array length > 0
  if (selectedContacts.length > 0) {
    for (let i = 0; i < selectedContacts.length; i++) {
      if (i === 0) {
        countData.counted = selectedContacts.length;
        addToBulkMessaging(countData, superUserDetails.superUserId);
      }
      contact = selectedContacts[i];
      if (!!contact) {
        if (!!contact.contactNo) {
          msgData.to = `+${contact.code}-${contact.contactNo}`;

          assignedTo.firstname = allSubUsers.find(
            (subuser) => subuser.userId === contact.assignedTo
          ).firstname;
          assignedTo.lastname = allSubUsers.find(
            (subuser) => subuser.userId === contact.assignedTo
          ).lastname;
          assignedTo.countryCode = allSubUsers.find(
            (subuser) => subuser.userId === contact.assignedTo
          ).code;
          assignedTo.phone = allSubUsers.find(
            (subuser) => subuser.userId === contact.assignedTo
          ).contactNo;
          assignedTo.email = allSubUsers.find(
            (subuser) => subuser.userId === contact.assignedTo
          ).email;

          if (!!template) {
            const smsApiTemplateId = template.smsApiTemplateId;
            msgData.html = template.body
              .replace(/\#\[contact.Company Name\]/g, contact.companyName)
              .replace(/\#\[contact.First Name\]/g, contact.firstName)
              .replace(
                /\#\[contact.Second Name\]/g,
                contact.secondName ? contact.secondName : ""
              )
              .replace(
                /\#\[contact.Contact No\]/g,
                contact.contactNo
                  ? contact.contactNo
                  : "Contact Number not provided"
              )
              .replace(
                /\#\[contact.Email\]/g,
                contact.email ? contact.email : "Email not provided"
              )
              .replace(/\#\[contact.Priority\]/g, contact.priority)
              .replace(/\#\[contact.Status\]/g, getStatusName(pipelines,contact.selectedContactPipeline,contact.status))
              .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
              .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
              .replace(
                /\#\[user.Last Name\]/g,
                assignedTo.lastname ? assignedTo.lastname : ""
              )
              .replace(
                /\#\[user.Contact No\]/g,
                assignedTo.phone
                  ? assignedTo.phone
                  : "Contact Number not provided"
              )
              .replace(
                /\#\[user.Email\]/g,
                assignedTo.email ? assignedTo.email : "Email not provided"
              );

            // contact additional field check and replacement
            if (superUserDetails.customFieldsContact) {
              let teststring = msgData.html;
              for (
                let i = 0;
                i < superUserDetails.customFieldsContact.length;
                i++
              ) {
                if (superUserDetails.customFieldsContact[i].isActive == true) {
                  var str1 =
                    "\\#\\[contact." +
                    superUserDetails.customFieldsContact[i].fieldName +
                    "\\]";

                  var re = new RegExp(str1, "g");
                  teststring = teststring.replace(
                    re,
                    contact.additionalFieldsArr[i + ""]
                      ? contact.additionalFieldsArr[i + ""].fieldValue
                        ? superUserDetails.customFieldsContact[i].fieldType ==
                          "date"
                          ? convertDateCallable(
                              contact.additionalFieldsArr[i + ""].fieldValue,
                              superUserDetails.timeZone
                            )
                          : superUserDetails.customFieldsContact[i].fieldType ==
                            "date_time"
                          ? convertDateTimeCallable(
                              contact.additionalFieldsArr[i + ""].fieldValue,
                              superUserDetails.timeZone
                            )
                          : contact.additionalFieldsArr[i + ""].fieldValue
                        : ""
                      : ""
                  );
                }
              }
              msgData.html = teststring;
            }

            messageConverted(msgData.html).then((msg) => {
              console.log("msg", msgData.to, msg); //keeping console to check other unapproved templates
              sendSMSfn(
                msgData.to,
                msg,
                smsApiUserName,
                smsApiPwd,
                smsApiSenderId,
                smsApiEntityId,
                smsApiTemplateId
              );
            });
          }
        }
      }
    }
  }

  return "SMS send";
});

// send whatsapp
exports.callableSendWa = functions.https.onCall((data, context) => {
  const template = data.templates;
  const selectedContacts = data.selected;
  const superId = data.superId;
  const superUserTimeZone = data.superUserTimeZone;
  const customFieldsContact = data.customFieldsContact;
  const waBusProvider = data.waBusProvider;
  const waBusAuthKey = data.waBusAuthKey;
  const waBusURL = data.waBusURL;
  const waBusIntId = data.waBusIntId;
  const waBusAppId = data.waBusAppId;
  const waBusSourceNo = data.waBusSourceNo;
  const allSubUsers = data.allSubUsers;
  const pipelines = data.pipelines;

  var contact;
  var assignedTo = {
    firstname: "",
    lastname: "",
    phone: "",
    countryCode: "",
    email: "",
  };
  let countData = {
    counted: 0,
    type: "WhatsApp",
    date: new Date(),
  };
  // if selected contacts array length > 0
  if (selectedContacts.length > 0) {
    countData.counted = selectedContacts.length;

    admin
      .firestore()
      .collection("users")
      .doc(superId)
      .collection("bulkMessaging")
      .add(countData)
      .then((data) => {
        if (data) {
          for (let i = 0; i < selectedContacts.length; i++) {
            contact = selectedContacts[i];

            const destNo = `+${contact.code}-${contact.contactNo}`;
            assignedTo.firstname = allSubUsers.find(
              (subuser) => subuser.userId === contact.assignedTo
            ).firstname;
            assignedTo.lastname = allSubUsers.find(
              (subuser) => subuser.userId === contact.assignedTo
            ).lastname;
            assignedTo.countryCode = allSubUsers.find(
              (subuser) => subuser.userId === contact.assignedTo
            ).code;
            assignedTo.phone = allSubUsers.find(
              (subuser) => subuser.userId === contact.assignedTo
            ).contactNo;
            assignedTo.email = allSubUsers.find(
              (subuser) => subuser.userId === contact.assignedTo
            ).email;

            const message = template.body;
            const templateNameSpaceWa = template.templateNameSpaceWa;
            const templateName = template.templateName;
            const tLangCode = template.tLangCode;
            const image_link = template.image_link;
            const video_link = template.video_link;
            const document_link = template.document_link;
            const document_name = template.document_name;

            let phNo = destNo.replace(/[^\w ]/g, ""); //remove + and - ;in automation collection, we are saving phno as +91-999999999 format
            let paramCheck = message.match(/(?<=\#\[)[^\][]*(?=])/g); //extract data inside #[]
            let paramsArray = []; // to save the corresponding values of general variables
            var output = ""; //to save the JSON stringify form of replaced variables

            if (!!paramCheck && paramCheck !== null && paramCheck.length > 0) {
              //if parameters inside #[] is present
              for (let i = 0; i < paramCheck.length; i++) {
                //add that mush elements to array after replacing the original value, handle dates also
                if (paramCheck[i] === "contact.First Name") {
                  paramsArray.splice(i, 0, `${contact.firstName}`);
                } else if (paramCheck[i] === "contact.Second Name") {
                  paramsArray.splice(i, 0, `${contact.secondName}`);
                } else if (paramCheck[i] === "contact.Company Name") {
                  paramsArray.splice(i, 0, `${contact.companyName}`);
                } else if (paramCheck[i] === "contact.Email") {
                  paramsArray.splice(i, 0, `${contact.email}`);
                } else if (paramCheck[i] === "contact.Contact No") {
                  paramsArray.splice(
                    i,
                    0,
                    `${contact.code}${contact.contactNo}`
                  );
                } else if (paramCheck[i] === "contact.Priority") {
                  paramsArray.splice(i, 0, `${contact.priority}`);
                } else if (paramCheck[i] === "contact.Status") {
                  paramsArray.splice(i, 0, `${getStatusName(pipelines,contact.selectedContactPipeline,contact.status)}`);
                } else if (paramCheck[i] === "contact.Assigned To") {
                  paramsArray.splice(i, 0, `${contact.assignedToName}`);
                } else if (paramCheck[i] === "user.First Name") {
                  paramsArray.splice(i, 0, `${assignedTo.firstname}`);
                } else if (paramCheck[i] === "user.Last Name") {
                  paramsArray.splice(i, 0, `${assignedTo.lastname}`);
                } else if (paramCheck[i] === "user.Contact No") {
                  paramsArray.splice(
                    i,
                    0,
                    assignedTo.phone
                      ? `+${assignedTo.countryCode}${assignedTo.phone}`
                      : "Contact Number not Provided"
                  );
                } else if (paramCheck[i] === "user.Email") {
                  paramsArray.splice(i, 0, `${assignedTo.email}`);
                }
                // contact additional fields
                if (!!customFieldsContact) {
                  for (let l = 0; l < customFieldsContact.length; l++) {
                    if (customFieldsContact[l + ""].isActive === true) {
                      if (
                        paramCheck[i] ===
                          `contact.${customFieldsContact[l + ""].fieldName}` &&
                        !!contact.additionalFieldsArr[l + ""]
                      ) {
                        if (
                          customFieldsContact[l + ""].fieldType === "date" &&
                          !!contact.additionalFieldsArr[l + ""].fieldValue
                        ) {
                          paramsArray.splice(
                            i,
                            0,
                            `${this.convertDateCallable(
                              contact.additionalFieldsArr[l + ""].fieldValue,
                              superUserTimeZone
                            )}`
                          );
                        } else if (
                          customFieldsContact[l + ""].fieldType ===
                            "date_time" &&
                          !!contact.additionalFieldsArr[l + ""].fieldValue
                        ) {
                          paramsArray.splice(
                            i,
                            0,
                            `${this.convertDateTimeCallable(
                              contact.additionalFieldsArr[l + ""].fieldValue,
                              superUserTimeZone
                            )}`
                          );
                        } else if (
                          !!contact.additionalFieldsArr[l + ""].fieldValue
                        ) {
                          paramsArray.splice(
                            i,
                            0,
                            `${contact.additionalFieldsArr[l + ""].fieldValue}`
                          );
                        } else {
                          paramsArray.splice(i, 0, `Value not provided`);
                        }
                      } else if (
                        paramCheck[i] ===
                        `contact.${customFieldsContact[l + ""].fieldName}`
                      ) {
                        paramsArray.splice(i, 0, `Value not provided`);
                      }
                    }
                  }
                }
              }
              console.log("paramsArray", paramsArray); //keeping logs to check unapproved templates
              output = ""; //ensure empty string
              if (waBusProvider === "moplet") {
                for (let i = 0; i < paramsArray.length; i++) {
                  if (i === paramsArray.length - 1) {
                    output += `{"type":"text","text":"${paramsArray[i]}"}`;
                  } else {
                    output += `{"type":"text","text":"${paramsArray[i]}"},`; //comma presnt if not last element
                  }
                }
              } else if (waBusProvider === "gupshup") {

                  output = `[`;
                  for (let i = 0; i < paramsArray.length; i++) {
                    console.log(paramsArray[i]);
                    if (i === paramsArray.length - 1) {
                      // encoded data is needed
                      output += `%22${paramsArray[i]}%22]`;
                    } else {
                      output += `%22${paramsArray[i]}%22,`; //comma presnt if not last element
                    }
                  }

              }
            } else{
              if (waBusProvider === "gupshup"){
                console.log('no params else entered')
                output="[]";
              }else if (waBusProvider === "moplet"){
                output=""
                output += `{"type":"text","text":"[]"}`;
              }
            }
            console.log("output new 2nd", output);
            // console.log("JSON parameters data", JSON.parse(output)); //keeping logs to check unapproved templates

            if (waBusProvider === "moplet") {
              // if no values are there to replace create a default datastring
              var dataString = `{"storage":"full","destination":{"integrationId":"${waBusIntId}","destinationId":"${phNo}"},"author":{"role":"appMaker"},"messageSchema":"whatsapp","message":{"type":"template","template":{"namespace":"${templateNameSpaceWa}","name":"${templateName}","language":{"policy":"deterministic","code":"${tLangCode}"},"components":[]}},"blocks":null}`;

              // if image/video/doc Urls present, add the data to the dataString
              if (!!image_link) {
                dataString = `{"storage":"full","destination":{"integrationId":"${waBusIntId}","destinationId":"${phNo}"},"author":{"role":"appMaker"},"messageSchema":"whatsapp","message":{"type":"template","template":{"namespace":"${templateNameSpaceWa}","name":"${templateName}","language":{"policy":"deterministic","code":"${tLangCode}"},"components":[{"parameters":[{"image":{"link":"${image_link}"},"type":"image"}],"type":"header"},{"parameters":[${output}],"type":"body"}]}},"blocks":null}`;
              } else if (!!video_link) {
                dataString = `{"storage":"full","destination":{"integrationId":"${waBusIntId}","destinationId":"${phNo}"},"author":{"role":"appMaker"},"messageSchema":"whatsapp","message":{"type":"template","template":{"namespace":"${templateNameSpaceWa}","name":"${templateName}","language":{"policy":"deterministic","code":"${tLangCode}"},"components":[{"parameters":[{"video":{"link":"${video_link}"},"type":"video"}],"type":"header"},{"parameters":[${output}],"type":"body"}]}},"blocks":null}`;
              } else if (!!document_link) {
                dataString = `{"storage":"full","destination":{"integrationId":"${waBusIntId}","destinationId":"${phNo}"},"author":{"role":"appMaker"},"messageSchema":"whatsapp","message":{"type":"template","template":{"namespace":"${templateNameSpaceWa}","name":"${templateName}","language":{"policy":"deterministic","code":"${tLangCode}"},"components":[{"parameters":[{"document":{"link":"${document_link}","filename":"${document_name}"},"type":"document"}],"type":"header"},{"parameters":[${output}],"type":"body"}]}},"blocks":null}`;
              } else {
                dataString = `{"storage":"full","destination":{"integrationId":"${waBusIntId}","destinationId":"${phNo}"},"author":{"role":"appMaker"},"messageSchema":"whatsapp","message":{"type":"template","template":{"namespace":"${templateNameSpaceWa}","name":"${templateName}","language":{"policy":"deterministic","code":"${tLangCode}"},"components":[{"type":"body","parameters":[${output}]}]}},"blocks":null}`;
              }

              var axios = require("axios");

              var config = {
                method: "post",
                url: `${waBusURL}/whatsapp/${waBusAppId}/notification`,
                headers: {
                  Accept: ["application/json"],
                  Authorization: [`Bearer ${waBusAuthKey}`],
                  Connection: ["Keep-Alive"],
                  "Content-Length": ["391"],
                  "Content-Type": ["application/json"],
                  "User-Agent": ["axios/0.21.4"],
                  "X-Forwarded-For": ["65.1.252.196"],
                  "X-Forwarded-Host": ["api.mapapi.io"],
                  "X-Forwarded-Server": ["api.mapapi.io"],
                },
                data: dataString,
              };

              axios(config)
                .then(function (response) {
                  console.log("response got", i, JSON.stringify(response.data)); //check rersponse
                })
                .catch(function (error) {
                  console.log("error occured", error); //check error if error occured
                });
            } else if (waBusProvider === "gupshup") {
              const sourceNo = waBusSourceNo.replace(/[^\w ]/g, "");
              const axios = require("axios").default;
              let dataEncoded = "";
              // encode urls
              let imageLinkEnc = encodeURIComponent(image_link);
              let videoLinkEnc = encodeURIComponent(video_link);
              let doclinkEnc = encodeURIComponent(document_link);
              let fileNEnc = encodeURIComponent(document_name);

              // if image/video/doc Urls present, add the data to the dataString
              if (!!image_link) {
                dataEncoded = `source=${sourceNo}&destination=${phNo}&template=%7B%22id%22:%22${templateNameSpaceWa}%22,%22params%22:${output}%7D&message=%7B%22type%22:%22image%22,%22image%22:%7B%22link%22:%22${imageLinkEnc}%22%7D%7D`;
              } else if (!!video_link) {
                dataEncoded = `source=${sourceNo}&destination=${phNo}&template=%7B%22id%22:%22${templateNameSpaceWa}%22,%22params%22:${output}%7D&message=%7B%22type%22:%22video%22,%22video%22:%7B%22link%22:%22${videoLinkEnc}%22%7D%7D`;
              } else if (!!document_link) {
                dataEncoded = `source=${sourceNo}&destination=${phNo}&template=%7B%22id%22:%22${templateNameSpaceWa}%22,%22params%22:${output}%7D&message=%7B%22type%22:%22document%22,%22document%22:%7B%22link%22:%22${doclinkEnc}%22,%22filename%22:%22${fileNEnc}%22%7D%7D`;
              } else {
                dataEncoded = `source=${sourceNo}&destination=${phNo}&template=%7B%22id%22:%22${templateNameSpaceWa}%22,%22params%22:${output}%7D`;
              }

              // keeping commented code and logs for future reference
              // const dataEncoded = `channel=whatsapp&source=917736660780&destination=${phNo}&message=%7B%22type%22:%22text%22,%22text%22:%22${dataEnc}%22%7D&src.name=${waBusAppId}`;
              // const dataEncoded = `channel=whatsapp&source=917834811114&destination=${phNo}&message=%7B%22type%22:%22text%22,%22text%22:%22${dataEnc}%22%7D&src.name=${waBusAppId}`;
              console.log("document link added 7", dataEncoded); //keep consoles purposefully
              axios({
                method: "post", //you can set what request you want to be
                url: `${waBusURL}`,
                data: dataEncoded,
                headers: {
                  apikey: `${waBusAuthKey}`,
                  "Content-type": "application/x-www-form-urlencoded",
                },
              })
                .then((r) => {
                  console.log("response got", i, JSON.stringify(r.data)); //check rersponse
                })
                .catch((e) => {
                  console.log("error" + e);
                });
            }
          }
        }
      });
  }
  return "whatsapp message sent";
});

const runtimeOpts = {
  timeoutSeconds: 540,
  memory: "256MB",
};
// send email
exports.callableSendEmail = functions
  .runWith(runtimeOpts)
  .https.onCall(async (data, context) => {
    const template = data.templates;
    const selectedContacts = data.selected;
    const superUserId = data.superUserId;
    const superUserDetails = data.superUserDetails;
    const allSubUsers = data.allSubUsers;
    const loggedInUser = data.loggedInUser;
    const pipelines = data.pipelines;
    var contact;
    var assignedTo = {
      firstname: "",
      lastname: "",
      phone: "",
      countryCode: "",
      email: "",
    };
    var emailData = {
      to: "",
      subject: "",
      cc: "",
      bcc: "",
      html: "",
      customerId: "",
      loggedInUser: "",
    }; //sms data format

    if (!!template) {
      // if selected contacts array length > 0
      if (selectedContacts.length > 0) {
        for (let i = 0; i < selectedContacts.length; i++) {
          if (!!selectedContacts[i].email) {
            emailData = {
              to: selectedContacts[i].email,
              subject: template.subject,
              cc: "",
              bcc: "",
              html: "",
              customerId: selectedContacts[i].id,
              loggedInUser: loggedInUser,
            }; //sms data format

            contact = selectedContacts[i];

            assignedTo.firstname = allSubUsers.find(
              (subuser) => subuser.userId === contact.assignedTo
            ).firstname;
            assignedTo.lastname = allSubUsers.find(
              (subuser) => subuser.userId === contact.assignedTo
            ).lastname;
            assignedTo.countryCode = allSubUsers.find(
              (subuser) => subuser.userId === contact.assignedTo
            ).code;
            assignedTo.phone = allSubUsers.find(
              (subuser) => subuser.userId === contact.assignedTo
            ).contactNo;
            assignedTo.email = allSubUsers.find(
              (subuser) => subuser.userId === contact.assignedTo
            ).email;

            emailData.html = template.body
              .replace(/\#\[contact.Company Name\]/g, contact.companyName)
              .replace(/\#\[contact.First Name\]/g, contact.firstName)
              .replace(
                /\#\[contact.Second Name\]/g,
                contact.secondName ? contact.secondName : ""
              )
              .replace(
                /\#\[contact.Contact No\]/g,
                contact.contactNo ? contact.contactNo : ""
              )
              .replace(
                /\#\[contact.Email\]/g,
                contact.email ? contact.email : ""
              )
              .replace(/\#\[contact.Priority\]/g, contact.priority)
              .replace(/\#\[contact.Status\]/g, getStatusName(pipelines, contact.selectedContactPipeline, contact.status))
              .replace(/\#\[contact.Assigned To\]/g, contact.assignedToName)
              .replace(/\#\[user.First Name\]/g, assignedTo.firstname)
              .replace(
                /\#\[user.Last Name\]/g,
                assignedTo.lastname ? assignedTo.lastname : ""
              )
              .replace(
                /\#\[user.Contact No\]/g,
                assignedTo.phone ? assignedTo.phone : ""
              )
              .replace(
                /\#\[user.Email\]/g,
                assignedTo.email ? assignedTo.email : ""
              );
            // contact additional field check and replacement
            if (superUserDetails.customFieldsContact) {
              let teststring = emailData.html;
              for (
                let i = 0;
                i < superUserDetails.customFieldsContact.length;
                i++
              ) {
                if (superUserDetails.customFieldsContact[i].isActive == true) {
                  var str1 =
                    "\\#\\[contact." +
                    superUserDetails.customFieldsContact[i].fieldName +
                    "\\]";

                  var re = new RegExp(str1, "g");
                  teststring = teststring.replace(
                    re,
                    contact.additionalFieldsArr[i + ""]
                      ? contact.additionalFieldsArr[i + ""].fieldValue
                        ? superUserDetails.customFieldsContact[i].fieldType ==
                          "date"
                          ? convertDateCallable(
                              contact.additionalFieldsArr[i + ""].fieldValue,
                              superUserDetails.timeZone
                            )
                          : superUserDetails.customFieldsContact[i].fieldType ==
                            "date_time"
                          ? convertDateTimeCallable(
                              contact.additionalFieldsArr[i + ""].fieldValue,
                              superUserDetails.timeZone
                            )
                          : contact.additionalFieldsArr[i + ""].fieldValue
                        : ""
                      : ""
                  );
                }
              }
              emailData.html = teststring;
            }
            await addToMail(emailData, superUserId).then((resp) => {});
          }
        }
      }
    }

    return "Email sent";
  });

// promise function to add to bulkMails collection
function addToMail(emailData, userId) {
  return new Promise(function (resolve, reject) {
    admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("bulkMails")
      .add(emailData)
      .then((data) => {
        console.log("emailData success");
        resolve();
      })
      .catch((err) => {
        console.log("error occured");
        reject();
      });
  });
}

// if adding to BulkMail, send email
exports.bulkMails = functions.firestore
  .document("users/{userId}/bulkMails/{documentId}")
  .onCreate((snap, context) => {
    createdData = snap.data();
    let att = createdData.attachments ? createdData.attachments : [];
    return admin
      .firestore()
      .doc("users/" + context.params.userId + "/SMTPsettings/SMTP")
      .get()
      .then((data) => {
        if (data) {
          let from = "";
          if (data.data().type) {
            from =
              data.data().type == "mailService"
                ? data.data().From
                : data.data().SMTP.auth.user;
          }
          let smtpConnectionUrl = data.data().SMTP;
          // smtpConnectionUrl=data.data().type=="mailService"?data.data().SMTP.SMTPUrl:data.data().SMTP

          // console.log(smtpConnectionUrl)
          const nodemailer = require("nodemailer");
          // const MailComposer = require("nodemailer/lib/mail-composer");
          // console.log(req.body)
          // var Mail=new MailComposer(req.body)
          let poolconfig = smtpConnectionUrl;
          var html = "";

          html = createdData.html;
          let transporter = nodemailer.createTransport(poolconfig);

          transporter.sendMail(
            {
              // sender:req.body.from,
              from: from,
              to: createdData.to,
              cc: createdData.cc,
              html: html,
              subject: createdData.subject,
              attachments: createdData.attachments
                ? createdData.attachments
                : [],
              envelope: {
                from: from, // used as MAIL FROM: address for SMTP
                to: createdData.to, // used as RCPT TO: address for SMTP
                //console.log(req.body.messages)
              },
            },
            (err, info) => {
              if (err) {
                console.log(err);
                admin
                  .firestore()
                  .doc(
                    "users/" +
                      context.params.userId +
                      "/bulkMails/" +
                      context.params.documentId
                  )
                  .update({ sendStatus: false })
                  .then((data) => {
                    console.log(data);
                  });
              }

              if (info) {
                console.log(info);
                admin
                  .firestore()
                  .doc(
                    "users/" +
                      context.params.userId +
                      "/bulkMails/" +
                      context.params.documentId
                  )
                  .update({
                    sendReport: info,
                    date: new Date(),
                    sendStatus: true,
                    from: from,
                    attachments: att,
                  })
                  .then((data) => {
                    console.log(data);
                  });
              }
            }
          );
        }
      });
  });

// while mail is sent, status is true, save it to Email Collection
// exports.bulkMailsEdited = functions
//   .region(region)
//   .firestore.document("/users/{userId}/bulkMails/{documentId}")
//   .onUpdate((change, context) => {
//     const userId = context.params.userId; //superUserId
//     const newData = change.after.data();
//     console.log("bulkEmail edited fn");
//     if (newData.sendStatus === true) {
//       addToEmailCollection(userId, newData);
//     }
//   });

// add to EMail collection fn
// function addToEmailCollection(userId, newData) {
//   console.log("userId, newData", userId, newData);
//   let messageHistory = {
//     0: {
//       threadId: newData.sendReport.response.split(" ").pop(),
//       from: newData.from,
//       to: newData.to,
//       cc: newData.cc,
//       bcc: newData.bcc,
//       //encrypt the body
//       body: newData.html,
//       subject: newData.subject,
//       date: new Date(),
//       attachments: newData.attachments,
//       messageID: newData.messageId,
//     },
//   };
//   let mailData = {
//     customerId: newData.customerId,
//     loggedInUser: newData.loggedInUser,
//     newmsgflag: false,
//     numberofmessages: 1,
//     messageHistory,
//   };
//   console.log("addToEmailCollection fn", mailData);
//   return admin
//     .firestore()
//     .collection("users/" + userId + "/Email")
//     .add(mailData)
//     .then((res) => {
//       console.log("added to Email collection");
//     })
//     .catch((e) => {
//       console.log(e.message);
//     });
// }
// promise function to add to bulkMessaging collection
function addToBulkMessaging(countData, userId) {
  console.log("addToBulkMessaging, countData, userId", countData, userId);
  return new Promise(function (resolve, reject) {
    admin
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("bulkMessaging")
      .add(countData)
      .then((data) => {
        resolve();
      })
      .catch((err) => {
        reject();
      });
  });
}
// test ends here

// on create product update the sale estimated amout
// exports.onProductCreateUpdateDetails = functions
//   .region(region)
//   .firestore.document("/users/{userId}/sales/{saleId}/items/{itemId}")
//   .onCreate(async (snap, context) => {
//     var userId = context.params.userId;
//     var saleId = context.params.saleId;
//     return admin
//       .firestore()
//       .runTransaction((t) => {
//         const saleDeailRef = admin
//           .firestore()
//           .collection("users")
//           .doc(userId)
//           .collection("sales")
//           .doc(saleId);
//         return t.get(saleDeailRef).then((doc) => {
//           var amountAfterDisc =
//             snap.data().unitPrice * (1 - snap.data().discount / 100);
//           var total = amountAfterDisc * snap.data().quantity;
//           let totalEstAmout = doc.data().estimatedValue + total;
//           let newTotalEstAmount = totalEstAmout;
//           if (typeof totalEstAmout == "number") {
//             newTotalEstAmount = Number(totalEstAmout).toFixed(2);
//           }
//           t.update(saleDeailRef, {
//             estimatedValue: Number(newTotalEstAmount),
//           });
//         });
//       })
//       .then((result) => {
//         console.info("Transaction success!");
//       })
//       .catch((err) => {
//         console.error("Transaction failure:", err);
//       });
//   });
// // on edit invoice update the sale estimated amout
// exports.onProductEditUpdateDetails = functions
//   .region(region)
//   .firestore.document("/users/{userId}/sales/{saleId}/items/{itemId}")
//   .onUpdate(async (change, context) => {
//     var userId = context.params.userId;
//     var saleId = context.params.saleId;
//     var amountAfterDisc =
//       change.after.data().unitPrice * (1 - change.after.data().discount / 100);
//     var totalamountAfterDisc = amountAfterDisc * change.after.data().quantity;
//     var amountAfterDiscPrvious =
//       change.before.data().unitPrice *
//       (1 - change.before.data().discount / 100);
//     var totalamountAfterDiscPrvious =
//       amountAfterDiscPrvious * change.before.data().quantity;
//     if (totalamountAfterDisc != totalamountAfterDiscPrvious) {
//       // calculate the difference and add the invoice value
//       var previoutTotalAmount = totalamountAfterDiscPrvious;
//       var currentTotalAmount = totalamountAfterDisc;
//       var TotalVariation = currentTotalAmount - previoutTotalAmount;
//       return admin
//         .firestore()
//         .runTransaction((t) => {
//           const saleDeailRef = admin
//             .firestore()
//             .collection("users")
//             .doc(userId)
//             .collection("sales")
//             .doc(saleId);
//           return t.get(saleDeailRef).then((doc) => {
//             let totalEstAmout = doc.data().estimatedValue + TotalVariation;
//             let newTotalEstAmount = totalEstAmout;
//             if (typeof totalEstAmout == "number") {
//               newTotalEstAmount = Number(totalEstAmout).toFixed(2);
//             }
//             t.update(saleDeailRef, {
//               estimatedValue: Number(newTotalEstAmount),
//             });
//           });
//         })
//         .then((result) => {
//           console.info("Transaction success!");
//         })
//         .catch((err) => {
//           console.error("Transaction failure:", err);
//         });
//     }
//   });
// // on delete invoice update the sale estimated amout
// exports.onProductDeleteUpdateDetails = functions
//   .region(region)
//   .firestore.document("/users/{userId}/sales/{saleId}/items/{itemId}")
//   .onDelete(async (snap, context) => {
//     var userId = context.params.userId;
//     var saleId = context.params.saleId;
//     return admin
//       .firestore()
//       .runTransaction((t) => {
//         const saleDeailRef = admin
//           .firestore()
//           .collection("users")
//           .doc(userId)
//           .collection("sales")
//           .doc(saleId);
//         return t.get(saleDeailRef).then((doc) => {
//           var amountAfterDisc =
//             snap.data().unitPrice * (1 - snap.data().discount / 100);
//           var total = amountAfterDisc * snap.data().quantity;
//           let totalEstAmout = doc.data().estimatedValue - total;
//           let newTotalEstAmount = totalEstAmout;
//           if (typeof totalEstAmout == "number") {
//             newTotalEstAmount = Number(totalEstAmout).toFixed(2);
//           }
//           t.update(saleDeailRef, {
//             estimatedValue: Number(newTotalEstAmount),
//           });
//         });
//       })
//       .then((result) => {
//         console.info("Transaction success!");
//       })
//       .catch((err) => {
//         console.error("Transaction failure:", err);
//       });
//   });

//for updating payment while create payment receipt
exports.PaymentReceiptAmountUpdateOnCreate = functions
  .region(region)
  .firestore.document("/users/{userUid}/paymentsreceived/{documentId}")
  .onCreate(async (snap, context) => {
    createdDocument = snap.data();
    let saleId = createdDocument.saleid ? createdDocument.saleid : null;
    let customerId = createdDocument.customerId
      ? createdDocument.customerId
      : null;
    let invoiceId = createdDocument.invoiceno;
    let orgId = createdDocument.orgId ? createdDocument.orgId : null;
    let superUserId = context.params.userUid;
    amountUpdateonCreatePayment(
      superUserId,
      saleId,
      customerId,
      invoiceId,
      snap.data().amountCollected,
      orgId
    );
  });

function amountUpdateonCreatePayment(
  userId,
  saleId,
  customerId,
  invoiceId,
  amountCollected,
  orgId
) {
  let transactionPromiseSale;
  if (saleId) {
    transactionPromiseSale = admin
      .firestore()
      .runTransaction((t) => {
        const saleDeailRef = admin
          .firestore()
          .collection("users")
          .doc(userId)
          .collection("sales")
          .doc(saleId);
        return t.get(saleDeailRef).then((doc) => {
          let totalAmout = doc.data().collectedAmount + amountCollected;

          let newTotalAmout = totalAmout;
          if (typeof totalAmout == "number") {
            newTotalAmout = Number(totalAmout).toFixed(2);
          }
          t.update(saleDeailRef, {
            collectedAmount: Number(newTotalAmout),
          });
        });
      })
      .then((result) => {
        console.info("Transaction success!");
      })
      .catch((err) => {
        console.error("Transaction failure:", err);
      });
  }
  let transactionPromiseCustomer;
  if (customerId) {
    transactionPromiseCustomer = admin
      .firestore()
      .runTransaction((t) => {
        const customerDeailRef = admin
          .firestore()
          .collection("users")
          .doc(userId)
          .collection("customers")
          .doc(customerId);
        return t.get(customerDeailRef).then((doc) => {
          let totalAmout = doc.data().totalAmountCollected + amountCollected;

          let newTotalAmout = totalAmout;
          if (typeof totalAmout == "number") {
            newTotalAmout = Number(totalAmout).toFixed(2);
          }
          t.update(customerDeailRef, {
            totalAmountCollected: Number(newTotalAmout),
          });
        });
      })
      .then((result) => {
        console.info("Transaction success!");
      })
      .catch((err) => {
        console.error("Transaction failure:", err);
      });
  }
  let transactionPromiseOrg;
  if (orgId) {
    transactionPromiseOrg = admin
      .firestore()
      .runTransaction((t) => {
        const orgDeailRef = admin
          .firestore()
          .collection("users")
          .doc(userId)
          .collection("Organisations")
          .doc(orgId);
        return t.get(orgDeailRef).then((doc) => {
          let totalAmout = doc.data().collected + amountCollected;

          let newTotalAmout = totalAmout;
          if (typeof totalAmout == "number") {
            newTotalAmout = Number(totalAmout).toFixed(2);
          }
          t.update(orgDeailRef, {
            collected: Number(newTotalAmout),
          });
        });
      })
      .then((result) => {
        console.info("Transaction success!");
      })
      .catch((err) => {
        console.error("Transaction failure:", err);
      });
  }
  let transactionPromiseInvoice;
  if (invoiceId && invoiceId != "N/A") {
    transactionPromiseInvoice = admin
      .firestore()
      .runTransaction((t) => {
        const invoiceDeailRef = admin
          .firestore()
          .collection("users")
          .doc(userId)
          .collection("Invoices")
          .doc(invoiceId);
        return t.get(invoiceDeailRef).then((doc) => {
          let totalAmout = doc.data().collectedAmount + amountCollected;

          let newTotalAmout = totalAmout;
          if (typeof totalAmout == "number") {
            newTotalAmout = Number(totalAmout).toFixed(2);
          }
          t.update(invoiceDeailRef, {
            collectedAmount: Number(newTotalAmout),
          });
        });
      })
      .then((result) => {
        console.info("Transaction success!");
      })
      .catch((err) => {
        console.error("Transaction failure:", err);
      });
  }

  return Promise.all([
    transactionPromiseSale,
    transactionPromiseCustomer,
    transactionPromiseOrg,
    transactionPromiseInvoice,
  ]);
}
function amountUpdateonUpdatePayment(
  userId,
  saleId,
  prevSaleId,
  customerId,
  prevCustomerId,
  orgId,
  prevOrgId,
  invoiceId,
  prevInvoiceId,
  amountCollected,
  prevAmountCollected,
  amountDifference
) {
  let transactionPromiseSale;
  let transactionPromisePrevSale;
  if (prevSaleId != saleId) {
    if (saleId) {
      transactionPromiseSale = admin
        .firestore()
        .runTransaction((t) => {
          const saleDeailRef = admin
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("sales")
            .doc(saleId);
          return t.get(saleDeailRef).then((doc) => {
            let totalAmout = doc.data().collectedAmount + amountCollected;

            let newTotalAmout = totalAmout;
            if (typeof totalAmout == "number") {
              newTotalAmout = Number(totalAmout).toFixed(2);
            }
            t.update(saleDeailRef, {
              collectedAmount: Number(newTotalAmout),
            });
          });
        })
        .then((result) => {
          console.info("Transaction success!");
        })
        .catch((err) => {
          console.error("Transaction failure:", err);
        });
    }
    if (prevSaleId) {
      transactionPromisePrevSale = admin
        .firestore()
        .runTransaction((t) => {
          const prevSaleDeailRef = admin
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("sales")
            .doc(prevSaleId);
          return t.get(prevSaleDeailRef).then((doc) => {
            let totalAmout = doc.data().collectedAmount - prevAmountCollected;

            let newTotalAmout = totalAmout;
            if (typeof totalAmout == "number") {
              newTotalAmout = Number(totalAmout).toFixed(2);
            }
            t.update(prevSaleDeailRef, {
              collectedAmount: Number(newTotalAmout),
            });
          });
        })
        .then((result) => {
          console.info("Transaction success!");
        })
        .catch((err) => {
          console.error("Transaction failure:", err);
        });
    }
  }
  if (prevSaleId == saleId && prevAmountCollected != amountCollected) {
    if (saleId) {
      transactionPromiseSale = admin
        .firestore()
        .runTransaction((t) => {
          const saleDeailRef = admin
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("sales")
            .doc(saleId);
          return t.get(saleDeailRef).then((doc) => {
            let totalAmout = doc.data().collectedAmount + amountDifference;

            let newTotalAmout = totalAmout;
            if (typeof totalAmout == "number") {
              newTotalAmout = Number(totalAmout).toFixed(2);
            }
            t.update(saleDeailRef, {
              collectedAmount: Number(newTotalAmout),
            });
          });
        })
        .then((result) => {
          console.info("Transaction success!");
        })
        .catch((err) => {
          console.error("Transaction failure:", err);
        });
    }
  }
  let transactionPromiseCustomer;
  let transactionPromisePrevCustomer;
  if (prevCustomerId != customerId) {
    if (customerId) {
      transactionPromiseCustomer = admin
        .firestore()
        .runTransaction((t) => {
          const customerDeailRef = admin
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("customers")
            .doc(customerId);
          return t.get(customerDeailRef).then((doc) => {
            let totalAmout = doc.data().totalAmountCollected + amountCollected;

            let newTotalAmout = totalAmout;
            if (typeof totalAmout == "number") {
              newTotalAmout = Number(totalAmout).toFixed(2);
            }
            t.update(customerDeailRef, {
              totalAmountCollected: Number(newTotalAmout),
            });
          });
        })
        .then((result) => {
          console.info("Transaction success!");
        })
        .catch((err) => {
          console.error("Transaction failure:", err);
        });
    }
    if (prevCustomerId) {
      transactionPromisePrevCustomer = admin
        .firestore()
        .runTransaction((t) => {
          const prevCustomerDeailRef = admin
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("customers")
            .doc(prevCustomerId);
          return t.get(prevCustomerDeailRef).then((doc) => {
            let totalAmout =
              doc.data().totalAmountCollected - prevAmountCollected;

            let newTotalAmout = totalAmout;
            if (typeof totalAmout == "number") {
              newTotalAmout = Number(totalAmout).toFixed(2);
            }
            t.update(prevCustomerDeailRef, {
              totalAmountCollected: Number(newTotalAmout),
            });
          });
        })
        .then((result) => {
          console.info("Transaction success!");
        })
        .catch((err) => {
          console.error("Transaction failure:", err);
        });
    }
  }
  if (prevCustomerId == customerId && prevAmountCollected != amountCollected) {
    if (customerId) {
      transactionPromiseCustomer = admin
        .firestore()
        .runTransaction((t) => {
          const customerDeailRef = admin
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("customers")
            .doc(customerId);
          return t.get(customerDeailRef).then((doc) => {
            let totalAmout = doc.data().totalAmountCollected + amountDifference;

            let newTotalAmout = totalAmout;
            if (typeof totalAmout == "number") {
              newTotalAmout = Number(totalAmout).toFixed(2);
            }
            t.update(customerDeailRef, {
              totalAmountCollected: Number(newTotalAmout),
            });
          });
        })
        .then((result) => {
          console.info("Transaction success!");
        })
        .catch((err) => {
          console.error("Transaction failure:", err);
        });
    }
  }
  let transactionPromiseOrg;
  let transactionPromisePrevOrg;
  if (prevOrgId != orgId) {
    if (orgId) {
      transactionPromiseOrg = admin
        .firestore()
        .runTransaction((t) => {
          const orgDeailRef = admin
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("Organisations")
            .doc(orgId);
          return t.get(orgDeailRef).then((doc) => {
            let totalAmout = doc.data().collected + amountCollected;

            let newTotalAmout = totalAmout;
            if (typeof totalAmout == "number") {
              newTotalAmout = Number(totalAmout).toFixed(2);
            }
            t.update(orgDeailRef, {
              collected: Number(newTotalAmout),
            });
          });
        })
        .then((result) => {
          console.info("Transaction success!");
        })
        .catch((err) => {
          console.error("Transaction failure:", err);
        });
    }
    if (prevOrgId) {
      transactionPromisePrevOrg = admin
        .firestore()
        .runTransaction((t) => {
          const prevOrgDeailRef = admin
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("Organisations")
            .doc(prevOrgId);
          return t.get(prevOrgDeailRef).then((doc) => {
            let totalAmout = doc.data().collected - prevAmountCollected;

            let newTotalAmout = totalAmout;
            if (typeof totalAmout == "number") {
              newTotalAmout = Number(totalAmout).toFixed(2);
            }
            t.update(prevOrgDeailRef, {
              collected: Number(newTotalAmout),
            });
          });
        })
        .then((result) => {
          console.info("Transaction success!");
        })
        .catch((err) => {
          console.error("Transaction failure:", err);
        });
    }
  }
  if (prevOrgId == orgId && prevAmountCollected != amountCollected) {
    if (orgId) {
      transactionPromiseOrg = admin
        .firestore()
        .runTransaction((t) => {
          const orgDeailRef = admin
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("Organisations")
            .doc(orgId);
          return t.get(orgDeailRef).then((doc) => {
            let totalAmout = doc.data().collected + amountDifference;

            let newTotalAmout = totalAmout;
            if (typeof totalAmout == "number") {
              newTotalAmout = Number(totalAmout).toFixed(2);
            }
            t.update(orgDeailRef, {
              collected: Number(newTotalAmout),
            });
          });
        })
        .then((result) => {
          console.info("Transaction success!");
        })
        .catch((err) => {
          console.error("Transaction failure:", err);
        });
    }
  }
  let transactionPromiseInvoice;
  let transactionPromisePrevInvoice;
  if (prevInvoiceId != invoiceId) {
    if (invoiceId && invoiceId != "N/A") {
      transactionPromiseInvoice = admin
        .firestore()
        .runTransaction((t) => {
          const invoiceDeailRef = admin
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("Invoices")
            .doc(invoiceId);
          return t.get(invoiceDeailRef).then((doc) => {
            let totalAmout = doc.data().collectedAmount + amountCollected;

            let newTotalAmout = totalAmout;
            if (typeof totalAmout == "number") {
              newTotalAmout = Number(totalAmout).toFixed(2);
            }
            t.update(invoiceDeailRef, {
              collectedAmount: Number(newTotalAmout),
            });
          });
        })
        .then((result) => {
          console.info("Transaction success!");
        })
        .catch((err) => {
          console.error("Transaction failure:", err);
        });
    }
    if (prevInvoiceId && prevInvoiceId != "N/A") {
      transactionPromisePrevOrg = admin
        .firestore()
        .runTransaction((t) => {
          const prevInvoiceDeailRef = admin
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("Invoices")
            .doc(prevInvoiceId);
          return t.get(prevInvoiceDeailRef).then((doc) => {
            let totalAmout = doc.data().collectedAmount - prevAmountCollected;

            let newTotalAmout = totalAmout;
            if (typeof totalAmout == "number") {
              newTotalAmout = Number(totalAmout).toFixed(2);
            }
            t.update(prevInvoiceDeailRef, {
              collectedAmount: Number(newTotalAmout),
            });
          });
        })
        .then((result) => {
          console.info("Transaction success!");
        })
        .catch((err) => {
          console.error("Transaction failure:", err);
        });
    }
  }
  if (prevInvoiceId == invoiceId && prevAmountCollected != amountCollected) {
    if (prevInvoiceId && prevInvoiceId != "N/A") {
      transactionPromisePrevOrg = admin
        .firestore()
        .runTransaction((t) => {
          const invoiceDeailRef = admin
            .firestore()
            .collection("users")
            .doc(userId)
            .collection("Invoices")
            .doc(invoiceId);
          return t.get(invoiceDeailRef).then((doc) => {
            let totalAmout = doc.data().collectedAmount + amountDifference;

            let newTotalAmout = totalAmout;
            if (typeof totalAmout == "number") {
              newTotalAmout = Number(totalAmout).toFixed(2);
            }
            t.update(invoiceDeailRef, {
              collectedAmount: Number(newTotalAmout),
            });
          });
        })
        .then((result) => {
          console.info("Transaction success!");
        })
        .catch((err) => {
          console.error("Transaction failure:", err);
        });
    }
  }

  return Promise.all([
    transactionPromiseSale,
    transactionPromisePrevSale,
    transactionPromiseCustomer,
    transactionPromisePrevCustomer,
    transactionPromiseOrg,
    transactionPromisePrevOrg,
    transactionPromiseInvoice,
    transactionPromisePrevInvoice,
  ]);
}

//for updating payment while edit payment receipt
exports.PaymentReceiptUpdateAmountOnUpdate = functions
  .region(region)
  .firestore.document("/users/{userId}/paymentsreceived/{documentId}")
  .onUpdate(async (change, context) => {
    var collectionDetails = change.after.data();
    var previousCollectionDetails = change.before.data();
    var superUserId = context.params.userId;
    let saleId = collectionDetails.saleid ? collectionDetails.saleid : null;
    let prevSaleId = previousCollectionDetails.saleid
      ? previousCollectionDetails.saleid
      : null;
    let customerId = collectionDetails.customerId
      ? collectionDetails.customerId
      : null;
    let prevCustomerId = previousCollectionDetails.customerId
      ? previousCollectionDetails.customerId
      : null;
    let orgId = collectionDetails.orgId ? collectionDetails.orgId : null;
    let prevOrgId = previousCollectionDetails.orgId
      ? previousCollectionDetails.orgId
      : null;
    let invoiceId = collectionDetails.invoiceno;
    let previousinvoiceId = previousCollectionDetails.invoiceno;
    difference =
      change.after.data().amountCollected -
      change.before.data().amountCollected;
    amountDifference = difference;
    amountUpdateonUpdatePayment(
      superUserId,
      saleId,
      prevSaleId,
      customerId,
      prevCustomerId,
      orgId,
      prevOrgId,
      invoiceId,
      previousinvoiceId,
      collectionDetails.amountCollected,
      previousCollectionDetails.amountCollected,
      amountDifference
    );
  });

// for creating followup via ivr
app.post("/", async (req, res) => {
  const requestBody = req.body;
  //check authorization by accountId
  const userDetails = await checkAuthorization(requestBody.AccountID,"ivrToken");
  // initialise followupData used for saving followup
  var followupData = {
    assignedTo: null,
    assignedToName: null,
    companyName: null,
    customerId: null,
    customerName: null,
    createdBy: "IVR",
    completedStatus: true,
    direction: "Inbound",
    sourceNumber: null,
    destinationNumber: null,
    displayNumber: null,
    callStartDate: null,
    callStartTime: null,
    callEndDate: null,
    callEndTime: null,
    callDuration: 0.0,
    status: null,
    dataSource: null,
    notes: null,
    outcome: null,
    tagOne: null,
    tagTwo: null,
    tagThree: null,
    tagFour: null,
    tagFive: null,
    callerName: null,
    callerCity: null,
    callerState: null,
    callerCountry: null,
    callerZipCode: null,
    resourceURL: null,
    eventID: null,
    callID: null,
    callConnected: false,
    orgId: null,
    associatedBranch: null,
    contactNumber:'',
    countryCode:''
  };
  // if user with this accountId is exist
  if (userDetails) {
    let receivedNumber;
    if (requestBody.DestinationNumber) {
      receivedNumber = requestBody.DestinationNumber;
      // for getting last 10 digits
      receivedNumber = receivedNumber.substring(receivedNumber.length - 10);
    }
    let incomingNumber;
    if (requestBody.SourceNumber) {
      incomingNumber = requestBody.SourceNumber;
      // for getting last 10 digits
      incomingNumber = incomingNumber.substring(incomingNumber.length - 10);
    }
   
    // if call type is equal to 0 create a followup
    if (requestBody.callType == "0") {
      bindFollowupDetailsFromIncomingCall(
        requestBody,
        receivedNumber,
        incomingNumber,
        followupData,
        userDetails,
        res
      );
    }
    // if call type is equal to 1 or 2 and there callID and not eventID(Ivr case...not autocall/call bridging)
    else if (
      requestBody.callID &&
      !requestBody.eventID &&
      (requestBody.callType == "1" || requestBody.callType == "2")
    ) {
      // get folloup which is having the callID
      const followupDetails = await getFollowUpId(
        userDetails.id,
        requestBody.callID,
        "callID"
      );
      upDateFollowupDetails(
        followupDetails,
        requestBody,
        followupData,
        incomingNumber,
        receivedNumber,
        userDetails,
        res
      );
    } else if (
      requestBody.callID &&
      requestBody.eventID &&
      requestBody.callType == "2"
    ) {
      // if call type is equal to 1 or 2 and there callID and  eventID(autocall case...)
      // get folloup which is having the eventID
      const followupDetails = await getFollowUpId(
        userDetails.id,
        requestBody.eventID,
        "eventID"
      );
      upDateFollowupDetails(
        followupDetails,
        requestBody,
        followupData,
        incomingNumber,
        receivedNumber,
        userDetails,
        res
      );
    }
  } else {
    //if user with this accountId is no exist send 401
    res.status(401).send({
      status: 401,
      message: "authorization has been refused for those credentials",
    });
  }
});
exports.followUpCreate = functions.https.onRequest(app);
//voxbay call integration
// create auto call
exports.voxBayAutoCall = functions.region(region).https.onRequest((req, res) => {
  if (path.includes(req.headers.origin)) {
    res.set("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    );
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    return cors(req, res, () => {
      const axios = require("axios").default;
      // set eventId using uuidv4 .eventId is used for finding the call
      const { v4: uuidv4 } = require("uuid");
      let eventId = uuidv4();
      const config = {
        method: "post",
        url:"",
        // url: `https://pbx.voxbaysolutions.com/api/clicktocall.php?uid=uhvxbywh6f&pin=solhnkjf8uo&source=${req.body.source}&destination=${req.body.destination}&ext=${req.body.ext}&callerid=${req.body.callerid}&param1=${eventId}`,
      };
      if(req.body.outBoundCallType === "extensionToMobile"){
        config.url = `http://pbx.voxbaysolutions.com/api/call.php?uid=${req.body.uidNumber}&pin=${req.body.pinNumber}&ext=${req.body.ext}&destination=${req.body.destination}&param1=${eventId}`
      }else if(req.body.outBoundCallType === "mobileToMobile"){
        config.url = `https://pbx.voxbaysolutions.com/api/clicktocall.php?uid=${req.body.uidNumber}&pin=${req.body.pinNumber}&source=${req.body.source}&destination=${req.body.destination}&ext=${req.body.ext}&callerid=${req.body.callerid}&param1=${eventId}`
      }
      console.log("CONFIG URL",config.url)
      axios(config)
        .then(function (response) {
          console.log("response" + response);
          res.status(200).send("");
        })
        .catch(function (error) {
          console.log("error" + error.response.data);
          res.status(404).send({
            status: 404,
            message: "Error Axios catch block",
          });
        });
      if (req.body.callId) {
        // // if call id is avalible in req.body get the followup and mark the followup as completed
        updateFollowupCompletedStatus(req.body.superUserId, req.body.callId, eventId)
      } else {
        // if call id is not avalible in req.body set start time as todays data
        var today = new Date();
        //spliting the the time for getting hours and minute
        let callStartTimeSplit;
        if (req.body.startTime) {
          callStartTimeSplit = req.body.startTime.split(":");
        }

        let callStartDate = dateWithDefaultTimeZone(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          Number(callStartTimeSplit ? callStartTimeSplit[0] : null),
          Number(callStartTimeSplit ? callStartTimeSplit[1] : null),
          0,
          0
        );
        // set the followupData with available fields for creating followup
        var followupData = {
          eventID: eventId,
          assignedTo: req.body.userId,
          assignedToName: req.body.userName,
          companyName: req.body.companyName,
          customerId: req.body.customerId,
          orgId: req.body.orgId,
          associatedBranch: req.body.associatedBranch,
          customerName: req.body.customerName,
          createdBy: req.body.userId,
          completedStatus: true,
          dateCreated: Date.now(),
          direction: "Outbound",
          sourceNumber: req.body.source,
          destinationNumber: req.body.destination,
          displayNumber: null,
          callStartDate: callStartDate,
          callStartTime: req.body.startTime,
          callEndDate: null,
          callEndTime: null,
          callDuration: 0.0,
          status: null,
          dataSource: null,
          notes: null,
          outcome: null,
          tagOne: null,
          tagTwo: null,
          tagThree: null,
          tagFour: null,
          tagFive: null,
          recordingLink: null,
          callerName: null,
          callerCity: null,
          callerState: null,
          callerCountry: null,
          callerZipCode: null,
          resourceURL: null,
          callConnected: false,
          assignedToDate: new Date().getTime(),
          contactNumber:req.body.destination,
          countryCode:"+91",
          saleTitle: req.body.saleTitle ? req.body.saleTitle: null,
          saleId: req.body.saleId ? req.body.saleId : null,
          serviceId: req.body.serviceId ? req.body.serviceId : null,
          serviceTitle: req.body.serviceTitle ? req.body.serviceTitle : null,
        };
        // create followup
        createFollowupInAutoCall(followupData, req.body.superUserId);
      }

    });
  }
});
async function createFollowupDetailsVoxbay(
  followupDetails,
  requestBody,
  followupData,
  incomingNumber,
  receivedNumber,
  userDetails,
  res
) {

  temp = incomingNumber;
  incomingNumber = receivedNumber;
  receivedNumber = temp;
  if (followupDetails) {
    followupData.contactNumber =  followupDetails.data().contactNumber ? followupDetails.data().contactNumber :'';
    followupData.countryCode = followupDetails.data().countryCode ? followupDetails.data().countryCode :'';
    // if followup details is there set followup id to followupId
    const followupId = followupDetails.id;
    followupData.notes = followupDetails.data().notes ? followupDetails.data().notes: null;
    followupData.outcome = followupDetails.data().outcome ? followupDetails.data().outcome:null;
    followupData.orgId = followupDetails.data().orgId ? followupDetails.data().orgId :null;
    followupData.companyName = followupDetails.data().companyName ? followupDetails.data().companyName:null;

    let subUserData;
    let callerLastAssign = 0;
    let customerData;
    let lastAssignedChanged = false;
    if (incomingNumber != null && incomingNumber != "None") {
      customerData = await getCustomerWithPhoneNumber(
        userDetails.id,
        incomingNumber
      );
      if (!customerData) {
        customerData = await getCustomerWithAltPhoneNumber(
          userDetails.id,
          incomingNumber
        );
      }
    }
    if (receivedNumber != null && receivedNumber != "None") {
      // if recevied number is there get user which is having the phone number as receivedNumber
      if (userDetails.data().phone == receivedNumber) {
        subUserData = userDetails;
      } else {
        let subList = await getSubUserDetails(userDetails.id, receivedNumber);//extension.slice(-3)
        subList.forEach((element) => {
          subUserData = element;
        })
      }
      // if call recieved user details is there set assignedTo and assignedToName
      if (subUserData) {
        if (userDetails.data().phone == receivedNumber) {
          followupData.associatedBranch = subUserData.data().associatedBranch ? subUserData.data().associatedBranch : 'none';
          followupData.assignedTo = subUserData.id;
        } else {
          followupData.associatedBranch = subUserData.data().branchId ? subUserData.data().branchId : 'none';
          followupData.assignedTo = subUserData.data().userId;
        }
        let name;
        if (subUserData.data().lastname) {
          name =
            subUserData.data().firstname + " " + subUserData.data().lastname;
        } else {
          name = subUserData.data().firstname;
        }
        followupData.assignedToName = name;
      } else {
        // if call recieved user details is not there set assignedTo and assignedToName as 'none'
        followupData.assignedTo = "none";
        followupData.assignedToName = "none";
        followupData.associatedBranch = "none";
      }
    } else {
      followupData.completedStatus = false;
      if (customerData.data().assignedTo == "none") {
        // if there is no receivedNumber the get callerList from userdetails
        if (userDetails.data().callerList.length > 0) {
          let oldIndex = userDetails.data().callerLastAssign;
          let assignObj = await assignToSubUserIvr(userDetails.data().callerList, userDetails.data().callerLastAssign, userDetails.id, userDetails, lastAssignedChanged, oldIndex)
          //get values from object returned by the function

          callerLastAssign = (await assignObj).byUserCallerIndex;
          lastAssignedChanged = (await assignObj).lastAssignedChanged;
          subUserData = (await assignObj).subUserDetails;
          // if call recieved user details is there set assignedTo and assignedToName
          if (subUserData) {
            followupData.associatedBranch = (await assignObj).associatedBranch ? (await assignObj).associatedBranch : 'none';
            followupData.assignedTo = (await assignObj).assignedTo;
            followupData.assignedToName = (await assignObj).assignedToName;
          } else {
            // if call recieved user details is not there set assignedTo and assignedToName as 'none'
            followupData.assignedTo = "none";
            followupData.assignedToName = "none";
            followupData.associatedBranch = "none";
          }
        } else {
          // if call list is not there send 404
          res.status(404).send({
            status: 404,
            message: "caller list is not available",
          });
        }
      }
    }
    if (subUserData) {
      // if subUserData is there then bind followup details to followupData used for updating followup
      let userPhone = ''
      if (userDetails.data().superUserId == subUserData.id) {

        userPhone = subUserData.data().phone
      } else {
        userPhone = subUserData.data().contactNo;
      }
      // console.log("fetchFollowupDataVoxbay 1")
      // if subUserData is there then bind followup details to followupData used for updating followup
      followupData = fetchFollowupDataVoxbay(
        followupData,
        userPhone,
        requestBody,
        incomingNumber,
        receivedNumber,
        followupDetails.incomingNumber
      );
      // console.log("FOLLOWUPDATA",followupData)
    } else {
      let phone = "";
      if (customerData) {
        phone = customerData.data().contactNo
          ? customerData.data().contactNo
          : "";
      }

      // if subUserData is not there then bind followup details to followupData used for updating followup
      followupData = fetchFollowupDataVoxbay(
        followupData,
        phone,
        requestBody,
        incomingNumber,
        receivedNumber,
        followupDetails.incomingNumber
      );
    }
    // get customer data with incomingNumber

    // if customer data is there set customerName,companyName and customerId
    if (customerData) {
      let custName;
      if (customerData.data().secondName && customerData.data().surname) {
        custName =
          customerData.data().firstName +
          " " +
          customerData.data().secondName +
          " " +
          customerData.data().surname;
      } else if (
        customerData.data().secondName &&
        !customerData.data().surname
      ) {
        custName =
          customerData.data().firstName + " " + customerData.data().secondName;
      } else if (
        !customerData.data().secondName &&
        customerData.data().surname
      ) {
        custName =
          customerData.data().firstName + " " + customerData.data().surname;
      } else {
        custName = customerData.data().firstName;
      }

      followupData.customerName = custName;
      //companyName
      if (followupDetails.data().companyName) {
        followupData.companyName = followupDetails.data().companyName ? followupDetails.data().companyName :null;
      } else {
        followupData.companyName = customerData.data().companyName ? customerData.data().companyName :null;
      }
      //organisationId
      if (followupDetails.data().orgId) {
        followupData.orgId = followupDetails.data().orgId ? followupDetails.data().orgId :null;
      } else {
        followupData.orgId = customerData.data().orgId
          ? customerData.data().orgId
          : "";
      }
      followupData.customerId = customerData.id;


      if (!subUserData) {
        followupData.assignedTo = customerData.data().assignedTo
          ? customerData.data().assignedTo
          : "none";
        followupData.assignedToName = customerData.data().assignedToName
          ? customerData.data().assignedToName
          : "none";
        followupData.associatedBranch = customerData.data().associatedBranch
          ? customerData.data().associatedBranch
          : "none";
      }
    } else {
      if (
        (followupDetails.data().customerId && incomingNumber == null) ||
        (followupDetails.data().customerId && incomingNumber == "None")
      ) {
        followupData.customerName = followupDetails.data().customerName;
        followupData.companyName = followupDetails.data().companyName;
        followupData.customerId = followupDetails.data().customerId;
      } else {
        // if customer data and customer is not taggd in followup set customerName,companyName and customerId as "N/A"
        followupData.customerName = "N/A";
        followupData.companyName = "N/A";
        followupData.customerId = "N/A";
      }
      if (
        (followupDetails.data().orgId && incomingNumber == null) ||
        (followupDetails.data().orgId && incomingNumber == "None")
      ) {
        followupData.orgId = followupDetails.data().orgId;
      } else {
        followupData.orgId = "N/A";
      }
    }
    if (customerData) {
      if (
        customerData.data().assignedTo == "none" &&
        followupData.assignedTo != "none"
      ) {
        return await admin
          .firestore()
          .doc("users/" + userDetails.id + "/customers/" + customerData.id)
          .update({
            assignedTo: followupData.assignedTo,
            assignedToName: followupData.assignedToName,
            associatedBranch: followupData.associatedBranch,
          })
          .then((data) => {
            //a nswered
            // if (requestBody.status == "ANSWERED") {
            //   return admin
            //     .firestore()
            //     .doc("users/" + userDetails.id + "/Follow Ups/" + followupId)
            //     .update({
            //       ...followupData,
            //     })
            //     .then((data) => {
            //       res.send({
            //         status: 200,
            //         message: "success",
            //       });
            //     });
            // } else {
              return admin
                .firestore()
                .doc("users/" + userDetails.id + "/Follow Ups/" + followupId)
                .update({
                  ...followupData, lastModifiedDate: new Date().getTime()
                })
                .then((data) => {
                  console.log("FOLLOW UP UPDATED SUCCESS")
                  res.send({
                    status: 200,
                    message: "success",
                  });
                });
            // }
          });
      } else {
        // if (requestBody.status == "ANSWERED") {
        //   return admin
        //     .firestore()
        //     .doc("users/" + userDetails.id + "/Follow Ups/" + followupId)
        //     .update({
        //       ...followupData,
        //     })
        //     .then((data) => {
        //       console.log("receivedNumber" + receivedNumber + callerLastAssign);
        //       res.send({
        //         status: 200,
        //         message: "success",
        //       });
        //     });
        // } else {
          return admin
            .firestore()
            .doc("users/" + userDetails.id + "/Follow Ups/" + followupId)
            .update({
              ...followupData, lastModifiedDate: new Date().getTime()
            })
            .then((data) => {
              console.log("FOLLOW UP UPDATED SUCCESS2")
              res.send({
                status: 200,
                message: "success",
              });
            });
        // }
      }
    } else {
      // if (requestBody.status == "ANSWERED") {
      //   return admin
      //     .firestore()
      //     .doc("users/" + userDetails.id + "/Follow Ups/" + followupId)
      //     .update({
      //       ...followupData,
      //     })
      //     .then((data) => {
      //       res.send({
      //         status: 200,
      //         message: "success",
      //       });
      //     });
      // } else {
        return admin
          .firestore()
          .doc("users/" + userDetails.id + "/Follow Ups/" + followupId)
          .update({
            ...followupData, lastModifiedDate: new Date().getTime()
          })
          .then((data) => {
            console.log("FOLLOW UP UPDATED SUCCESS3")
            res.send({
              status: 200,
              message: "success",
            });
          });
      // }
    }
  } else {
    // if there is no followupDetails
    if (incomingNumber && requestBody.date) {
      //if there is incomingNumber
      let subUserData;
      let callerLastAssign = 0;
      let customerData;
      customerData = await getCustomerWithPhoneNumber(
        userDetails.id,
        incomingNumber
      );
      if (!customerData) {
        customerData = await getCustomerWithAltPhoneNumber(
          userDetails.id,
          incomingNumber
        );
      }
      if (receivedNumber != null && receivedNumber != "None") {
        if (userDetails.data().phone == receivedNumber) {

          subUserData = userDetails;
        } else {
          let subList = await getSubUserDetails(userDetails.id, receivedNumber);
          subList.forEach((element) => {
            subUserData = element;
          })
        }
        // if call recieved user details is there set assignedTo and assignedToName
        if (subUserData) {
          if (userDetails.data().phone == receivedNumber) {
            followupData.associatedBranch = subUserData.data().associatedBranch ? subUserData.data().associatedBranch : 'none';
            followupData.assignedTo = subUserData.id;
          } else {
            followupData.associatedBranch = subUserData.data().branchId ? subUserData.data().branchId : 'none';
            followupData.assignedTo = subUserData.data().userId;

          }
          let name;
          if (subUserData.data().lastname) {
            name =
              subUserData.data().firstname + " " + subUserData.data().lastname;
          } else {
            name = subUserData.data().firstname;
          }
          followupData.assignedToName = name;
        } else {
          // if call recieved user details is not there set assignedTo and assignedToName as 'none'
          followupData.assignedTo = "none";
          followupData.assignedToName = "none";
          followupData.associatedBranch = "none";
        }
      } else {
        followupData.completedStatus = false;
        if (!customerData) {
          if (userDetails.data().callerList.length > 0) {
            let oldIndex = userDetails.data().callerLastAssign;
            let assignObj = await assignToSubUserIvr(userDetails.data().callerList, userDetails.data().callerLastAssign, userDetails.id, userDetails, lastAssignedChanged, oldIndex)
            //get values from object returned by the function

            callerLastAssign = (await assignObj).byUserCallerIndex;
            lastAssignedChanged = (await assignObj).lastAssignedChanged;
            subUserData = (await assignObj).subUserDetails;
            // if call recieved user details is there set assignedTo and assignedToName
            if (subUserData) {
              followupData.associatedBranch = (await assignObj).associatedBranch ? (await assignObj).associatedBranch : 'none';
              followupData.assignedTo = (await assignObj).assignedTo;
              followupData.assignedToName = (await assignObj).assignedToName;
            } else {
              // if call recieved user details is not there set assignedTo and assignedToName as 'none'
              followupData.assignedTo = "none";
              followupData.assignedToName = "none";
              followupData.associatedBranch = "none";
            }
          } else {
            // if call list is not there send 404
            res.status(404).send({
              status: 404,
              message: "caller list is not available",
            });
          }
        }
      }
      if (subUserData) {
        // if subUserData is there then bind followup details to followupData used for updating followup
        let userPhone = ''
        if (userDetails.data().superUserId == subUserData.id) {

          userPhone = subUserData.data().phone
        } else {
          userPhone = subUserData.data().contactNo;
        }
        console.log("fetchFollowupDataVoxbay 3")

        followupData = fetchFollowupDataVoxbay(
          followupData,
          userPhone,
          requestBody,
          incomingNumber,
          receivedNumber,
          null
        );
        // console.log("FOLLOWUPDATA",followupData)
      } else {
        let phone = "";
        if (customerData) {
          phone = customerData.data().contactNo
            ? customerData.data().contactNo
            : "";
        }
        console.log("fetchFollowupDataVoxbay 4")


        followupData = fetchFollowupDataVoxbay(
          followupData,
          phone,
          requestBody,
          incomingNumber,
          receivedNumber,
          null
        );
      }
      if (customerData) {
        let custName;
        if (customerData.data().secondName && customerData.data().surname) {
          custName =
            customerData.data().firstName +
            " " +
            customerData.data().secondName +
            " " +
            customerData.data().surname;
        } else if (
          customerData.data().secondName &&
          !customerData.data().surname
        ) {
          custName =
            customerData.data().firstName +
            " " +
            customerData.data().secondName;
        } else if (
          !customerData.data().secondName &&
          customerData.data().surname
        ) {
          custName =
            customerData.data().firstName + " " + customerData.data().surname;
        } else {
          custName = customerData.data().firstName;
        }
        followupData.customerName = custName;
        followupData.companyName = customerData.data().companyName;
        followupData.customerId = customerData.id;
        followupData.orgId = customerData.data().orgId
          ? customerData.data().orgId
          : "";

        if (!subUserData) {
          followupData.assignedTo = customerData.data().assignedTo
            ? customerData.data().assignedTo
            : "none";
          followupData.assignedToName = customerData.data().assignedToName
            ? customerData.data().assignedToName
            : "none";
          followupData.associatedBranch = customerData.data().associatedBranch
            ? customerData.data().associatedBranch
            : "none";
        }
      } else {
        followupData.customerName = "N/A";
        followupData.companyName = "N/A";
        followupData.customerId = "N/A";
        followupData.orgId = "N/A";
      }
      if (customerData) {
        if (
          customerData.data().assignedTo == "none" &&
          followupData.assignedTo != "none"
        ) {
          return await admin
            .firestore()
            .doc("users/" + userDetails.id + "/customers/" + customerData.id)
            .update({
              assignedTo: followupData.assignedTo,
              assignedToName: followupData.assignedToName,
              associatedBranch: followupData.associatedBranch,
            })
            .then((data) => {
              return admin
                .firestore()
                .collection("users/" + userDetails.id + "/Follow Ups")
                .add({ ...followupData, dateCreated: Date.now(), lastModifiedDate: new Date().getTime() })
                .then(async (data) => {
                  console.log("FOLLOWUP Created 1")
                  res.send({
                    status: 200,
                    message: "success",
                  });
                });
            });
        } else {
          return admin
            .firestore()
            .collection("users/" + userDetails.id + "/Follow Ups")
            .add({ ...followupData, dateCreated: Date.now(), lastModifiedDate: new Date().getTime() })
            .then(async (data) => {
              console.log("FOLLOWUP Created 2")
              res.send({
                status: 200,
                message: "success",
              });
              // if (
              //   requestBody.callUUID &&
              //   // !requestBody.param1 &&
              //   requestBody.status != "ANSWERED" && //need to check
              //   followupData.callDuration == 0 &&
              //   followupData.assignedTo != "none"
              // ) {
              //   console.log("entered missed call ");
              //   return await admin
              //     .firestore()
              //     .collection(
              //       "users/" + followupData.assignedTo + "/Notifications"
              //     )
              //     .add({
              //       message: "You have a missed call from " + incomingNumber,
              //       createdDate: Date.now(),
              //       viewStatus: false,
              //       docId: data.id,
              //       type: "FollowUp",
              //     })
              //     .then((responsenotification) => {
              //       // console.log("responsenotification_userDetails.id",userDetails.id)
              //       if (receivedNumber == null || receivedNumber == "None") {
              //         return admin
              //           .firestore()
              //           .doc("users/" + userDetails.id)
              //           .update({
              //             callerLastAssign: callerLastAssign,
              //           })
              //           .then((datas) => {
              //             res.send({
              //               status: 200,
              //               message: "success",
              //             });
              //           });
              //       } else {
              //         res.send({
              //           status: 200,
              //           message: "success",
              //         });
              //       }
              //     })
              //     .catch((e) => {
              //       console.log(e.message);
              //     });
              // } else {
              //   if (receivedNumber == null || receivedNumber == "None") {
              //     return admin
              //       .firestore()
              //       .doc("users/" + userDetails.id)
              //       .update({
              //         callerLastAssign: callerLastAssign,
              //       })
              //       .then((datas) => {
              //         res.send({
              //           status: 200,
              //           message: "success",
              //         });
              //       });
              //   } else {
              //     res.send({
              //       status: 200,
              //       message: "success",
              //     });
              //   }
              // }
            });
        }
      } else {
        return admin
          .firestore()
          .collection("users/" + userDetails.id + "/Follow Ups")
          .add({ ...followupData, dateCreated: Date.now(), lastModifiedDate: new Date().getTime() })
          .then(async (data) => {
            console.log("FOLLOWUP Created 2")
            res.send({
              status: 200,
              message: "success",
            });
          });
      }
    } else {
      res.status(404).send({
        status: 404,
        message: "no data available",
      });
    }
  }
}
async function bindFollowupDetailsFromIncomingCallVoxBay(
  requestBody,
  receivedNumber,
  incomingNumber,
  followupData,
  userDetails,
  res
) {
  // console.log("INCOMING NUMBER ",incomingNumber)
  // console.log("destinationNumber NUMBER ",receivedNumber)
  // console.log("CallUUID ",requestBody.CallUUID)
  if (incomingNumber) {
    followupData.sourceNumber = incomingNumber; // set incoming number as sourceNumber
  }
  if (receivedNumber) {
    followupData.destinationNumber = receivedNumber; // set received number as destinationNumber
  }
  if (requestBody.callerNumber) {//set agent Number as display Number
    followupData.displayNumber = requestBody.callerNumber;
  }
  // if start time is none the set callStartDate as todays date
  if (requestBody.callStartTime == null || requestBody.callStartTime == "None") {
    var today = new Date();
    let todayInv = dateWithDefaultTimeZone(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0,
      0,
      0,
      0
    );
    followupData.callStartDate = todayInv;
  } else {
    // set call time and date
    let start = dateWithDefaultTimeZoneFromString(requestBody.callStartTime);
    let startDate = new Date(start);
    let callStartDate = dateWithDefaultTimeZone(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      Number(requestBody.callStartTime.split(" ")[1].split(":")[0]),
      Number(requestBody.callStartTime.split(" ")[1].split(":")[1]),
      0,
      0
    );
    followupData.callStartDate = callStartDate;
    followupData.callStartTime = `${requestBody.callStartTime.split(" ")[1].split(":")[0]
      }:${requestBody.callStartTime.split(" ")[1].split(":")[1]}`;
  }
  followupData.dataSource = "Voxbay";
  if (requestBody.CallUUID) {
    followupData.callID = requestBody.CallUUID;
  }
   // if call recieved user details is there set assignedTo and assignedToName
  let subUserData;
  if (receivedNumber) {
    if (userDetails.data().phone == receivedNumber) {
      subUserData = userDetails;
    } else {
      let subList = await getSubUserDetails(userDetails.id, receivedNumber);
      subList.forEach((element) => {
        subUserData = element;
      })
    }
    if (subUserData) {
      if (userDetails.data().phone == receivedNumber) {
        followupData.associatedBranch = subUserData.data().associatedBranch ? subUserData.data().associatedBranch : 'none';
        followupData.assignedTo = subUserData.id;
      } else {
        followupData.associatedBranch = subUserData.data().branchId ? subUserData.data().branchId : 'none';
        followupData.assignedTo = subUserData.data().userId;
      }
      let name;
      if (subUserData.data().lastname) {
        name =
          subUserData.data().firstname + " " + subUserData.data().lastname;
      } else {
        name = subUserData.data().firstname;
      }
      followupData.assignedToName = name;
    } else {
      // if call recieved user details is not there set assignedTo and assignedToName as 'none'
      followupData.assignedTo = "none";
      followupData.assignedToName = "none";
      followupData.associatedBranch = "none";
    }
  }
  // here there is no user picked the call
  followupData.completedStatus = false;
  let customerData;
  customerData = await getCustomerWithPhoneNumber(
    userDetails.id,
    incomingNumber
  );
  if (!customerData) {
    customerData = await getCustomerWithAltPhoneNumber(
      userDetails.id,
      incomingNumber
    );
    if(customerData){
      followupData.contactNumber = customerData.data().contactNo
      ? customerData.data().contactNo
      : '';
    followupData.countryCode = customerData.data().code
      ? customerData.data().code
      : '';
    }
  }else{
    followupData.contactNumber = customerData.data().contactNo
    ? customerData.data().contactNo
    : '';
  followupData.countryCode = customerData.data().code
    ? customerData.data().code
    : '';
  }
  if (customerData) {
    // if customer data is there set customerName,companyName and customerId
    let custName;
    if (customerData.data().secondName && customerData.data().surname) {
      custName =
        customerData.data().firstName +
        " " +
        customerData.data().secondName +
        " " +
        customerData.data().surname;
    } else if (customerData.data().secondName && !customerData.data().surname) {
      custName =
        customerData.data().firstName + " " + customerData.data().secondName;
    } else if (!customerData.data().secondName && customerData.data().surname) {
      custName =
        customerData.data().firstName + " " + customerData.data().surname;
    } else {
      custName = customerData.data().firstName;
    }
    followupData.customerName = custName;
    followupData.companyName = customerData.data().companyName;
    followupData.customerId = customerData.id;
    followupData.orgId = customerData.data().orgId
      ? customerData.data().orgId
      : "";
    followupData.associatedBranch = customerData.data().associatedBranch
      ? customerData.data().associatedBranch
      : "none";
    followupData.assignedTo = customerData.data().assignedTo
      ? customerData.data().assignedTo
      : "none";
    followupData.assignedToName = customerData.data().assignedToName
      ? customerData.data().assignedToName
      : "none";

    // save followup and the send success message
    createFollowupInIncomingCall(userDetails.id,followupData,res)
  } else {
    // if customer data is not there set customerName,companyName and customerId as "N/A"
    followupData.customerName = followupData.customerName?followupData.customerName: "inb_call_lead";
    followupData.companyName =  followupData.companyName? followupData.companyName:"N/A";
    followupData.orgId = followupData.orgId?followupData.orgId:null;
    followupData.associatedBranch = followupData.associatedBranch?followupData.associatedBranch:"none";
    followupData.assignedTo = followupData.assignedTo?followupData.assignedTo: "none";
    followupData.assignedToName =  followupData.assignedToName? followupData.assignedToName:"none";
    followupData.contactNumber = incomingNumber;
    followupData.countryCode = '+91';
    await createInb_Call_LeadVoxbay(
      incomingNumber,
      receivedNumber,
      userDetails.id,
      followupData,
      userDetails,
      res,
      requestBody
    );
  }

}
//for creating followUp voxbay(when a call is picked by an agent)
exports.voxBayIncomingFollowUpCallReceived = functions.region(region).https.onRequest((req, res) => {
  if (path.includes(req.headers.origin)) {
    res.set("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    );
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    return cors(req, res, () => {
      voxbayIncomingFollowUpCallAnswered(req,res);
    });
  }
});
//for creating followUp voxbay after call is completed(event4)
exports.voxBayIncomingFollowUp = functions.region(region).https.onRequest((req, res) => {
  if (path.includes(req.headers.origin)) {
    res.set("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    );
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    return cors(req, res, () => {
      voxbayIncomingFollowUpCreate(req,res);
    });
  }
});
//Updation when a call is completed(event4)
async function voxbayIncomingFollowUpCreate(req,res){
  const requestBody = req.body;
  // console.log("Entered  in voxbayIncomingFollowUpCreate")
  // console.log("REQUEST BODY",requestBody)
  //check authorization by accountId
  const userDetails = await checkAuthorization(req.body.UID, "voxbayUid");
  // initialise followupData used for saving followup
  var followupData = {
    assignedTo: null,
    assignedToName: null,
    companyName: null,
    customerId: null,
    customerName: null,
    createdBy: "IVR",
    completedStatus: true,
    direction: "Inbound",
    sourceNumber: null,
    destinationNumber: null,
    displayNumber: null,
    callStartDate: null,
    callStartTime: null,
    callEndDate: null,
    callEndTime: null,
    callDuration: 0.0,
    status: null,
    dataSource: null,
    notes: null,
    outcome: null,
    tagOne: null,
    tagTwo: null,
    tagThree: null,
    tagFour: null,
    tagFive: null,
    callerName: null,
    callerCity: null,
    callerState: null,
    callerCountry: null,
    callerZipCode: null,
    resourceURL: null,
    eventID: null,
    callID: null,
    callConnected: false,
    orgId: null,
    associatedBranch: null,
  };
  // if user with this accountId is exist
  if (userDetails) {
    let receivedNumber;
    let subUserData;
    if (requestBody.AgentNumber && requestBody.AgentNumber.includes("*")) {
      //extension
      let extensionNumber = requestBody.AgentNumber.slice(-3)
      if (userDetails.data().extensionNumber === extensionNumber) {//if super user
        receivedNumber = userDetails.data().phone;
      } else {
        let subList = await getSubUserDetailsWithExtension(userDetails.id, extensionNumber);
        subList.forEach((element) => {
          subUserData = element;
        })
        receivedNumber = subUserData.data().contactNo;
      }
    }
    else if (requestBody.AgentNumber) {
      receivedNumber = requestBody.AgentNumber;
      // for getting last 10 digits
      receivedNumber = receivedNumber.substring(receivedNumber.length - 10);
    }
    let incomingNumber;
    if (requestBody.callerNumber) {
      incomingNumber = requestBody.callerNumber;
      // for getting last 10 digits
      incomingNumber = incomingNumber.substring(incomingNumber.length - 10);
    }
    //call completed
    if (
      requestBody.CallUUID 
    ) {
      // get folloup which is having the callID
      const followupDetails = await getFollowUpId(
        userDetails.id,
        requestBody.CallUUID,
        "callID"
      );
      upDateFollowupDetailsVoxbay(
        followupDetails,
        requestBody,
        followupData,
        incomingNumber,
        receivedNumber,
        userDetails,
        res
      );
    }

  } else {
    //if user with this accountId is no exist send 401
    res.status(401).send({
      status: 401,
      message: "authorization has been refused for those credentials",
    });
  }
}
//Lead generation when call picked by agent(event2)
async function voxbayIncomingFollowUpCallAnswered(req,res){
  const requestBody = req.body;
  // console.log("Entered In voxbayIncomingFollowUpCallAnswered FUnction")
  // console.log("REQUEST BODY",requestBody)
  //check authorization by accountId
  const userDetails = await checkAuthorization(req.body.UID, "voxbayUid");
  // initialise followupData used for saving followup
  var followupData = {
    assignedTo: null,
    assignedToName: null,
    companyName: null,
    customerId: null,
    customerName: null,
    createdBy: "IVR",
    completedStatus: true,
    direction: "Inbound",
    sourceNumber: null,
    destinationNumber: null,
    displayNumber: null,
    callStartDate: null,
    callStartTime: null,
    callEndDate: null,
    callEndTime: null,
    callDuration: 0.0,
    status: null,
    dataSource: null,
    notes: null,
    outcome: null,
    tagOne: null,
    tagTwo: null,
    tagThree: null,
    tagFour: null,
    tagFive: null,
    callerName: null,
    callerCity: null,
    callerState: null,
    callerCountry: null,
    callerZipCode: null,
    resourceURL: null,
    eventID: null,
    callID: null,
    callConnected: false,
    orgId: null,
    associatedBranch: null,
  };
  // if user with this accountId is exist
  if (userDetails) {
    let receivedNumber;
    let subUserData;
    if (requestBody.AgentNumber && requestBody.AgentNumber.includes("*")) {
      //extension
      let extensionNumber = requestBody.AgentNumber.slice(-3)
      if (userDetails.data().extensionNumber === extensionNumber) {//if super user
        receivedNumber = userDetails.data().phone;
      } else {
        let subList = await getSubUserDetailsWithExtension(userDetails.id, extensionNumber);
        subList.forEach((element) => {
          subUserData = element;
        })
        receivedNumber = subUserData.data().contactNo;
      }
    }
    else if (requestBody.AgentNumber) {
      receivedNumber = requestBody.AgentNumber;
      // for getting last 10 digits
      receivedNumber = receivedNumber.substring(receivedNumber.length - 10);
    }
    let incomingNumber;
    if (requestBody.callerNumber) {
      incomingNumber = requestBody.callerNumber;
      // for getting last 10 digits
      incomingNumber = incomingNumber.substring(incomingNumber.length - 10);
    }
      //call picked by agent
    if (requestBody.CallUUID) {
      // console.log("Entered In event 2 of voxbayIncomingFollowUpCallAnswered")
      bindFollowupDetailsFromIncomingCallVoxBay(
        requestBody,
        receivedNumber,
        incomingNumber,
        followupData,
        userDetails,
        res
      )
    }
  } else {
    //if user with this accountId is no exist send 401
    res.status(401).send({
      status: 401,
      message: "authorization has been refused for those credentials",
    });
  }
}
//for creating followUp voxbay
exports.voxBayFollowUp = functions.region(region).https.onRequest((req, res) => {
  if (path.includes(req.headers.origin)) {
    res.set("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    );
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    return cors(req, res, () => {
      voxbayFollowUpCreate(req,res);
    });
  }
});
async function voxbayFollowUpCreate(req, res) {
  //console log of reqBody
  for (const [key, value] of Object.entries(req.body)) {
    console.log(`${key}: ${value}`);
  }
  const requestBody = req.body;
  //check authorization by accountId
  const userDetails = await checkAuthorization(requestBody.UID, "voxbayUid");
  // initialise followupData used for saving followup
  var followupData = {
    assignedTo: null,
    assignedToName: null,
    companyName: null,
    customerId: null,
    customerName: null,
    createdBy: "IVR",
    completedStatus: true,
    direction: "Inbound",
    sourceNumber: null,
    destinationNumber: null,
    displayNumber: null,
    callStartDate: null,
    callStartTime: null,
    callEndDate: null,
    callEndTime: null,
    callDuration: 0.0,
    status: null,
    dataSource: null,
    notes: null,
    outcome: null,
    tagOne: null,
    tagTwo: null,
    tagThree: null,
    tagFour: null,
    tagFive: null,
    callerName: null,
    callerCity: null,
    callerState: null,
    callerCountry: null,
    callerZipCode: null,
    resourceURL: null,
    eventID: null,
    callID: null,
    callConnected: false,
    orgId: null,
    associatedBranch: null,
    contactNumber:'',
    countryCode:''
  };
  if (userDetails) {
    let receivedNumber;
    console.log("Entered in user detail")
    if (requestBody.destination) {
      receivedNumber = requestBody.destination;
      // for getting last 10 digits
      receivedNumber = receivedNumber.substring(receivedNumber.length - 10);
    }
    let incomingNumber;
    let subUserData;
    if (requestBody.source) {
      console.log("Entered Source Num Part ")
      incomingNumber = requestBody.source;
      // for getting last 10 digits
      incomingNumber = incomingNumber.substring(incomingNumber.length - 10);
    }
    else {//extension to mobile
      let userExtension = requestBody.extension.slice(-3)
      console.log("EXTENSION",userExtension)
      if (userDetails.data().extensionNumber === userExtension) {//if super user
        incomingNumber = userDetails.data().phone;
      } else {
        let subList = await getSubUserDetailsWithExtension(userDetails.id, userExtension);
        subList.forEach((element) => {
          subUserData = element;
        })
        incomingNumber = subUserData.data().contactNo;
      }
    }
    console.log("INCOMING NUM",incomingNumber)
    if (requestBody.callerid && requestBody.param1) {
      console.log("PARAM 1 VALUE",requestBody.param1)
      // get folloup which is having the callID
      const followupDetails = await getFollowUpId(
        userDetails.id,
        requestBody.param1,
        "eventID"
      );

      createFollowupDetailsVoxbay(
        followupDetails,
        requestBody,
        followupData,
        incomingNumber,
        receivedNumber,
        userDetails,
        res
      );
    } else {
      res.status(400).send({
        status: 400,
        message: "param1 value not received",
      });
    }
  }
  else {
    //if user with this accountId is no exist send 401
    res.status(401).send({
      status: 401,
      message: "authorization has been refused for those credentials",
    });
  }
}
function fetchFollowupDataVoxbay(
  followupData,
  subUserNumber,
  requestBody,
  incomingNumber,
  receivedNumber,
  incNUmber
) {
  // console.log("fetchFollowupDataVoxbay")
  // bind all details from requestBody
  if (requestBody.param1) {
    // in case of autocall scenario set receivedNumber as sourceNumber and incomingNumber as destinationNumber
    if (receivedNumber) {
      followupData.sourceNumber = receivedNumber;
    }
    //if eventID present set to Outbound
    followupData.direction = "Outbound";
    if (incomingNumber != null && incomingNumber != "None") {
      followupData.destinationNumber = incomingNumber;
    } else {
      followupData.completedStatus = false;
      followupData.destinationNumber = incNUmber;
    }
  } else {
    // in case of ivr scenario set incomingNumber as sourceNumber and receivedNumber as destinationNumber
    if (incomingNumber) {
      followupData.sourceNumber = incomingNumber;
    }
    //if eventID present set to inboud
    followupData.direction = "Inbound";
    if (receivedNumber != null && receivedNumber != "None") {
      followupData.destinationNumber = receivedNumber;
    } else {
      followupData.destinationNumber = subUserNumber;
      followupData.completedStatus = false;
    }
  }
  if (requestBody.callerid && requestBody.param1) {//outgoing
    followupData.displayNumber = requestBody.callerid;
  } else {//incoming
    followupData.displayNumber = requestBody.calledNumber;
  }
  if (requestBody.duration && requestBody.param1) {//outgoing
    followupData.callDuration = Number(requestBody.duration);
  } else {//incoming
    followupData.callDuration = Number(requestBody.totalCallDuration);
  }
  if (followupData.callDuration == 0) {
    followupData.callConnected = false;
  } else if (followupData.callDuration > 0) {
    followupData.callConnected = true;
  }
  if (requestBody.DataSource) {
    followupData.dataSource = requestBody.DataSource;
  } else {
    followupData.dataSource = "Voxbay";
  }
  if (requestBody.recording_URL) {
    followupData.resourceURL = requestBody.recording_URL;
  }
  if (requestBody.param1) {
    followupData.eventID = requestBody.param1;
  }
  if (requestBody.callUUID) {
    followupData.callID = requestBody.callUUID;
  }
  // if date_time is ppresent
  if (requestBody.date == null || requestBody.date == "None") {
    var today = new Date();
    let todayStartInv = dateWithDefaultTimeZone(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0,
      0,
      0,
      0
    );
    followupData.callStartDate = todayStartInv;
  }
  else if (requestBody.date && requestBody.param1) {
    // bind date adn time in separate fields
    let start = dateWithDefaultTimeZoneFromString(requestBody.date);
    let startDate = new Date(start);
    let callStartDate = dateWithDefaultTimeZone(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      Number(requestBody.date.split(" ")[1].split(":")[0]),
      Number(requestBody.date.split(" ")[1].split(":")[1]),
      Number(requestBody.date.split(" ")[1].split(":")[2]),
      0
    );
    followupData.callStartDate = callStartDate;
    followupData.callStartTime = `${requestBody.date.split(" ")[1].split(":")[0]
      }:${requestBody.date.split(" ")[1].split(":")[1]}`;
  } else if (requestBody.callStartTime) {
    // bind date adn time in separate fields
    let start = dateWithDefaultTimeZoneFromString(requestBody.callStartTime);
    let startDate = new Date(start);
    let callStartDate = dateWithDefaultTimeZone(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      Number(requestBody.callStartTime.split(" ")[1].split(":")[0]),
      Number(requestBody.callStartTime.split(" ")[1].split(":")[1]),
      Number(requestBody.callStartTime.split(" ")[1].split(":")[2]),
      0
    );
    followupData.callStartDate = callStartDate;
    followupData.callStartTime = `${requestBody.callStartTime.split(" ")[1].split(":")[0]
      }:${requestBody.callStartTime.split(" ")[1].split(":")[1]}`;
      // console.log("CALL START_TIME", followupData.callStartTime)
      // console.log("CALL START_DATE", followupData.callStartDate)
  }
  // if EndTime is none set EndTime as todays date
  if (requestBody.callEndTime == null || requestBody.callEndTime == "None") {
    var today = new Date();
    let todayEndDate = dateWithDefaultTimeZone(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0,
      0,
      0,
      0
    );
    followupData.callEndDate = todayEndDate;
  }
  else if(requestBody.date && requestBody.param1) {
    // bind date adn time in separate fields
    let ends = dateWithDefaultTimeZoneFromString(requestBody.date);
    let endDate = new Date(ends);
    let callEndDate = dateWithDefaultTimeZone(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      Number(requestBody.callEndTime.split(" ")[1].split(":")[0]),
      Number(requestBody.callEndTime.split(" ")[1].split(":")[1]),
      Number(requestBody.callEndTime.split(" ")[1].split(":")[2]),
      0
    );
    followupData.callEndDate = callEndDate;
    followupData.callEndTime = `${requestBody.callEndTime.split(" ")[1].split(":")[0]
      }:${requestBody.callEndTime.split(" ")[1].split(":")[1]}`;
      // console.log("CALL ENDTIME", followupData.callEndTime)
      // console.log("CALL END_DATE", followupData.callEndDate)
  }
  else if(requestBody.callEndTime && !requestBody.param1) {
    // bind date adn time in separate fields
    let ends = dateWithDefaultTimeZoneFromString(requestBody.callEndTime);
    let endDate = new Date(ends);
    let callEndDate = dateWithDefaultTimeZone(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      Number(requestBody.callEndTime.split(" ")[1].split(":")[0]),
      Number(requestBody.callEndTime.split(" ")[1].split(":")[1]),
      Number(requestBody.callEndTime.split(" ")[1].split(":")[2]),
      0
    );
    followupData.callEndDate = callEndDate;
    followupData.callEndTime = `${requestBody.callEndTime.split(" ")[1].split(":")[0]
      }:${requestBody.callEndTime.split(" ")[1].split(":")[1]}`;
  }
  // if call is connected set status as Connected
  if (followupData.callDuration > 0) {
    // console.log("entered connected block");
    followupData.status = "Connected";
  }
  if (requestBody.duration == 0 && followupData.callDuration == 0) {
    followupData.status = "Missed";//outgoing
  }
  // if(requestBody.status){
  //   console.log("****requestBody.callStatus***",requestBody.status)
  // }
  if (requestBody.callStatus != "Connected" && followupData.callDuration == 0) {
    followupData.status = "Missed";//incoming
  }
  // console.log("DURATION",requestBody.duration)
  if (requestBody.duration == 0) {
    followupData.completedStatus = false;
  }
  if (requestBody.totalCallDuration == 0) {//incoming
    followupData.completedStatus = false;
  }
  // console.log("************** FOLLOWUP DATA VOXBAY**************")
  // console.log("FLWUP",Object.entries(followupData))
  return followupData;
}
function createFollowupInIncomingCall(id,followupData,res){
  return admin
  .firestore()
  .collection("users/" + id + "/Follow Ups")
  .add({
    ...followupData,
    dateCreated: Date.now(),
    assignedToDate: new Date().getTime(),
    lastModifiedDate: new Date().getTime()
  })
  .then((data) => {
    res.send({
      status: 200,
      message: "success",
    });
  });
}
async function bindFollowupDetailsFromIncomingCall(
  requestBody,
  receivedNumber,
  incomingNumber,
  followupData,
  userDetails,
  res
) {
  if (incomingNumber) {
    followupData.sourceNumber = incomingNumber; // set incoming number as sourceNumber
  }
  if (receivedNumber) {
    followupData.destinationNumber = receivedNumber; // set received number as destinationNumber
  }
  if (requestBody.DisplayNumber) {
    followupData.displayNumber = requestBody.DisplayNumber;
  }
  // if (requestBody.StartTime) {
  // if start time is none the set callStartDate as todays date
  if (requestBody.StartTime == null || requestBody.StartTime == "None") {
    var today = new Date();
    let todayInv = dateWithDefaultTimeZone(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0,
      0,
      0,
      0
    );
    followupData.callStartDate = todayInv;
  } else {
    // set call time and date
    let start = dateWithDefaultTimeZoneFromString(requestBody.StartTime);
    let startDate = new Date(start);
    let callStartDate = dateWithDefaultTimeZone(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      Number(requestBody.StartTime.split(" ")[1].split(":")[0]),
      Number(requestBody.StartTime.split(" ")[1].split(":")[1]),
      0,
      0
    );
    followupData.callStartDate = callStartDate;
    followupData.callStartTime = `${
      requestBody.StartTime.split(" ")[1].split(":")[0]
    }:${requestBody.StartTime.split(" ")[1].split(":")[1]}`;
  }
  // }
  if (requestBody.DataSource) {
    followupData.dataSource = requestBody.DataSource;
  }
  // used to update folloup in callType 1 or 2
  if (requestBody.callID) {
    followupData.callID = requestBody.callID;
  }
  // here there is no user picked the call
  followupData.completedStatus = false;
  let customerData;
  customerData = await getCustomerWithPhoneNumber(
    userDetails.id,
    incomingNumber
  );
  if (!customerData) {
    customerData = await getCustomerWithAltPhoneNumber(
      userDetails.id,
      incomingNumber
    );
    if(customerData){
      followupData.contactNumber = customerData.data().alternateContactNumber
      ? customerData.data().alternateContactNumber
      : '';
    followupData.countryCode = customerData.data().altContactCode
      ? customerData.data().altContactCode
      : '';
    }
  }else{
    followupData.contactNumber = customerData.data().contactNo
    ? customerData.data().contactNo
    : '';
  followupData.countryCode = customerData.data().code
    ? customerData.data().code
    : '';
  }
  if (customerData) {
    // if customer data is there set customerName,companyName and customerId
    let custName;
    if (customerData.data().secondName && customerData.data().surname) {
      custName =
        customerData.data().firstName +
        " " +
        customerData.data().secondName +
        " " +
        customerData.data().surname;
    } else if (customerData.data().secondName && !customerData.data().surname) {
      custName =
        customerData.data().firstName + " " + customerData.data().secondName;
    } else if (!customerData.data().secondName && customerData.data().surname) {
      custName =
        customerData.data().firstName + " " + customerData.data().surname;
    } else {
      custName = customerData.data().firstName;
    }
    followupData.customerName = custName;
    followupData.companyName = customerData.data().companyName;
    followupData.customerId = customerData.id;
    followupData.orgId = customerData.data().orgId
      ? customerData.data().orgId
      : "";
    followupData.associatedBranch = customerData.data().associatedBranch
      ? customerData.data().associatedBranch
      : "none";
    followupData.assignedTo = customerData.data().assignedTo
      ? customerData.data().assignedTo
      : "none";
    followupData.assignedToName = customerData.data().assignedToName
      ? customerData.data().assignedToName
      : "none";
    // save followup and the send success message
    createFollowupInIncomingCall(userDetails.id,followupData,res)
  } else {
    // if customer data is not there set customerName,companyName and customerId as "N/A"
    followupData.customerName = "inb_call_lead";
    followupData.companyName = "N/A";
    followupData.orgId = "N/A";
    followupData.associatedBranch = "none";
    followupData.assignedTo = "none";
    followupData.assignedToName = "none";
    followupData.contactNumber = incomingNumber;
    followupData.countryCode = '+91';
    createInb_Call_Lead(
      incomingNumber,
      userDetails.id,
      followupData,
      userDetails,
      res
    );
  }
}
async function checkAuthorization(token,fieldName) {
  // if accountId is there then get user which ivrToken is equal to accountId
  if (token) {
    return await admin
      .firestore()
      .collection("users")
      .where(fieldName, "==", token)
      .get()
      .then((userData) => {
        let data;
        userData.forEach((userDetails) => {
          data = userDetails;
        });
        //return the userdetails
        return data;
      })
      .catch((error) => {
        console.log("error == " + error);
        return;
      });
  } else {
    return;
  }
}
async function getSubUserDetails(id, receivedNumber) {
  // get user details which phone is equal to receivedNumber
  return await admin
    .firestore()
    .collection("users/" + id + "/subUsers")
    .where("contactNo", "==", receivedNumber)
    .get()
    .then((subUserData) => {
      return subUserData;
    });
}
async function getSubUserDetailsWithExtension(id, receivedNumber) {
  // get user details  where
  return await admin
    .firestore()
    .collection("users/" + id + "/subUsers")
    .where("extensionNumber", "==", receivedNumber)
    .get()
    .then((subUserData) => {
      return subUserData;
    });
}
async function getSubUserDetailsWithOutNumber(superUserId,userId) {
  // get user details with id
  return await admin
    .firestore()
    .collection("users/" + superUserId + "/subUsers")
    .where("userId", "==", userId)
    .get()
    .then((subUserData) => {
       return subUserData;
    });
}
async function getCustomerWithPhoneNumber(id, phoneNumber) {
  // get the customer with this phone number in users customer collection adn return customer details
  return await admin
    .firestore()
    .collection("users")
    .doc(id)
    .collection("customers")
    .where("contactNo", "==", phoneNumber)
    .get()
    .then((customerData) => {
      let data;
      customerData.forEach((customerDetails) => {
        data = customerDetails;
      });
      return data;
    })
    .catch((err) => {
      return;
    });
}
async function getCustomerWithAltPhoneNumber(id, phoneNumber) {
  return await admin
    .firestore()
    .collection("users")
    .doc(id)
    .collection("customers")
    .where("alternateContactNumber", "==", phoneNumber)
    .get()
    .then((customerData) => {
      let data;
      customerData.forEach((customerDetails) => {
        data = customerDetails;
      });
      return data;
    })
    .catch((err) => {
      return;
    });
}
async function getFollowUpId(userId, id, idFilter) {
  // get followup where callID/eventId is equal to id and return followup details
  return await admin
    .firestore()
    .collection("users/" + userId + "/Follow Ups")
    .where(idFilter, "==", id)
    .get()
    .then((followupData) => {
      let data;
      followupData.forEach((details) => {
        data = details;
      });
      return data;
    })
    .catch((error) => {
      console.log("error == " + error);
      return;
    });
}
// create auto call
exports.autoCall = functions.region(region).https.onRequest((req, res) => {
  if (path.includes(req.headers.origin)) {
    res.set("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    );
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    return cors(req, res, () => {
      console.log("auto call start")
      const axios = require("axios").default;
      // set eventId using uuidv4 .eventId is used for finding the call
      const { v4: uuidv4 } = require("uuid");
      let eventId = uuidv4();
      // let channelID =  req.body.channelID;
      // if(req.body.autoCallURL !='https://backend.pbx.bonvoice.com/autoDialManagement/autoCallBridging/'){
      // channelID ='11'
      // }
      // post autoCallBridging api with header as autoCallToken and available data like destination and legBDestination
      const config = {
        method: "post",
        url: req.body.autoCallURL,
        headers: {
          Authorization: "Token " + req.body.autoCallToken,
        },
        data: {
          autocallType: "3",
          destination: "0" + req.body.destination,
          legACallerID: req.body.DIDNumber,
          legAChannelID:req.body.channelID,
          legADialAttempts: "1",
          legBDestination: "0" + req.body.legBDestination,
          legBChannelID: req.body.channelID,
          legBCallerID: req.body.DIDNumber,
          legBDialAttempts: "1",
          eventID: eventId,
        },
      };
      axios(config)
        .then(function (response) {
          console.log("response" + response);
          res.status(200).send("");
        })
        .catch(function (error) {
          console.log("error" + error);
          res.status(404).send("");
        });

      if (req.body.callId) {
        console.log("in call id")
        // if call id is avalible in req.body get the followup and mark the followup as completed
        updateFollowupCompletedStatus(req.body.superUserId,req.body.callId,eventId)
      } else {
        console.log("not call id")
        // if call id is avalible in req.body set start time as todays data
        var today = new Date();
        //spliting the the time for getting hours and minute
        let callStartTimeSplit;
        if (req.body.startTime) {
          callStartTimeSplit = req.body.startTime.split(":");
        }

        let callStartDate = dateWithDefaultTimeZone(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          Number(callStartTimeSplit ? callStartTimeSplit[0] : null),
          Number(callStartTimeSplit ? callStartTimeSplit[1] : null),
          0,
          0
        );
        console.log("on followup data set")
        // set the followupData with available fields for creating followup
        var followupData = {
          eventID: eventId,
          assignedTo: req.body.userId,
          assignedToName: req.body.userName,
          companyName: req.body.companyName,
          customerId: req.body.customerId,
          orgId: req.body.orgId,
          associatedBranch: req.body.associatedBranch,
          customerName: req.body.customerName,
          createdBy: req.body.userId,
          completedStatus: true,
          dateCreated: Date.now(),
          direction: "Outbound",
          sourceNumber: req.body.destination,
          destinationNumber: req.body.legBDestination,
          displayNumber: null,
          callStartDate: callStartDate,
          callStartTime: req.body.startTime,
          callEndDate: null,
          callEndTime: null,
          callDuration: 0.0,
          status: null,
          dataSource: null,
          notes: null,
          outcome: null,
          tagOne: null,
          tagTwo: null,
          tagThree: null,
          tagFour: null,
          tagFive: null,
          recordingLink: null,
          callerName: null,
          callerCity: null,
          callerState: null,
          callerCountry: null,
          callerZipCode: null,
          resourceURL: null,
          callConnected: false,
          assignedToDate: new Date().getTime(),
          contactNumber:req.body.legBDestination,
          countryCode:"+91",
          saleTitle: req.body.saleTitle ? req.body.saleTitle: null,
          saleId: req.body.saleId ? req.body.saleId : null,
          serviceId: req.body.serviceId ? req.body.serviceId : null,
          serviceTitle: req.body.serviceTitle ? req.body.serviceTitle : null,
        };
        console.log("followupData + " +JSON.stringify(followupData));
        // create followup
        createFollowupInAutoCall(followupData,req.body.superUserId);
      }
    });
  }
});
function updateFollowupCompletedStatus(superUserId,callId,eventId) {
  return admin
    .firestore()
    .doc(
      "users/" + superUserId + "/Follow Ups/" + callId
    )
    .update({
      completedStatus: true,
      eventID: eventId,
      lastModifiedDate: new Date().getTime()
    })
    .then(() => { })
    .catch(function (error) {
      console.log("error " + error);
    });
}
function createFollowupInAutoCall(followupData,superUserId) {
  console.log("on create followup"+superUserId)
  return admin
    .firestore()
    .collection("/users/" + superUserId + "/Follow Ups")
    .add({followupData, lastModifiedDate: new Date().getTime()})
    .then((res) => { })
    .catch(function (error) {
      console.log("error " + error);
    });
}
async function upDateFollowupDetails(
  followupDetails,
  requestBody,
  followupData,
  incomingNumber,
  receivedNumber,
  userDetails,
  res
) {
  if (followupDetails) {
    followupData.contactNumber = followupDetails.data().contactNumber ? followupDetails.data().contactNumber :'';
    followupData.countryCode = followupDetails.data().countryCode ? followupDetails.data().countryCode :'';
    // if followup details is there set followup id to followupId
    const followupId = followupDetails.id;
    followupData.notes = followupDetails.data().notes ? followupDetails.data().notes: null;
    followupData.outcome = followupDetails.data().outcome ? followupDetails.data().outcome:null;
    followupData.orgId = followupDetails.data().orgId ? followupDetails.data().orgId :null;
    followupData.companyName = followupDetails.data().companyName ? followupDetails.data().companyName:null;
    let subUserData;
    let callerLastAssign = 0;
    let customerData;
    let lastAssignedChanged = false;
    if (incomingNumber != null && incomingNumber != "None") {
      customerData = await getCustomerWithPhoneNumber(
        userDetails.id,
        incomingNumber
      );
      if (!customerData) {
        customerData = await getCustomerWithAltPhoneNumber(
          userDetails.id,
          incomingNumber
        );
      }
    }
    if (receivedNumber != null && receivedNumber != "None") {
      // if recevied number is there get user which is having the phone number as receivedNumber
      if(userDetails.data().phone == receivedNumber){
        subUserData = userDetails;
      }else{
       let subList = await getSubUserDetails(userDetails.id, receivedNumber);
       subList.forEach((element) => {
        subUserData = element;
      })
      }

      // if call recieved user details is there set assignedTo and assignedToName
      if (subUserData) {
        if(userDetails.data().phone == receivedNumber){
          followupData.associatedBranch = subUserData.data().associatedBranch ? subUserData.data().associatedBranch :'none';
          followupData.assignedTo = subUserData.id;
        }else{
          followupData.associatedBranch = subUserData.data().branchId ? subUserData.data().branchId :'none';
          followupData.assignedTo = subUserData.data().userId;
        }
        let name;
        if (subUserData.data().lastname) {
          name =
            subUserData.data().firstname + " " + subUserData.data().lastname;
        } else {
          name = subUserData.data().firstname;
        }
        followupData.assignedToName = name;
      } else {
        // if call recieved user details is not there set assignedTo and assignedToName as 'none'
        followupData.assignedTo = "none";
        followupData.assignedToName = "none";
        followupData.associatedBranch = "none";
      }
    } else {
      followupData.completedStatus = false;
      if (customerData.data().assignedTo == "none") {
        // if there is no receivedNumber the get callerList from userdetails
        if (userDetails.data().callerList.length > 0) {
          let oldIndex = userDetails.data().callerLastAssign;
          let assignObj =await assignToSubUserIvr(userDetails.data().callerList, userDetails.data().callerLastAssign, userDetails.id, userDetails, lastAssignedChanged, oldIndex)
          //get values from object returned by the function

          callerLastAssign = (await assignObj).byUserCallerIndex;
          lastAssignedChanged = (await assignObj).lastAssignedChanged;
          subUserData = (await assignObj).subUserDetails;
          // if call recieved user details is there set assignedTo and assignedToName
          if (subUserData) {
              followupData.associatedBranch = (await assignObj).associatedBranch ? (await assignObj).associatedBranch :'none';
              followupData.assignedTo = (await assignObj).assignedTo;
              followupData.assignedToName = (await assignObj).assignedToName;
          } else {
            // if call recieved user details is not there set assignedTo and assignedToName as 'none'
            followupData.assignedTo = "none";
            followupData.assignedToName = "none";
            followupData.associatedBranch = "none";
          }
        } else {
          // if call list is not there send 404
          res.status(404).send({
            status: 404,
            message: "caller list is not available",
          });
        }
      }
    }
    if (subUserData) {
      // if subUserData is there then bind followup details to followupData used for updating followup
      let userPhone=''
    if(userDetails.data().superUserId == subUserData.id){

      userPhone = subUserData.data().phone
    }else{
      userPhone = subUserData.data().contactNo;
    }
      // if subUserData is there then bind followup details to followupData used for updating followup
      followupData = fetchFollowupData(
        followupData,
        userPhone,
        requestBody,
        incomingNumber,
        receivedNumber,
        followupDetails.incomingNumber
      );
    } else {
      let phone = "";
      if (customerData) {
        phone = customerData.data().contactNo
          ? customerData.data().contactNo
          : "";
      }
      // if subUserData is not there then bind followup details to followupData used for updating followup
      followupData = fetchFollowupData(
        followupData,
        phone,
        requestBody,
        incomingNumber,
        receivedNumber,
        followupDetails.incomingNumber
      );
    }
    // get customer data with incomingNumber

    // if customer data is there set customerName,companyName and customerId
    if (customerData) {
      let custName;
      if (customerData.data().secondName && customerData.data().surname) {
        custName =
          customerData.data().firstName +
          " " +
          customerData.data().secondName +
          " " +
          customerData.data().surname;
      } else if (
        customerData.data().secondName &&
        !customerData.data().surname
      ) {
        custName =
          customerData.data().firstName + " " + customerData.data().secondName;
      } else if (
        !customerData.data().secondName &&
        customerData.data().surname
      ) {
        custName =
          customerData.data().firstName + " " + customerData.data().surname;
      } else {
        custName = customerData.data().firstName;
      }

      followupData.customerName = custName;
      followupData.customerId = customerData.id;
      //companyName
      if (followupDetails.data().companyName) {
        followupData.companyName = followupDetails.data().companyName ? followupDetails.data().companyName :null;
      } else {
        followupData.companyName = customerData.data().companyName ? customerData.data().companyName :null;
      }
      //organisationId
      if (followupDetails.orgId) {
        followupData.orgId = followupDetails.data().orgId ? followupDetails.data().orgId :null;
      } else {
        followupData.orgId = customerData.data().orgId
          ? customerData.data().orgId
          : null;
      }

      if (!subUserData) {
        followupData.assignedTo = customerData.data().assignedTo
          ? customerData.data().assignedTo
          : "none";
        followupData.assignedToName = customerData.data().assignedToName
          ? customerData.data().assignedToName
          : "none";
        followupData.associatedBranch = customerData.data().associatedBranch
          ? customerData.data().associatedBranch
          : "none";
      }
    } else {
      if (
        (followupDetails.data().customerId && incomingNumber == null) ||
        (followupDetails.data().customerId && incomingNumber == "None")
      ) {
        followupData.customerName = followupDetails.data().customerName;
        followupData.companyName = followupDetails.data().companyName;
        followupData.customerId = followupDetails.data().customerId;
      } else {
        // if customer data and customer is not taggd in followup set customerName,companyName and customerId as "N/A"
        followupData.customerName = "N/A";
        followupData.companyName = "N/A";
        followupData.customerId = "N/A";
      }
      if (
        (followupDetails.data().orgId && incomingNumber == null) ||
        (followupDetails.data().orgId && incomingNumber == "None")
      ) {
        followupData.orgId = followupDetails.data().orgId;
      } else {
        followupData.orgId = "N/A";
      }
      // if (
      //   (followupDetails.data().associatedBranch && incomingNumber == null) ||
      //   (followupDetails.data().associatedBranch && incomingNumber == "None")
      // ) {
      //   followupData.associatedBranch = followupDetails.data().associatedBranch;
      // } else {
      //   followupData.associatedBranch = "none";
      // }
    }
    if (customerData) {
      if (
        customerData.data().assignedTo == "none" &&
        followupData.assignedTo != "none"
      ) {
        return await admin
          .firestore()
          .doc("users/" + userDetails.id + "/customers/" + customerData.id)
          .update({
            assignedTo: followupData.assignedTo,
            assignedToName: followupData.assignedToName,
            associatedBranch: followupData.associatedBranch,
          })
          .then((data) => {
            if (requestBody.callType == "1") {
              // if call type is 1 update the followup
              return admin
                .firestore()
                .doc("users/" + userDetails.id + "/Follow Ups/" + followupId)
                .update({
                  ...followupData,
                  notified: false,
                  lastModifiedDate: new Date().getTime()
                })
                .then((data) => {
                  res.send({
                    status: 200,
                    message: "success",
                  });
                });
            } else {
              // if call type is not 1 update the followup
              return admin
                .firestore()
                .doc("users/" + userDetails.id + "/Follow Ups/" + followupId)
                .update({
                  ...followupData, lastModifiedDate: new Date().getTime()
                })
                .then((data) => {
                  if (
                    requestBody.callID &&
                    !requestBody.eventID &&
                    requestBody.callType == "2" &&
                    followupData.callDuration == 0 &&
                    followupData.assignedTo != "none"
                  ) {
                    console.log("entered missed call1 ");
                    return admin
                      .firestore()
                      .collection(
                        "users/" + followupData.assignedTo + "/Notifications"
                      )
                      .add({
                        message:
                          "You have a missed call from " + incomingNumber,
                        createdDate: Date.now(),
                        viewStatus: false,
                        docId: followupId,
                        type: "FollowUp",
                      })
                      .then((responsenotification) => {
                        console.log("added to notification collection");
                        if (
                          receivedNumber == null ||
                          receivedNumber == "None"
                        ) {
                          // if there is no receivedNumber update callerLastAssign
                          return admin
                            .firestore()
                            .doc("users/" + userDetails.id)
                            .update({
                              callerLastAssign: callerLastAssign,
                            })
                            .then((datas) => {
                              res.send({
                                status: 200,
                                message: "success",
                              });
                            });
                        } else {
                          res.send({
                            status: 200,
                            message: "success",
                          });
                        }
                      })
                      .catch((e) => {
                        console.log(e.message);
                      });
                  } else {
                    if (receivedNumber == null || receivedNumber == "None") {
                      // if there is no receivedNumber update callerLastAssign
                      return admin
                        .firestore()
                        .doc("users/" + userDetails.id)
                        .update({
                          callerLastAssign: callerLastAssign,
                        })
                        .then((datas) => {
                          res.send({
                            status: 200,
                            message: "success",
                          });
                        });
                    } else {
                      res.send({
                        status: 200,
                        message: "success",
                      });
                    }
                  }
                });
            }
          });
      } else {
        if (requestBody.callType == "1") {
          // if call type is 1 update the followup
          return admin
            .firestore()
            .doc("users/" + userDetails.id + "/Follow Ups/" + followupId)
            .update({
              ...followupData,
              notified: false,
              lastModifiedDate: new Date().getTime()
            })
            .then((data) => {
              console.log("receivedNumber" + receivedNumber + callerLastAssign);
              res.send({
                status: 200,
                message: "success",
              });
            });
        } else {
          // if call type is not 1 update the followup
          return admin
            .firestore()
            .doc("users/" + userDetails.id + "/Follow Ups/" + followupId)
            .update({
              ...followupData, lastModifiedDate: new Date().getTime()
            })
            .then((data) => {
              if (
                requestBody.callID &&
                !requestBody.eventID &&
                requestBody.callType == "2" &&
                followupData.callDuration == 0 &&
                followupData.assignedTo != "none"
              ) {
                console.log("entered missed call2 ");
                return admin
                  .firestore()
                  .collection(
                    "users/" + followupData.assignedTo + "/Notifications"
                  )
                  .add({
                    message: "You have a missed call from " + incomingNumber,
                    createdDate: Date.now(),
                    viewStatus: false,
                    docId: followupId,
                    type: "FollowUp",
                  })
                  .then((responsenotification) => {
                    if (receivedNumber == null || receivedNumber == "None") {
                      // if there is no receivedNumber update callerLastAssign
                      return admin
                        .firestore()
                        .doc("users/" + userDetails.id)
                        .update({
                          callerLastAssign: callerLastAssign,
                        })
                        .then((datas) => {
                          res.send({
                            status: 200,
                            message: "success",
                          });
                        });
                    } else {
                      res.send({
                        status: 200,
                        message: "success",
                      });
                    }
                  })
                  .catch((e) => {
                    console.log(e.message);
                  });
              } else {
                if (receivedNumber == null || receivedNumber == "None") {
                  // if there is no receivedNumber update callerLastAssign
                  return admin
                    .firestore()
                    .doc("users/" + userDetails.id)
                    .update({
                      callerLastAssign: callerLastAssign,
                    })
                    .then((datas) => {
                      res.send({
                        status: 200,
                        message: "success",
                      });
                    });
                } else {
                  res.send({
                    status: 200,
                    message: "success",
                  });
                }
              }
            });
        }
      }
    } else {
      if (requestBody.callType == "1") {
        // if call type is 1 update the followup
        return admin
          .firestore()
          .doc("users/" + userDetails.id + "/Follow Ups/" + followupId)
          .update({
            ...followupData,
            notified: false, lastModifiedDate: new Date().getTime()
          })
          .then((data) => {
            res.send({
              status: 200,
              message: "success",
            });
          });
      } else {
        // if call type is not 1 update the followup
        return admin
          .firestore()
          .doc("users/" + userDetails.id + "/Follow Ups/" + followupId)
          .update({
            ...followupData, lastModifiedDate: new Date().getTime()
          })
          .then((data) => {
            if (
              requestBody.callID &&
              !requestBody.eventID &&
              requestBody.callType == "2" &&
              followupData.callDuration == 0 &&
              followupData.assignedTo != "none"
            ) {
              console.log("entered missed call3 ");
              return admin
                .firestore()
                .collection(
                  "users/" + followupData.assignedTo + "/Notifications"
                )
                .add({
                  message: "You have a missed call from " + incomingNumber,
                  createdDate: Date.now(),
                  viewStatus: false,
                  docId: followupId,
                  type: "FollowUp",
                })
                .then((responsenotification) => {
                  if (receivedNumber == null || receivedNumber == "None") {
                    // if there is no receivedNumber update callerLastAssign
                    return admin
                      .firestore()
                      .doc("users/" + userDetails.id)
                      .update({
                        callerLastAssign: callerLastAssign,
                      })
                      .then((datas) => {
                        res.send({
                          status: 200,
                          message: "success",
                        });
                      });
                  } else {
                    res.send({
                      status: 200,
                      message: "success",
                    });
                  }
                })
                .catch((e) => {
                  console.log(e.message);
                });
            } else {
              if (receivedNumber == null || receivedNumber == "None") {
                // if there is no receivedNumber update callerLastAssign
                return admin
                  .firestore()
                  .doc("users/" + userDetails.id)
                  .update({
                    callerLastAssign: callerLastAssign,
                  })
                  .then((datas) => {
                    res.send({
                      status: 200,
                      message: "success",
                    });
                  });
              } else {
                res.send({
                  status: 200,
                  message: "success",
                });
              }
            }
          });
      }
    }
  } else {
    // if there is no followupDetails
    if (incomingNumber && requestBody.StartTime) {
      //if there is incomingNumber and StartTime
      let subUserData;
      let callerLastAssign = 0;
      let customerData;
      customerData = await getCustomerWithPhoneNumber(
        userDetails.id,
        incomingNumber
      );
      if (!customerData) {
        customerData = await getCustomerWithAltPhoneNumber(
          userDetails.id,
          incomingNumber
        );
      }
      if (receivedNumber != null && receivedNumber != "None") {
        if(userDetails.data().phone == receivedNumber){

          subUserData = userDetails;
        }else{
          let subList = await getSubUserDetails(userDetails.id, receivedNumber);
          subList.forEach((element) => {
            subUserData = element;
          })
        }
        // if call recieved user details is there set assignedTo and assignedToName
        if (subUserData) {
          if(userDetails.data().phone == receivedNumber){
            followupData.associatedBranch = subUserData.data().associatedBranch ? subUserData.data().associatedBranch :'none';
            followupData.assignedTo = subUserData.id;
          }else{
            followupData.associatedBranch = subUserData.data().branchId ? subUserData.data().branchId :'none';
            followupData.assignedTo = subUserData.data().userId;
          }
          let name;
          if (subUserData.data().lastname) {
            name =
              subUserData.data().firstname + " " + subUserData.data().lastname;
          } else {
            name = subUserData.data().firstname;
          }
          followupData.assignedToName = name;
        } else {
          // if call recieved user details is not there set assignedTo and assignedToName as 'none'
          followupData.assignedTo = "none";
          followupData.assignedToName = "none";
          followupData.associatedBranch = "none";
        }
      } else {
        followupData.completedStatus = false;
        if (!customerData) {
          if (userDetails.data().callerList.length > 0) {
            let oldIndex = userDetails.data().callerLastAssign;
          let assignObj =await assignToSubUserIvr(userDetails.data().callerList, userDetails.data().callerLastAssign, userDetails.id, userDetails, lastAssignedChanged, oldIndex)
          //get values from object returned by the function

          callerLastAssign = (await assignObj).byUserCallerIndex;
          lastAssignedChanged = (await assignObj).lastAssignedChanged;
          subUserData = (await assignObj).subUserDetails;
          // if call recieved user details is there set assignedTo and assignedToName
          if (subUserData) {
              followupData.associatedBranch = (await assignObj).associatedBranch ? (await assignObj).associatedBranch :'none';
              followupData.assignedTo = (await assignObj).assignedTo;
              followupData.assignedToName = (await assignObj).assignedToName;
          } else {
            // if call recieved user details is not there set assignedTo and assignedToName as 'none'
            followupData.assignedTo = "none";
            followupData.assignedToName = "none";
            followupData.associatedBranch = "none";
          }
          } else {
            // if call list is not there send 404
            res.status(404).send({
              status: 404,
              message: "caller list is not available",
            });
          }
        }
      }
      if (subUserData) {
        // if subUserData is there then bind followup details to followupData used for updating followup
        let userPhone=''
      if(userDetails.data().superUserId == subUserData.id){

        userPhone = subUserData.data().phone
      }else{
        userPhone = subUserData.data().contactNo;
      }
        followupData = fetchFollowupData(
          followupData,
          userPhone,
          requestBody,
          incomingNumber,
          receivedNumber,
          null
        );
      } else {
        let phone = "";
        if (customerData) {
          phone = customerData.data().contactNo
            ? customerData.data().contactNo
            : "";
        }
        followupData = fetchFollowupData(
          followupData,
          phone,
          requestBody,
          incomingNumber,
          receivedNumber,
          null
        );
      }

      if (customerData) {
        let custName;
        if (customerData.data().secondName && customerData.data().surname) {
          custName =
            customerData.data().firstName +
            " " +
            customerData.data().secondName +
            " " +
            customerData.data().surname;
        } else if (
          customerData.data().secondName &&
          !customerData.data().surname
        ) {
          custName =
            customerData.data().firstName +
            " " +
            customerData.data().secondName;
        } else if (
          !customerData.data().secondName &&
          customerData.data().surname
        ) {
          custName =
            customerData.data().firstName + " " + customerData.data().surname;
        } else {
          custName = customerData.data().firstName;
        }
        followupData.customerName = custName;
        followupData.companyName = customerData.data().companyName;
        followupData.customerId = customerData.id;
        followupData.orgId = customerData.data().orgId
          ? customerData.data().orgId
          : "";

        if (!subUserData) {
          followupData.assignedTo = customerData.data().assignedTo
            ? customerData.data().assignedTo
            : "none";
          followupData.assignedToName = customerData.data().assignedToName
            ? customerData.data().assignedToName
            : "none";
          followupData.associatedBranch = customerData.data().associatedBranch
            ? customerData.data().associatedBranch
            : "none";
        }
      } else {
        followupData.customerName = "N/A";
        followupData.companyName = "N/A";
        followupData.customerId = "N/A";
        followupData.orgId = "N/A";
      }
      if (customerData) {
        if (
          customerData.data().assignedTo == "none" &&
          followupData.assignedTo != "none"
        ) {
          return await admin
            .firestore()
            .doc("users/" + userDetails.id + "/customers/" + customerData.id)
            .update({
              assignedTo: followupData.assignedTo,
              assignedToName: followupData.assignedToName,
              associatedBranch: followupData.associatedBranch,
            })
            .then((data) => {
              return admin
                .firestore()
                .collection("users/" + userDetails.id + "/Follow Ups")
                .add({ ...followupData, dateCreated: Date.now(), lastModifiedDate: new Date().getTime() })
                .then(async (data) => {
                  if (
                    requestBody.callID &&
                    !requestBody.eventID &&
                    requestBody.callType == "2" &&
                    followupData.callDuration == 0 &&
                    followupData.assignedTo != "none"
                  ) {
                    console.log("entered missed call4 ");
                    return await admin
                      .firestore()
                      .collection(
                        "users/" + followupData.assignedTo + "/Notifications"
                      )
                      .add({
                        message:
                          "You have a missed call from " + incomingNumber,
                        createdDate: Date.now(),
                        viewStatus: false,
                        docId: data.id,
                        type: "FollowUp",
                      })
                      .then((responsenotification) => {
                        if (
                          receivedNumber == null ||
                          receivedNumber == "None"
                        ) {
                          return admin
                            .firestore()
                            .doc("users/" + userDetails.id)
                            .update({
                              callerLastAssign: callerLastAssign,
                            })
                            .then((datas) => {
                              res.send({
                                status: 200,
                                message: "success",
                              });
                            });
                        } else {
                          res.send({
                            status: 200,
                            message: "success",
                          });
                        }
                      })
                      .catch((e) => {
                        console.log(e.message);
                      });
                  } else {
                    if (receivedNumber == null || receivedNumber == "None") {
                      return admin
                        .firestore()
                        .doc("users/" + userDetails.id)
                        .update({
                          callerLastAssign: callerLastAssign,
                        })
                        .then((datas) => {
                          res.send({
                            status: 200,
                            message: "success",
                          });
                        });
                    } else {
                      res.send({
                        status: 200,
                        message: "success",
                      });
                    }
                  }
                });
            });
        } else {
          return admin
            .firestore()
            .collection("users/" + userDetails.id + "/Follow Ups")
            .add({ ...followupData, dateCreated: Date.now(), lastModifiedDate: new Date().getTime() })
            .then(async (data) => {
              if (
                requestBody.callID &&
                !requestBody.eventID &&
                requestBody.callType == "2" &&
                followupData.callDuration == 0 &&
                followupData.assignedTo != "none"
              ) {
                console.log("entered missed call5 ");
                return await admin
                  .firestore()
                  .collection(
                    "users/" + followupData.assignedTo + "/Notifications"
                  )
                  .add({
                    message: "You have a missed call from " + incomingNumber,
                    createdDate: Date.now(),
                    viewStatus: false,
                    docId: data.id,
                    type: "FollowUp",
                  })
                  .then((responsenotification) => {
                    if (receivedNumber == null || receivedNumber == "None") {
                      return admin
                        .firestore()
                        .doc("users/" + userDetails.id)
                        .update({
                          callerLastAssign: callerLastAssign,
                        })
                        .then((datas) => {
                          res.send({
                            status: 200,
                            message: "success",
                          });
                        });
                    } else {
                      res.send({
                        status: 200,
                        message: "success",
                      });
                    }
                  })
                  .catch((e) => {
                    console.log(e.message);
                  });
              } else {
                if (receivedNumber == null || receivedNumber == "None") {
                  return admin
                    .firestore()
                    .doc("users/" + userDetails.id)
                    .update({
                      callerLastAssign: callerLastAssign,
                    })
                    .then((datas) => {
                      res.send({
                        status: 200,
                        message: "success",
                      });
                    });
                } else {
                  res.send({
                    status: 200,
                    message: "success",
                  });
                }
              }
            });
        }
      } else {
        return admin
          .firestore()
          .collection("users/" + userDetails.id + "/Follow Ups")
          .add({ ...followupData, dateCreated: Date.now(), lastModifiedDate: new Date().getTime() })
          .then(async (data) => {
            if (
              requestBody.callID &&
              !requestBody.eventID &&
              requestBody.callType == "2" &&
              followupData.callDuration == 0 &&
              followupData.assignedTo != "none"
            ) {
              console.log("entered missed call6 ");
              return await admin
                .firestore()
                .collection(
                  "users/" + followupData.assignedTo + "/Notifications"
                )
                .add({
                  message: "You have a missed call from " + incomingNumber,
                  createdDate: Date.now(),
                  viewStatus: false,
                  docId: data.id,
                  type: "FollowUp",
                })
                .then((responsenotification) => {
                  if (receivedNumber == null || receivedNumber == "None") {
                    return admin
                      .firestore()
                      .doc("users/" + userDetails.id)
                      .update({
                        callerLastAssign: callerLastAssign,
                      })
                      .then((datas) => {
                        res.send({
                          status: 200,
                          message: "success",
                        });
                      });
                  } else {
                    res.send({
                      status: 200,
                      message: "success",
                    });
                  }
                })
                .catch((e) => {
                  console.log(e.message);
                });
            } else {
              if (receivedNumber == null || receivedNumber == "None") {
                return admin
                  .firestore()
                  .doc("users/" + userDetails.id)
                  .update({
                    callerLastAssign: callerLastAssign,
                  })
                  .then((datas) => {
                    res.send({
                      status: 200,
                      message: "success",
                    });
                  });
              } else {
                res.send({
                  status: 200,
                  message: "success",
                });
              }
            }
          });
      }
    } else {
      res.status(404).send({
        status: 404,
        message: "no data available",
      });
    }
  }
}
//voxbayNEW changes starts here
async function upDateFollowupDetailsVoxbay(
  followupDetails,
  requestBody,
  followupData,
  incomingNumber,
  receivedNumber,
  userDetails,
  res
) {
  if (followupDetails) {
    followupData.contactNumber = followupDetails.data().contactNumber ? followupDetails.data().contactNumber : '';
    followupData.countryCode = followupDetails.data().countryCode ? followupDetails.data().countryCode : '';
    // if followup details is there set followup id to followupId
    const followupId = followupDetails.id;
    followupData.notes = followupDetails.data().notes ? followupDetails.data().notes : null;
    followupData.outcome = followupDetails.data().outcome ? followupDetails.data().outcome : null;
    followupData.orgId = followupDetails.data().orgId ? followupDetails.data().orgId : null;
    followupData.companyName = followupDetails.data().companyName ? followupDetails.data().companyName : null;
    let subUserData;
    let callerLastAssign = 0;
    let customerData;
    if (incomingNumber != null && incomingNumber != "None") {
      customerData = await getCustomerWithPhoneNumber(
        userDetails.id,
        incomingNumber
      );
      if (!customerData) {
        customerData = await getCustomerWithAltPhoneNumber(
          userDetails.id,
          incomingNumber
        );
      }
    }
    if (receivedNumber != null && receivedNumber != "None") {
      // if recevied number is there get user which is having the phone number as receivedNumber
      if (userDetails.data().phone == receivedNumber) {
        subUserData = userDetails;
      } else {
        let subList = await getSubUserDetails(userDetails.id, receivedNumber);
        subList.forEach((element) => {
          subUserData = element;
        })
      }

      // if call recieved user details is there set assignedTo and assignedToName
      if (subUserData) {
        if (userDetails.data().phone == receivedNumber) {
          followupData.associatedBranch = subUserData.data().associatedBranch ? subUserData.data().associatedBranch : 'none';
          followupData.assignedTo = subUserData.id;
        } else {
          followupData.associatedBranch = subUserData.data().branchId ? subUserData.data().branchId : 'none';
          followupData.assignedTo = subUserData.data().userId;
        }
        let name;
        if (subUserData.data().lastname) {
          name =
            subUserData.data().firstname + " " + subUserData.data().lastname;
        } else {
          name = subUserData.data().firstname;
        }
        followupData.assignedToName = name;
      } else {
        // if call recieved user details is not there set assignedTo and assignedToName as 'none'
        followupData.assignedTo = "none";
        followupData.assignedToName = "none";
        followupData.associatedBranch = "none";
      }
    } else {
      followupData.completedStatus = false;
    }
    if (subUserData) {
      // if subUserData is there then bind followup details to followupData used for updating followup
      let userPhone = ''
      if (userDetails.data().superUserId == subUserData.id) {

        userPhone = subUserData.data().phone
      } else {
        userPhone = subUserData.data().contactNo;
      }
      // if subUserData is there then bind followup details to followupData used for updating followup
      followupData = fetchFollowupDataVoxbay(
        followupData,
        userPhone,
        requestBody,
        incomingNumber,
        receivedNumber,
        followupDetails.incomingNumber
      );
    } else {
      let phone = "";
      if (customerData) {
        phone = customerData.data().contactNo
          ? customerData.data().contactNo
          : "";
      }
      // if subUserData is not there then bind followup details to followupData used for updating followup
      followupData = fetchFollowupDataVoxbay(
        followupData,
        phone,
        requestBody,
        incomingNumber,
        receivedNumber,
        followupDetails.incomingNumber
      );
    }
    // get customer data with incomingNumber

    // if customer data is there set customerName,companyName and customerId
    if (customerData) {
      let custName;
      if (customerData.data().secondName && customerData.data().surname) {
        custName =
          customerData.data().firstName +
          " " +
          customerData.data().secondName +
          " " +
          customerData.data().surname;
      } else if (
        customerData.data().secondName &&
        !customerData.data().surname
      ) {
        custName =
          customerData.data().firstName + " " + customerData.data().secondName;
      } else if (
        !customerData.data().secondName &&
        customerData.data().surname
      ) {
        custName =
          customerData.data().firstName + " " + customerData.data().surname;
      } else {
        custName = customerData.data().firstName;
      }

      followupData.customerName = custName;
      followupData.customerId = customerData.id;
      //companyName
      if (followupDetails.data().companyName) {
        followupData.companyName = followupDetails.data().companyName ? followupDetails.data().companyName : null;
      } else {
        followupData.companyName = customerData.data().companyName ? customerData.data().companyName : null;
      }
      //organisationId
      if (followupDetails.orgId) {
        followupData.orgId = followupDetails.data().orgId ? followupDetails.data().orgId : null;
      } else {
        followupData.orgId = customerData.data().orgId
          ? customerData.data().orgId
          : null;
      }

      if (!subUserData) {
        followupData.assignedTo = customerData.data().assignedTo
          ? customerData.data().assignedTo
          : "none";
        followupData.assignedToName = customerData.data().assignedToName
          ? customerData.data().assignedToName
          : "none";
        followupData.associatedBranch = customerData.data().associatedBranch
          ? customerData.data().associatedBranch
          : "none";
      }
    } else {
      if (
        (followupDetails.data().customerId && incomingNumber == null) ||
        (followupDetails.data().customerId && incomingNumber == "None")
      ) {
        followupData.customerName = followupDetails.data().customerName;
        followupData.companyName = followupDetails.data().companyName;
        followupData.customerId = followupDetails.data().customerId;
      } else {
        // if customer data and customer is not taggd in followup set customerName,companyName and customerId as "N/A"
        followupData.customerName = "N/A";
        followupData.companyName = "N/A";
        followupData.customerId = "N/A";
      }
      if (
        (followupDetails.data().orgId && incomingNumber == null) ||
        (followupDetails.data().orgId && incomingNumber == "None")
      ) {
        followupData.orgId = followupDetails.data().orgId;
      } else {
        followupData.orgId = "N/A";
      }

    }
    if (customerData) {
      if (
        customerData.data().assignedTo == "none" &&
        followupData.assignedTo != "none"
      ) {
        return await admin
          .firestore()
          .doc("users/" + userDetails.id + "/customers/" + customerData.id)
          .update({
            assignedTo: followupData.assignedTo,
            assignedToName: followupData.assignedToName,
            associatedBranch: followupData.associatedBranch,
          })
          .then((data) => {
            console.log("customerData.data().assignedTo ==== NONE Entered *******EVENT 4*******")
            return admin
              .firestore()
              .doc("users/" + userDetails.id + "/Follow Ups/" + followupId)
              .update({
                ...followupData, lastModifiedDate: new Date().getTime()
              })
              .then((data) => {
               console.log("FOLLOWUP UPDATED")
                if (
                  requestBody.callUUID &&
                  followupData.callDuration == 0 &&
                  followupData.assignedTo != "none"
                ) {
                  console.log("entered missed call1 *******EVENT 4*******");
                  return admin
                    .firestore()
                    .collection(
                      "users/" + followupData.assignedTo + "/Notifications"
                    )
                    .add({
                      message:
                        "You have a missed call from " + incomingNumber,
                      createdDate: Date.now(),
                      viewStatus: false,
                      docId: followupId,
                      type: "FollowUp",
                    })
                    .then((responsenotification) => {
                      console.log("added to notification collection");
                      res.send({
                        status: 200,
                        message: "success",
                      });
                    })
                    .catch((e) => {
                      console.log(e.message);
                    });
                } else {
                  res.send({
                    status: 200,
                    message: "success",
                  });
                }
              });
            // }
          });
      } else {
        console.log("customerData.data().assignedTo ==== NONE ELSE_BLOCK *******EVENT 4*******")
        return admin
          .firestore()
          .doc("users/" + userDetails.id + "/Follow Ups/" + followupId)
          .update({
            ...followupData, lastModifiedDate: new Date().getTime()
          })
          .then((data) => {
            console.log("FOLLOWUP UPDATED")
            if (
              requestBody.callUUID &&
              followupData.callDuration == 0 &&
              followupData.assignedTo != "none"
            ) {
              console.log("entered missed call2 *******EVENT 4*******");
              return admin
                .firestore()
                .collection(
                  "users/" + followupData.assignedTo + "/Notifications"
                )
                .add({
                  message: "You have a missed call from " + incomingNumber,
                  createdDate: Date.now(),
                  viewStatus: false,
                  docId: followupId,
                  type: "FollowUp",
                })
                .then((responsenotification) => {
                  res.send({
                    status: 200,
                    message: "success",
                  });
                  // }
                })
                .catch((e) => {
                  console.log(e.message);
                });
            } else {
              if (receivedNumber == null || receivedNumber == "None") {
                // if there is no receivedNumber update callerLastAssign
                return admin
                  .firestore()
                  .doc("users/" + userDetails.id)
                  .update({
                    callerLastAssign: callerLastAssign,
                  })
                  .then((datas) => {
                    res.send({
                      status: 200,
                      message: "success",
                    });
                  });
              } else {
                res.send({
                  status: 200,
                  message: "success",
                });
              }
            }
          });
        // }
      }
    } else {
      return admin
        .firestore()
        .doc("users/" + userDetails.id + "/Follow Ups/" + followupId)
        .update({
          ...followupData, lastModifiedDate: new Date().getTime()
        })
        .then((data) => {
          console.log("FOLLOWUP UPDATED IF NO CUSTOMER *******EVENT 4*******")
          if (
            requestBody.callUUID &&
            followupData.callDuration == 0 &&
            followupData.assignedTo != "none"
          ) {
            console.log("entered missed call3 ");
            return admin
              .firestore()
              .collection(
                "users/" + followupData.assignedTo + "/Notifications"
              )
              .add({
                message: "You have a missed call from " + incomingNumber,
                createdDate: Date.now(),
                viewStatus: false,
                docId: followupId,
                type: "FollowUp",
              })
              .then((responsenotification) => {
                res.send({
                  status: 200,
                  message: "success",
                });
                // }
              })
              .catch((e) => {
                console.log(e.message);
              });
          } else {
            if (receivedNumber == null || receivedNumber == "None") {
              // if there is no receivedNumber update callerLastAssign
              return admin
                .firestore()
                .doc("users/" + userDetails.id)
                .update({
                  callerLastAssign: callerLastAssign,
                })
                .then((datas) => {
                  res.send({
                    status: 200,
                    message: "success",
                  });
                });
            } else {
              res.send({
                status: 200,
                message: "success",
              });
            }
          }
        });
      // }
    }
  } else {
    console.log("NO FOLLOWUP DETAILS")
    // if there is no followupDetails
    if (incomingNumber && requestBody.callStartTime) {
      //if there is incomingNumber and StartTime
      let subUserData;
      // let callerLastAssign = 0;
      let customerData;
      customerData = await getCustomerWithPhoneNumber(
        userDetails.id,
        incomingNumber
      );
      if (!customerData) {
        customerData = await getCustomerWithAltPhoneNumber(
          userDetails.id,
          incomingNumber
        );
      }
      //newly added
      if (requestBody.callStartTime == null || requestBody.callStartTime == "None") {
        var today = new Date();
        let todayInv = dateWithDefaultTimeZone(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate(),
          0,
          0,
          0,
          0
        );
        followupData.callStartDate = todayInv;
      } else {
        // set call time and date
        let start = dateWithDefaultTimeZoneFromString(requestBody.callStartTime);
        let startDate = new Date(start);
        let callStartDate = dateWithDefaultTimeZone(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          Number(requestBody.callStartTime.split(" ")[1].split(":")[0]),
          Number(requestBody.callStartTime.split(" ")[1].split(":")[1]),
          0,
          0
        );
        followupData.callStartDate = callStartDate;
        followupData.callStartTime = `${requestBody.callStartTime.split(" ")[1].split(":")[0]
          }:${requestBody.callStartTime.split(" ")[1].split(":")[1]}`;
      }
      if (receivedNumber != null && receivedNumber != "None") {
        if (userDetails.data().phone == receivedNumber) {
          subUserData = userDetails;
        } else {
          let subList = await getSubUserDetails(userDetails.id, receivedNumber);
          subList.forEach((element) => {
            subUserData = element;
          })
        }
        // if call recieved user details is there set assignedTo and assignedToName
        if (subUserData) {
          if (userDetails.data().phone == receivedNumber) {
            followupData.associatedBranch = subUserData.data().associatedBranch ? subUserData.data().associatedBranch : 'none';
            followupData.assignedTo = subUserData.id;
          } else {
            followupData.associatedBranch = subUserData.data().branchId ? subUserData.data().branchId : 'none';
            followupData.assignedTo = subUserData.data().userId;
          }
          let name;
          if (subUserData.data().lastname) {
            name =
              subUserData.data().firstname + " " + subUserData.data().lastname;
          } else {
            name = subUserData.data().firstname;
          }
          followupData.assignedToName = name;
        } else {
          // if call recieved user details is not there set assignedTo and assignedToName as 'none'
          followupData.assignedTo = "none";
          followupData.assignedToName = "none";
          followupData.associatedBranch = "none";
        }
      } else {
        followupData.completedStatus = false;
      }
      if (subUserData) {
        // if subUserData is there then bind followup details to followupData used for updating followup
        let userPhone = ''
        if (userDetails.data().superUserId == subUserData.id) {

          userPhone = subUserData.data().phone
        } else {
          userPhone = subUserData.data().contactNo;
        }
        followupData = fetchFollowupDataVoxbay(
          followupData,
          userPhone,
          requestBody,
          incomingNumber,
          receivedNumber,
          null
        );
      } else {
        let phone = "";
        if (customerData) {
          phone = customerData.data().contactNo
            ? customerData.data().contactNo
            : "";
        }
        followupData = fetchFollowupDataVoxbay(
          followupData,
          phone,
          requestBody,
          incomingNumber,
          receivedNumber,
          null
        );
      }

      if (customerData) {
        let custName;
        if (customerData.data().secondName && customerData.data().surname) {
          custName =
            customerData.data().firstName +
            " " +
            customerData.data().secondName +
            " " +
            customerData.data().surname;
        } else if (
          customerData.data().secondName &&
          !customerData.data().surname
        ) {
          custName =
            customerData.data().firstName +
            " " +
            customerData.data().secondName;
        } else if (
          !customerData.data().secondName &&
          customerData.data().surname
        ) {
          custName =
            customerData.data().firstName + " " + customerData.data().surname;
        } else {
          custName = customerData.data().firstName;
        }
        followupData.customerName = custName;
        followupData.companyName = customerData.data().companyName;
        followupData.customerId = customerData.id;
        followupData.orgId = customerData.data().orgId
          ? customerData.data().orgId
          : "";

        if (!subUserData) {
          followupData.assignedTo = customerData.data().assignedTo
            ? customerData.data().assignedTo
            : "none";
          followupData.assignedToName = customerData.data().assignedToName
            ? customerData.data().assignedToName
            : "none";
          followupData.associatedBranch = customerData.data().associatedBranch
            ? customerData.data().associatedBranch
            : "none";
        }
      } else {
        followupData.customerName = "N/A";
        followupData.companyName = "N/A";
        followupData.customerId = "N/A";
        followupData.orgId = "N/A";
      }
      if (customerData) {
        if (
          customerData.data().assignedTo == "none" &&
          followupData.assignedTo != "none"
        ) {
          return await admin
            .firestore()
            .doc("users/" + userDetails.id + "/customers/" + customerData.id)
            .update({
              assignedTo: followupData.assignedTo,
              assignedToName: followupData.assignedToName,
              associatedBranch: followupData.associatedBranch,
            })
            .then((data) => {
          console.log("ASSIGNED TO NONE (NO FOLLOWUP) ")
              return admin
                .firestore()
                .collection("users/" + userDetails.id + "/Follow Ups")
                .add({ ...followupData, dateCreated: Date.now(), lastModifiedDate: new Date().getTime() })
                .then(async (data) => {
                  console.log("ASSIGNED TO NONE (NO FOLLOWUP) FOLLOWUP UPDATED *******EVENT 4*******")
                  if (
                    requestBody.CallUUID &&
                    requestBody.status != "Connected" &&
                    followupData.callDuration == 0 &&
                    followupData.assignedTo != "none"
                  ) {
                    console.log("entered missed call4 *******EVENT 4*******");
                    return await admin
                      .firestore()
                      .collection(
                        "users/" + followupData.assignedTo + "/Notifications"
                      )
                      .add({
                        message:
                          "You have a missed call from " + incomingNumber,
                        createdDate: Date.now(),
                        viewStatus: false,
                        docId: data.id,
                        type: "FollowUp",
                      })
                      .then((responsenotification) => {
                        if (
                          receivedNumber == null ||
                          receivedNumber == "None"
                        ) {
                          return admin
                            .firestore()
                            .doc("users/" + userDetails.id)
                            .update({
                              callerLastAssign: callerLastAssign,
                            })
                            .then((datas) => {
                              res.send({
                                status: 200,
                                message: "success",
                              });
                            });
                        } else {
                          res.send({
                            status: 200,
                            message: "success",
                          });
                        }
                      })
                      .catch((e) => {
                        console.log(e.message);
                      });
                  } else {
                    if (receivedNumber == null || receivedNumber == "None") {
                      return admin
                        .firestore()
                        .doc("users/" + userDetails.id)
                        .update({
                          callerLastAssign: callerLastAssign,
                        })
                        .then((datas) => {
                          res.send({
                            status: 200,
                            message: "success",
                          });
                        });
                    } else {
                      res.send({
                        status: 200,
                        message: "success",
                      });
                    }
                  }
                });
            });
        } else {
          return admin
            .firestore()
            .collection("users/" + userDetails.id + "/Follow Ups")
            .add({ ...followupData, dateCreated: Date.now(), lastModifiedDate: new Date().getTime() })
            .then(async (data) => {
          console.log("ASSIGNED TO NONE ELSE BLOCK (NO FOLLOWUP) FLWUP UPDATED *******EVENT 4*******")
              if (
                requestBody.status != "Connected" &&
                followupData.callDuration == 0 &&
                followupData.assignedTo != "none"
              ) {
                console.log("entered missed call5 ");
                return await admin
                  .firestore()
                  .collection(
                    "users/" + followupData.assignedTo + "/Notifications"
                  )
                  .add({
                    message: "You have a missed call from " + incomingNumber,
                    createdDate: Date.now(),
                    viewStatus: false,
                    docId: data.id,
                    type: "FollowUp",
                  })
                  .then((responsenotification) => {
                    if (receivedNumber == null || receivedNumber == "None") {
                      return admin
                        .firestore()
                        .doc("users/" + userDetails.id)
                        .update({
                          callerLastAssign: callerLastAssign,
                        })
                        .then((datas) => {
                          res.send({
                            status: 200,
                            message: "success",
                          });
                        });
                    } else {
                      res.send({
                        status: 200,
                        message: "success",
                      });
                    }
                  })
                  .catch((e) => {
                    console.log(e.message);
                  });
              } else {
                if (receivedNumber == null || receivedNumber == "None") {
                  return admin
                    .firestore()
                    .doc("users/" + userDetails.id)
                    .update({
                      callerLastAssign: callerLastAssign,
                    })
                    .then((datas) => {
                      res.send({
                        status: 200,
                        message: "success",
                      });
                    });
                } else {
                  res.send({
                    status: 200,
                    message: "success",
                  });
                }
              }
            });
        }
      } else {
        // / if customer data is not there set customerName,companyName and customerId as "N/A"
        followupData.customerName = followupData.customerName ? followupData.customerName : "inb_call_lead";
        followupData.companyName = followupData.companyName ? followupData.companyName : "N/A";
        followupData.orgId = followupData.orgId ? followupData.orgId : null;
        followupData.associatedBranch = followupData.associatedBranch ? followupData.associatedBranch : "none";
        followupData.assignedTo = followupData.assignedTo ? followupData.assignedTo : "none";
        followupData.assignedToName = followupData.assignedToName ? followupData.assignedToName : "none";
        followupData.contactNumber = incomingNumber;
        followupData.countryCode = '+91';
        await createInb_Call_LeadVoxbay(
          incomingNumber,
          receivedNumber,
          userDetails.id,
          followupData,
          userDetails,
          res,
          requestBody
        );
      }
    } else {
      res.status(404).send({
        status: 404,
        message: "no data available",
      });
    }
  }
}
//voxbaynew modidifcations ends here

async function createFollowUp(
  requestBody,
  receivedNumber,
  incomingNumber,
  followupData,
  userDetails,
  res
) {
  if (incomingNumber) {
    followupData.sourceNumber = incomingNumber; // set incoming number as sourceNumber
  }
  if (receivedNumber) {
    followupData.destinationNumber = receivedNumber; // set received number as destinationNumber
  }
  if (requestBody.DisplayNumber) {
    followupData.displayNumber = requestBody.DisplayNumber;
  }
  // if (requestBody.StartTime) {
  // if start time is none the set callStartDate as todays date
  if (requestBody.StartTime == null || requestBody.StartTime == "None") {
    var today = new Date();
    let todayInv = dateWithDefaultTimeZone(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0,
      0,
      0,
      0
    );
    followupData.callStartDate = todayInv;
  } else {
    // set call time and date
    let start = dateWithDefaultTimeZoneFromString(requestBody.StartTime);
    let startDate = new Date(start);
    let callStartDate = dateWithDefaultTimeZone(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      Number(requestBody.StartTime.split(" ")[1].split(":")[0]),
      Number(requestBody.StartTime.split(" ")[1].split(":")[1]),
      0,
      0
    );
    followupData.callStartDate = callStartDate;
    followupData.callStartTime = `${
      requestBody.StartTime.split(" ")[1].split(":")[0]
    }:${requestBody.StartTime.split(" ")[1].split(":")[1]}`;
  }
  // }
  if (requestBody.DataSource) {
    followupData.dataSource = requestBody.DataSource;
  }
  // used to update folloup in callType 1 or 2
  if (requestBody.callID) {
    followupData.callID = requestBody.callID;
  }
  // here there is no user picked the call
  followupData.completedStatus = false;
  let customerData;
  customerData = await getCustomerWithPhoneNumber(
    userDetails.id,
    incomingNumber
  );
  if (!customerData) {
    customerData = await getCustomerWithAltPhoneNumber(
      userDetails.id,
      incomingNumber
    );
    if(customerData){
      followupData.contactNumber = customerData.data().alternateContactNumber
      ? customerData.data().alternateContactNumber
      : '';
    followupData.countryCode = customerData.data().altContactCode
      ? customerData.data().altContactCode
      : '';
    }

  }else{
    followupData.contactNumber = customerData.data().contactNo
    ? customerData.data().contactNo
    : '';
  followupData.countryCode = customerData.data().code
    ? customerData.data().code
    : '';
  }
  if (customerData) {
    // if customer data is there set customerName,companyName and customerId
    let custName;
    if (customerData.data().secondName && customerData.data().surname) {
      custName =
        customerData.data().firstName +
        " " +
        customerData.data().secondName +
        " " +
        customerData.data().surname;
    } else if (customerData.data().secondName && !customerData.data().surname) {
      custName =
        customerData.data().firstName + " " + customerData.data().secondName;
    } else if (!customerData.data().secondName && customerData.data().surname) {
      custName =
        customerData.data().firstName + " " + customerData.data().surname;
    } else {
      custName = customerData.data().firstName;
    }
    followupData.customerName = custName;
    followupData.companyName = customerData.data().companyName;
    followupData.customerId = customerData.id;
    followupData.orgId = customerData.data().orgId
      ? customerData.data().orgId
      : "";
    followupData.associatedBranch = customerData.data().associatedBranch
      ? customerData.data().associatedBranch
      : "none";
    followupData.assignedTo = customerData.data().assignedTo
      ? customerData.data().assignedTo
      : "none";
    followupData.assignedToName = customerData.data().assignedToName
      ? customerData.data().assignedToName
      : "none";

    // save followup and the send success message
    return admin
      .firestore()
      .collection("users/" + userDetails.id + "/Follow Ups")
      .add({
        ...followupData,
        dateCreated: Date.now(),
        assignedToDate: new Date().getTime(),
        lastModifiedDate: new Date().getTime()
      })
      .then((data) => {
        res.send({
          status: 200,
          message: "success",
        });
      });
  } else {
    // if customer data is not there set customerName,companyName and customerId as "N/A"
    followupData.customerName = "inb_call_lead";
    followupData.companyName = "N/A";
    followupData.orgId = "N/A";
    followupData.associatedBranch = "none";
    followupData.assignedTo = "none";
    followupData.assignedToName = "none";
    followupData.contactNumber = incomingNumber;
    followupData.countryCode = '';
    createInb_Call_Lead(
      incomingNumber,
      userDetails.id,
      followupData,
      userDetails,
      res
    );
  }
}
function fetchFollowupData(
  followupData,
  subUserNumber,
  requestBody,
  incomingNumber,
  receivedNumber,
  incNUmber
) {
  // bind all details from requestBody
  if (requestBody.Direction) {
    followupData.direction = requestBody.Direction;
  }
  if (requestBody.eventID) {
    // in case of autocall scenario set receivedNumber as sourceNumber and incomingNumber as destinationNumber
    if (receivedNumber) {
      followupData.sourceNumber = receivedNumber;
    }
    if (incomingNumber != null && incomingNumber != "None") {
      followupData.destinationNumber = incomingNumber;
    } else {
      followupData.completedStatus = false;
      followupData.destinationNumber = incNUmber;
    }
  } else {
    // in case of ivr scenario set incomingNumber as sourceNumber and receivedNumber as destinationNumber
    if (incomingNumber) {
      followupData.sourceNumber = incomingNumber;
    }
    if (receivedNumber != null && receivedNumber != "None") {
      followupData.destinationNumber = receivedNumber;
    } else {
      followupData.destinationNumber = subUserNumber;
      followupData.completedStatus = false;
    }
  }
  if (requestBody.DisplayNumber) {
    followupData.displayNumber = requestBody.DisplayNumber;
  }
  if (requestBody.CallDuration) {
    followupData.callDuration = Number(requestBody.CallDuration);
  }
  if (followupData.callDuration == 0) {
    followupData.callConnected = false;
  } else if (followupData.callDuration > 0) {
    followupData.callConnected = true;
  }
  if (requestBody.DataSource) {
    followupData.dataSource = requestBody.DataSource;
  }
  if (requestBody.ResourceURL) {
    followupData.resourceURL = requestBody.ResourceURL;
  }
  if (requestBody.eventID) {
    followupData.eventID = requestBody.eventID;
  }
  if (requestBody.callID) {
    followupData.callID = requestBody.callID;
  }
  // if StartTime is none set StartTime as todays date
  if (requestBody.StartTime == null || requestBody.StartTime == "None") {
    var today = new Date();
    let todayStartInv = dateWithDefaultTimeZone(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0,
      0,
      0,
      0
    );
    followupData.callStartDate = todayStartInv;
  } else {
    // bind date adn time in separate fields
    let start = dateWithDefaultTimeZoneFromString(requestBody.StartTime);
    let startDate = new Date(start);
    let callStartDate = dateWithDefaultTimeZone(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      Number(requestBody.StartTime.split(" ")[1].split(":")[0]),
      Number(requestBody.StartTime.split(" ")[1].split(":")[1]),
      0,
      0
    );
    followupData.callStartDate = callStartDate;
    followupData.callStartTime = `${
      requestBody.StartTime.split(" ")[1].split(":")[0]
    }:${requestBody.StartTime.split(" ")[1].split(":")[1]}`;
  }
  // if EndTime is none set EndTime as todays date
  if (requestBody.EndTime == null || requestBody.EndTime == "None") {
    var today = new Date();
    let todayEndDate = dateWithDefaultTimeZone(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
      0,
      0,
      0,
      0
    );
    followupData.callEndDate = todayEndDate;
  } else {
    // bind date adn time in separate fields
    let ends = dateWithDefaultTimeZoneFromString(requestBody.EndTime);
    let endDate = new Date(ends);
    let callEndDate = dateWithDefaultTimeZone(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      Number(requestBody.EndTime.split(" ")[1].split(":")[0]),
      Number(requestBody.EndTime.split(" ")[1].split(":")[1]),
      0,
      0
    );
    followupData.callEndDate = callEndDate;
    followupData.callEndTime = `${
      requestBody.EndTime.split(" ")[1].split(":")[0]
    }:${requestBody.EndTime.split(" ")[1].split(":")[1]}`;
  }
  console.log("duration " + followupData.callDuration);
  console.log("fetch data call type " + requestBody.callType);
  // if call is connected set status as Connected
  if (followupData.callDuration > 0) {
    console.log("entered connected block");
    followupData.status = "Connected";
  }
  // if call is missed set status as Missed
  if (requestBody.callType == "2" && followupData.callDuration == 0) {
    console.log("entered missed block");
    followupData.status = "Missed";
  }

  return followupData;
}

// new starts here - fieldName has to be included
// function to add in email collection and thus to send an email
function sendNotificationMail(emailData) {
  console.log("send notification email fn");
  admin
    .firestore()
    .collection("email")
    .add(emailData)
    .then((data) => {
      console.log("email sent");
    })
    .catch((e) => {
      console.log("error", e);
    });
}

async function createInb_Call_Lead(
  incomingNumber,
  superUserId,
  followupData,
  userDetails,
  res
) {
  await admin
    .firestore()
    .doc("users/" + superUserId)
    .get()
    .then(async (data) => {
      let superUserdata = data.data();
    await admin
    .firestore()
    .doc("users/" + superUserId+"/pipelines/customerPipelines")
    .get()
    .then(async (custPipeline) => {
      let customerPipelines = custPipeline.data().customerPipelines;

      let contactSequentialNumber = 0;
      if (superUserdata.contactSequentialNumber) {
        contactSequentialNumber = superUserdata.contactSequentialNumber;
      }
      let searchTerm = {
        companyName: "",
        firstName: "inb_call_lead",
        secondName: "",
        surname: "",
      };

      //increment the contact sequence no
      if (contactSequentialNumber) {
        contactSequenceNumber = contactSequentialNumber + 1;
      } else {
        contactSequenceNumber = 1;
      }
      let status = customerPipelines[0].pipelineStages[0].stageId;
      let lost =false;
      let won =false;
      let inPipeline =false;
      if (
        status ===
        customerPipelines[0].pipelineStages[customerPipelines[0].pipelineStages.length - 1].stageId
      ) {
        lost = true;
        won = false;
        inPipeline = false;
      } else if (
        status ===
        customerPipelines[0].pipelineStages[customerPipelines[0].pipelineStages.length - 2].stageId
      ) {
        lost = false;
        won = true;
        inPipeline = false;
      } else {
        lost = false;
        won = false;
        inPipeline = true;
      }

      let contactStageHistory = [
        {
          date: new Date().getTime(),
          stageId: customerPipelines[0].pipelineStages[0].stageId,
          pipelineId: customerPipelines[0].pipelineId,
        },
      ];
      let changeLog = [];
      changeLog[0] = {
        changedBy: "none",
        changedByName: "none",
        changesFrom: "IVR",
        dateModified: new Date().getTime(),
        currentValues: "",
        previousValues: "",
      };
      let contactAddtFields = []; //to save superuser contact additional field
      let contactAddFArray = {}; // to create additionalFieldsArr field of contact document
      // contact additional field code changes starts here
      if (!!superUserdata.customFieldsContact) {
        contactAddtFields = superUserdata.customFieldsContact;
      }
      contactAddtFields.forEach((field, index) => {
        contactAddFArray[index] = {
          fieldValue: field.defaultValue,
        };
      });
      let contactDetails = {
        altContactCode: "+91",
        alternateContactNumber: "",
        billingaddress1: "",
        billingaddress2: "",
        bpin: "",
        code: "+91",
        companyName: "", //use in sales sample data also
        contactNo: incomingNumber,
        country: "",
        department: "",
        district: "",
        email: "",
        firstName: "inb_call_lead",
        surname: "",
        salutation: "",
        secondName: "",
        taxId: "",
        state: "",
        priority: "Medium",
        inPipeline: inPipeline,
        won: won,
        lost: lost,
        ongoingSales: 0,
        salePipelineValue: 0,
        saleOngoingValue: 0,
        collectedAmount: 0,
        sequenceNumber: contactSequenceNumber,
        invoicedAmount: 0,
        totalAmountCollected: 0,
        followUpFlag: 0,
        orgId: "",
        isCompany: false,
        selectedContactPipeline: customerPipelines[0].pipelineId,
        status: status,
        custLeadValue: "Inbound call",
        associatedBranch: "none",
        assignedTo: "none",
        assignedToName: "none",
        createdBy: superUserId,
        changeLog: changeLog,
        createdYear: new Date().getFullYear(),
        currentStatusDate: new Date().getTime(),
        dateCreated: new Date().getTime(),
        month: new Date().getMonth(),
        searchTerm: searchTerm,
        stageHistory: contactStageHistory,
        lastModifiedDate: new Date().getTime(),
        additionalFieldsArr: contactAddFArray,
        assignedToDate: new Date().getTime(),
      };
      await admin
        .firestore()
        .collection("users/" + superUserId + "/customers")
        .add({
          ...contactDetails,
        })
        .then(async (respond) => {
          followupData.customerId = respond.id;
          await admin
            .firestore()
            .doc("users/" + superUserId)
            .update({
              contactSequentialNumber: contactSequenceNumber,
            })
            .then((resp) => {
              // save followup and the send success message
              return admin
                .firestore()
                .collection("users/" + userDetails.id + "/Follow Ups")
                .add({
                  ...followupData,
                  dateCreated: Date.now(),
                  assignedToDate: new Date().getTime(),
                  lastModifiedDate: new Date().getTime()
                })
                .then((data) => {
                  res.send({
                    status: 200,
                    message: "success",
                  });
                });
            });
        });
    });
    });
}
async function createInb_Call_LeadVoxbay(
  incomingNumber,
  receivedNumber,
  superUserId,
  followupData,
  userDetails,
  res,
  requestBody
) {
  // console.log("createInb_Call_LeadVoxbay",followupData)
  await admin
    .firestore()
    .doc("users/" + superUserId)
    .get()
    .then(async (data) => {
      let superUserdata = data.data();
      await admin
        .firestore()
        .doc("users/" + superUserId + "/pipelines/customerPipelines")
        .get()
        .then(async (custPipeline) => {
          let customerPipelines = custPipeline.data().customerPipelines;
          let contactSequentialNumber = 0;
          if (superUserdata.contactSequentialNumber) {
            contactSequentialNumber = superUserdata.contactSequentialNumber;
          }
          let searchTerm = {
            companyName: "",
            firstName: "inb_call_lead",
            secondName: "",
            surname: "",
          };

          //increment the contact sequence no
          if (contactSequentialNumber) {
            contactSequenceNumber = contactSequentialNumber + 1;
          } else {
            contactSequenceNumber = 1;
          }

          let status = customerPipelines[0].pipelineStages[0].stageId;
          let lost =false;
          let won =false;
          let inPipeline =false;
          if (
            status ===
            customerPipelines[0].pipelineStages[customerPipelines[0].pipelineStages.length - 1].stageId
          ) {
            lost = true;
            won = false;
            inPipeline = false;
          } else if (
            status ===
            customerPipelines[0].pipelineStages[customerPipelines[0].pipelineStages.length - 2].stageId
          ) {
            lost = false;
            won = true;
            inPipeline = false;
          } else {
            lost = false;
            won = false;
            inPipeline = true;
          }

          let contactStageHistory = [
            {
              date: new Date().getTime(),
              stageId: customerPipelines[0].pipelineStages[0].stageId,
              pipelineId: customerPipelines[0].pipelineId,
            },
          ];
          let changeLog = [];
          changeLog[0] = {
            changedBy: "none",
            changedByName: "none",
            changesFrom: "IVR",
            dateModified: new Date().getTime(),
            currentValues: "",
            previousValues: "",
          };
          let contactAddtFields = []; //to save superuser contact additional field
          let contactAddFArray = {}; // to create additionalFieldsArr field of contact document
          // contact additional field code changes starts here
          if (!!superUserdata.customFieldsContact) {
            contactAddtFields = superUserdata.customFieldsContact;
          }
          contactAddtFields.forEach((field, index) => {
            contactAddFArray[index] = {
              fieldValue: field.defaultValue,
            };
          });
          let contactDetails = {
            altContactCode: "+91",
            alternateContactNumber: "",
            billingaddress1: "",
            billingaddress2: "",
            bpin: "",
            code: "+91",
            companyName: "", //use in sales sample data also
            contactNo: incomingNumber,
            country: "",
            department: "",
            district: "",
            email: "",
            firstName: "inb_call_lead",
            surname: "",
            salutation: "",
            secondName: "",
            taxId: "",
            state: "",
            priority: "Medium",
            inPipeline: inPipeline,
            won: won,
            lost: lost,
            ongoingSales: 0,
            salePipelineValue: 0,
            saleOngoingValue: 0,
            collectedAmount: 0,
            sequenceNumber: contactSequenceNumber,
            invoicedAmount: 0,
            totalAmountCollected: 0,
            followUpFlag: 0,
            orgId: "",
            isCompany: false,
            selectedContactPipeline: customerPipelines[0].pipelineId,
            status: status,
            custLeadValue: "Inbound call",
            associatedBranch: followupData.associatedBranch,
            assignedTo: followupData.assignedTo,
            assignedToName: followupData.assignedToName,
            createdBy: superUserId,
            changeLog: changeLog,
            createdYear: new Date().getFullYear(),
            currentStatusDate: new Date().getTime(),
            dateCreated: new Date().getTime(),
            month: new Date().getMonth(),
            searchTerm: searchTerm,
            stageHistory: contactStageHistory,
            lastModifiedDate: new Date().getTime(),
            additionalFieldsArr: contactAddFArray,
            assignedToDate: new Date().getTime(),
          };
      // console.log("REQUEST BODY 3(createInb_Call_LeadVoxbay)",requestBody)

          await admin
            .firestore()
            .collection("users/" + superUserId + "/customers")
            .add({
              ...contactDetails,
            })
            .then(async (respond) => {
              console.log("createInb_Call_LeadVoxbay***** ___ Customer created in db ",)
              followupData.customerId = respond.id;
              await admin
                .firestore()
                .doc("users/" + superUserId)
                .update({
                  contactSequentialNumber: contactSequenceNumber,
                })
                .then((resp) => {
                  return admin
                    .firestore()
                    .collection("users/" + superUserId + "/Follow Ups")
                    .add({ ...followupData, dateCreated: Date.now(), lastModifiedDate: new Date().getTime() })
                    .then(async (data) => {
                      console.log("createInb_Call_LeadVoxbay***** ___ FOLLOWUP created in db under customer",)

                      if (
                        requestBody.status != "Connected" &&
                        followupData.callDuration == 0 &&
                        followupData.assignedTo != "none"
                      ) {
                        console.log("entered missed call6 ");
                        console.log("followupData.assignedTo", followupData.assignedTo)
                        return await admin
                          .firestore()
                          .collection(
                            "users/" + followupData.assignedTo + "/Notifications"
                          )
                          .add({
                            message: "You have a missed call from " + incomingNumber,
                            createdDate: Date.now(),
                            viewStatus: false,
                            docId: data.id,
                            type: "FollowUp",
                          })
                          .then((responsenotification) => {
                            if (receivedNumber == null || receivedNumber == "None") {
                              return admin
                                .firestore()
                                .doc("users/" + superUserId)
                                .update({
                                  callerLastAssign: callerLastAssign,
                                })
                                .then((datas) => {
                                  res.send({
                                    status: 200,
                                    message: "success",
                                  });
                                });
                            } else {
                              res.send({
                                status: 200,
                                message: "success",
                              });
                            }
                          })
                          .catch((e) => {
                            console.log(e.message);
                          });
                      } else {
                        if (receivedNumber == null || receivedNumber == "None") {
                          return admin
                            .firestore()
                            .doc("users/" + superUserId14)
                            .update({
                              callerLastAssign: callerLastAssign,
                            })
                            .then((datas) => {
                              res.send({
                                status: 200,
                                message: "success",
                              });
                            });
                        } else {
                          res.send({
                            status: 200,
                            message: "success",
                          });
                        }
                      }
                    });

                });
            });
        });
    })
}
// fn to send email if createdby != assigned to on a contact create
exports.contactCreated = functions
  .region(region)
  .firestore.document("/users/{userId}/customers/{documentId}")
  .onCreate((snap, context) => {
    return new Promise((resolve, reject) => {
    var contact = snap.data();
    const userId = context.params.userId; //superUserId
    const docId = context.params.documentId;
    let fieldName = "Contact";
    let assignedToEmail;

    if (contact) {
      console.log("email blocked code", contact.createdBy, contact.assignedTo);
      // if(typeof contact.uploadedType !=='undefined' && !!contact.uploadedType && contact.uploadedType === 'singleAddition'){
      if (contact.createdBy !== contact.assignedTo) {
        // fetch email of assignedto person and send a mail
        getassignedToUser(contact.assignedTo).then((assUser) => {
          if (assUser) {
            console.log(assUser.email);
            assignedToEmail = assUser.email;

            if (assignedToEmail) {
              // need to fetch created by details for name
              getassignedToUser(contact.createdBy).then((createdByUser) => {
                if (createdByUser) {
                  if (contact.assignedTo == userId) {
                    fieldName = assUser.fieldNames.fieldNameContact;
                  } else if (contact.createdBy == userId) {
                    fieldName = createdByUser.fieldNames.fieldNameContact;
                  } else {
                    // need to fetch superuserdetails for fieldnames
                    getassignedToUser(userId).then((superUser) => {
                      fieldName = superUser.fieldNames.fieldNameContact;
                    });
                  }
                  let emailData = {
                    to: assignedToEmail,
                    template: {
                      name: "newContactAssigned",
                      data: {
                        fieldName: fieldName,
                        contName: contact.secondName
                          ? contact.firstName + " " + contact.secondName
                          : contact.firstName,
                        orgName: contact.companyName,
                        createdBy: createdByUser.lastname
                          ? createdByUser.firstname +
                            " " +
                            createdByUser.lastname
                          : createdByUser.firstname,
                        dateCreated: dateFormat(contact.dateCreated),
                        assignedToName: contact.assignedToName,
                      },
                    },
                  };
                  console.log("emailData", emailData);

                  let message = `New ${fieldName} named ${emailData.template.data.contName} created on ${emailData.template.data.dateCreated} has been assigned to you`;


                  addToNotification(
                    message,
                    "Contact",
                    docId,
                    contact.assignedTo
                  );

                  // no need to send email if contact is created via CSV
                  if (
                    typeof contact.createdMode !== "undefined" &&
                    !!contact.createdMode &&
                    contact.createdMode === "CSVUpload"
                  ) {
                    // do nothing
                  } else {
                    sendNotificationMail(emailData);
                  }
                }
              });
            }
            //push Notif
            getassignedToUser(contact.createdBy).then((createdByUser) => {
              if (createdByUser) {
                if (contact.assignedTo == userId) {
                  fieldName = assUser.fieldNames.fieldNameContact;
                } else if (contact.createdBy == userId) {
                  fieldName = createdByUser.fieldNames.fieldNameContact;
                } else {
                  // need to fetch superuserdetails for fieldnames
                  getassignedToUser(userId).then((superUser) => {
                    fieldName = superUser.fieldNames.fieldNameContact;
                  });
                }
                let assignedTo = contact.assignedTo;
                let contactName = contact.secondName
                  ? contact.firstName + " " + contact.secondName
                  : contact.firstName;
                let assigednToNotif = `${fieldName}: ${contactName} created by ${createdByUser.firstname} have been assinged to you`;
                if (contact.createdBy != assignedTo) {
                  let navUrl = `contact/customerdetails/${docId}`;
                  sendPushNotificationToUser(
                    assigednToNotif,
                    assignedTo,
                    docId,
                    navUrl
                  );
                }
              }
            });
          }
        });
      }
      // }
    }
    resolve();
  }).catch((error) => {
    console.error("Error:", error);
    reject(error);
  });
  });

// to send email if assigned to change while editing a contact
exports.contactEdited = functions
  .region(region)
  .firestore.document("/users/{userId}/customers/{documentId}")
  .onUpdate((change, context) => {
    return new Promise((resolve, reject) => {
    const userId = context.params.userId; //superUserId
    const docId = context.params.documentId;
    let fieldName = "Contact";
    const newContData = change.after.data();
    var prevContData = change.before.data();
    // const signedInUserId = context.auth.uid;
    // console.log("signedInUserId",signedInUserId);
    if (newContData.assignedTo !== prevContData.assignedTo) {
      // fetch email of assignedto person and send a mail
      getassignedToUser(newContData.assignedTo).then((assUser) => {
        if (assUser) {
          console.log(assUser.userId);
          assignedToEmail = assUser.email;
          if (assignedToEmail) {
            // need to fetch created by details for name
            getassignedToUser(newContData.createdBy).then((createdByUser) => {
              if (createdByUser) {
                // console.log(
                //   "createdByUser",
                //   createdByUser.firstname,
                //   createdByUser.lastname
                // );
                if (newContData.assignedTo == userId) {
                  fieldName = assUser.fieldNames.fieldNameContact;
                  console.log(fieldName);
                } else if (newContData.createdBy == userId) {
                  fieldName = createdByUser.fieldNames.fieldNameContact;
                  console.log(fieldName);
                } else {
                  // need to fetch superuserdetails for fieldnames
                  getassignedToUser(userId).then((superUser) => {
                    fieldName = superUser.fieldNames.fieldNameSale;
                  });
                }
                let emailData = {
                  to: assignedToEmail,
                  template: {
                    name: "reAssignContact",
                    data: {
                      fieldName: fieldName,
                      contName: newContData.secondName
                        ? newContData.firstName + " " + newContData.secondName
                        : newContData.firstName,
                      orgName: newContData.companyName,
                      createdBy: createdByUser.lastname
                        ? createdByUser.firstname + " " + createdByUser.lastname
                        : createdByUser.firstname,
                      dateCreated: dateFormat(newContData.dateCreated),
                      assignedToName: newContData.assignedToName,
                    },
                  },
                };
                // console.log("emailData", emailData);

                let message = `${fieldName} named ${emailData.template.data.contName} created on ${emailData.template.data.dateCreated} has been re-assigned to you`;
                // console.log("notification msg", message);

                addToNotification(
                  message,
                  "Contact",
                  docId,
                  newContData.assignedTo
                );
                sendNotificationMail(emailData);
              }
            });
          }
          //push Notif
          getassignedToUser(newContData.createdBy).then((createdByUser) => {
            if (createdByUser) {
              if (newContData.assignedTo == userId) {
                fieldName = assUser.fieldNames.fieldNameContact;
                console.log(fieldName);
              } else if (newContData.createdBy == userId) {
                fieldName = createdByUser.fieldNames.fieldNameContact;
                console.log(fieldName);
              } else {
                // need to fetch superuserdetails for fieldnames
                getassignedToUser(userId).then((superUser) => {
                  fieldName = superUser.fieldNames.fieldNameSale;
                });
              }
              //push notification
              let assignedTo = newContData.assignedTo;
              let contactName = newContData.secondName
                ? newContData.firstName + " " + newContData.secondName
                : newContData.firstName;
              let assigednToNotif = `${fieldName}: ${contactName} created by ${createdByUser.firstname} have been reassinged to you`;
              let collName = "customers";
              console.log(" newContData.createdBy", newContData.createdBy);
              console.log(" assignedTo", assignedTo);
              if (newContData.createdBy != assignedTo) {
                let navUrl = `contact/customerdetails/${docId}`;
                sendPushNotificationToUser(
                  assigednToNotif,
                  assignedTo,
                  docId,
                  navUrl
                );
              }
            }
          });
        }
      });
    }
    resolve();
  }).catch((error) => {
    console.error("Error:", error);
    reject(error);
  });
  });

// fn to send email if createdby != assigned to on a sale create
exports.saleCreated = functions
  .region(region)
  .firestore.document("/users/{userId}/sales/{documentId}")
  .onCreate((snap, context) => {
    return new Promise((resolve, reject) => {
    const sale = snap.data();
    const userId = context.params.userId; //superUserId
    let fieldName = "Sale";
    const docId = context.params.documentId;
    let assignedToEmail;
    let superUserTimeZone;

    if (sale) {
      console.log(sale.createdBy, sale.assignedTo);
      if (sale.createdBy !== sale.assignedTo) {
        getSalePipelines(userId).then(salePipeline=>{
          salePipelines = salePipeline.salePipelines;
        // fetch email of assignedto person and send a mail
        getassignedToUser(sale.assignedTo).then((assUser) => {
          if (assUser) {
            console.log(assUser.email);
            assignedToEmail = assUser.email;
            if (assignedToEmail) {
              getassignedToUser(sale.createdBy).then((createdByUser) => {
                if (createdByUser) {
                  if (sale.assignedTo == userId) {
                    fieldName = assUser.fieldNames.fieldNameSale; //assigned to superuser case
                    superUserTimeZone = assUser.timeZone;
                  } else if (sale.createdBy == userId) {
                    fieldName = createdByUser.fieldNames.fieldNameSale; //created by superuser case
                    superUserTimeZone = createdByUser.timeZone;
                  } else {
                    // need to fetch superuserdetails for fieldnames
                    getassignedToUser(userId).then((superUser) => {
                      //assigned to and created by both are subuser case
                      fieldName = superUser.fieldNames.fieldNameSale;
                      superUserTimeZone = superUser.timeZone;
                    });
                  }
                  let emailData = {
                    to: assignedToEmail,
                    template: {
                      name: "newSaleAssigned",
                      data: {
                        fieldName: fieldName,
                        saleTitle: sale.saleTitle,
                        stage: getStatusName(salePipelines, sale.selectedSalePipeline,sale.salesStage),
                        startDate: convertDate(
                          sale.startDate,
                          superUserTimeZone
                        ),
                        expCompletionDate: convertDate(
                          sale.expCompletionDate,
                          superUserTimeZone
                        ),
                        createdBy: createdByUser.lastname
                          ? createdByUser.firstname +
                            " " +
                            createdByUser.lastname
                          : createdByUser.firstname,
                        dateCreated: dateFormat(sale.createdDate),
                        assignedToName: sale.assignedToName,
                      },
                    },
                  };
                  console.log("emailData", emailData);

                  let message = `${fieldName} : ${emailData.template.data.saleTitle}, stage ${emailData.template.data.stage}, startDate: ${emailData.template.data.startDate}, expected Completion Date: ${emailData.template.data.expCompletionDate} created on ${emailData.template.data.dateCreated} has been assigned to you`;
                  console.log("notification msg", message);

                  addToNotification(message, "Sale", docId, sale.assignedTo);

                  sendNotificationMail(emailData);
                }
              });
            }
            //push notif
            getassignedToUser(sale.createdBy).then((createdByUser) => {
              if (createdByUser) {
                if (sale.assignedTo == userId) {
                  fieldName = assUser.fieldNames.fieldNameSale; //assigned to superuser case
                } else if (sale.createdBy == userId) {
                  fieldName = createdByUser.fieldNames.fieldNameSale; //created by superuser case
                } else {
                  // need to fetch superuserdetails for fieldnames
                  getassignedToUser(userId).then((superUser) => {
                    //assigned to and created by both are subuser case
                    fieldName = superUser.fieldNames.fieldNameSale;
                    superUserTimeZone = superUser.timeZone;
                  });
                }
                //push notification
                let assignedTo = sale.assignedTo;
                let assigednToNotif = `${fieldName}: ${sale.saleTitle} created by ${createdByUser.firstname} have been assinged to you`;
                if (sale.createdBy != assignedTo) {
                  let navUrl = `sales/saleview/${docId}`;
                  console.log("NavURL" + navUrl);
                  sendPushNotificationToUser(
                    assigednToNotif,
                    assignedTo,
                    docId,
                    navUrl
                  );
                }
              }
            });
          }
        });
      })
      }
    }
    resolve();
  }).catch((error) => {
    console.error("Error:", error);
    reject(error);
  });
  });

// to send email if assigned to change while editing a sale
exports.saleEdited = functions
  .region(region)
  .firestore.document("/users/{userId}/sales/{documentId}")
  .onUpdate((change, context) => {
    return new Promise((resolve, reject) => {
    const userId = context.params.userId; //superUserId
    const docId = context.params.documentId;
    let fieldName = "Sale";
    const newSaleData = change.after.data();
    var prevSaleData = change.before.data();
    let superUserTimeZone;

    if (newSaleData.assignedTo !== prevSaleData.assignedTo) {
      getSalePipelines(userId).then(salePipeline=>{
        salePipelines = salePipeline.salePipelines;
      // fetch email of assignedto person and send a mail
      getassignedToUser(newSaleData.assignedTo).then((assUser) => {
        if (assUser) {
          console.log(assUser.email);
          assignedToEmail = assUser.email;

          if (assignedToEmail) {
            getassignedToUser(newSaleData.createdBy).then((createdByUser) => {
              if (createdByUser) {
                if (newSaleData.assignedTo == userId) {
                  fieldName = assUser.fieldNames.fieldNameSale;
                  superUserTimeZone = assUser.timeZone;
                } else if (newSaleData.createdBy == userId) {
                  fieldName = createdByUser.fieldNames.fieldNameSale;
                  superUserTimeZone = createdByUser.timeZone;
                } else {
                  // need to fetch superuserdetails for fieldnames
                  getassignedToUser(userId).then((superUser) => {
                    fieldName = superUser.fieldNames.fieldNameSale;
                    superUserTimeZone = superUser.timeZone;
                  });
                }
                let emailData = {
                  to: assignedToEmail,
                  template: {
                    name: "reAssignSale",
                    data: {
                      fieldName: fieldName,
                      saleTitle: newSaleData.saleTitle,
                      stage: getStatusName(salePipelines, newSaleData.selectedSalePipeline,newSaleData.salesStage),
                      startDate: convertDate(
                        newSaleData.startDate,
                        superUserTimeZone
                      ),
                      expCompletionDate: convertDate(
                        newSaleData.expCompletionDate,
                        superUserTimeZone
                      ),
                      createdBy: createdByUser.lastname
                        ? createdByUser.firstname + " " + createdByUser.lastname
                        : createdByUser.firstname,
                      dateCreated: dateFormat(newSaleData.createdDate),
                      assignedToName: newSaleData.assignedToName,
                    },
                  },
                };
                // console.log("emailData", emailData);

                let message = `${fieldName} : ${emailData.template.data.saleTitle}, stage ${emailData.template.data.stage}, startDate: ${emailData.template.data.startDate}, expected Completion Date: ${emailData.template.data.expCompletionDate} created on ${emailData.template.data.dateCreated} has been re-assigned to you`;
                // console.log("notification msg", message);

                addToNotification(
                  message,
                  "Sale",
                  docId,
                  newSaleData.assignedTo
                );
                sendNotificationMail(emailData);
              }
            });
          }
          //push notif
          getassignedToUser(newSaleData.createdBy).then((createdByUser) => {
            if (createdByUser) {
              if (newSaleData.assignedTo == userId) {
                fieldName = assUser.fieldNames.fieldNameSale;
                superUserTimeZone = assUser.timeZone;
              } else if (newSaleData.createdBy == userId) {
                fieldName = createdByUser.fieldNames.fieldNameSale;
                superUserTimeZone = createdByUser.timeZone;
              } else {
                // need to fetch superuserdetails for fieldnames
                getassignedToUser(userId).then((superUser) => {
                  fieldName = superUser.fieldNames.fieldNameSale;
                  superUserTimeZone = superUser.timeZone;
                });
              }
              let assignedTo = newSaleData.assignedTo;
              console.log("ASSIGNED TO ::", assignedTo);
              let assigednToNotif = `${fieldName}: ${newSaleData.saleTitle} created by ${createdByUser.firstname} have been reassinged to you`;
              console.log("CREATEDBY  ::", newSaleData.createdBy);

              if (newSaleData.createdBy != assignedTo) {
                console.log(
                  "*************************PUSH NOTIFICATION*****************************************************"
                );
                let collName = "sales";
                let navUrl = `sales/saleview/${docId}`;
                sendPushNotificationToUser(
                  assigednToNotif,
                  assignedTo,
                  docId,
                  navUrl
                );
              }
            }
          });
        }
      });
    })
    }
    resolve();
  }).catch((error) => {
    console.error("Error:", error);
    reject(error);
  });
  });

// service
exports.serviceCreated = functions
  .region(region)
  .firestore.document("/users/{userId}/services/{documentId}")
  .onCreate((snap, context) => {
    return new Promise((resolve, reject) => {
    const service = snap.data();
    const userId = context.params.userId; //superUserId
    const docId = context.params.documentId;
    let fieldName = "Support";
    const serviceId = context.params.documentId;
    let assignedToEmail;
    let superUserTimeZone;

    if (service) {
      console.log(service.createdBy, service.assignedTo);
      if (service.createdBy !== service.assignedTo) {
        getServicePipelines(userId).then(servicePipeline=>{
          servicePipelines = servicePipeline.servicePipelines;
        // fetch email of assignedto person and send a mail
        getassignedToUser(service.assignedTo).then((assUser) => {
          if (assUser) {
            console.log(assUser.email);
            assignedToEmail = assUser.email;
            if (assignedToEmail) {
              getassignedToUser(service.createdBy).then((createdByUser) => {
                if (createdByUser) {
                  if (service.assignedTo == userId) {
                    if (assUser.fieldNames.fieldNameService) {
                      fieldName = assUser.fieldNames.fieldNameService;
                      superUserTimeZone = assUser.timeZone;
                    }
                  } else if (service.createdBy == userId) {
                    if (createdByUser.fieldNames.fieldNameService) {
                      fieldName = createdByUser.fieldNames.fieldNameService;
                      superUserTimeZone = createdByUser.timeZone;
                    }
                  } else {
                    // need to fetch superuserdetails for fieldnames
                    getassignedToUser(userId).then((superUser) => {
                      if (superUser.fieldNames.fieldNameService) {
                        fieldName = superUser.fieldNames.fieldNameService;
                        superUserTimeZone = superUser.timeZone;
                      }
                    });
                  }
                  let emailData = {
                    to: assignedToEmail,
                    template: {
                      name: "newServiceAssigned",
                      data: {
                        fieldName: fieldName,
                        serviceTitle: service.serviceTitle,
                        stage: getStatusName(servicePipelines, service.selectedServPipeline,service.servicesStage),
                        startDate: convertDate(
                          service.startDate,
                          superUserTimeZone
                        ),
                        expCompletionDate: convertDate(
                          service.expCompletionDate,
                          superUserTimeZone
                        ),
                        createdBy: createdByUser.lastname
                          ? createdByUser.firstname +
                            " " +
                            createdByUser.lastname
                          : createdByUser.firstname,
                        dateCreated: dateFormat(service.createdDate),
                        assignedToName: service.assignedToName,
                      },
                    },
                  };
                  console.log("emailData", emailData);
                  let message = `${fieldName} : ${emailData.template.data.serviceTitle}, stage ${emailData.template.data.stage}, startDate: ${emailData.template.data.startDate}, expected Completion Date: ${emailData.template.data.expCompletionDate} created on ${emailData.template.data.dateCreated} has been assigned to you`;
                  console.log("notification msg", message);
                  addToNotification(
                    message,
                    "Service",
                    docId,
                    service.assignedTo
                  );
                  sendNotificationMail(emailData);
                  //pushNotification To mobile app
                  let assignedTo = service.assignedTo;
                  let assigednToNotif = `${fieldName}: ${service.serviceTitle} created by ${createdByUser.firstname} have been assinged to you`;
                  let navUrl = `service/service-details/${docId}`;
                  sendPushNotificationToUser(
                    assigednToNotif,
                    assignedTo,
                    docId,
                    navUrl
                  );
                }
              });
            }
            getassignedToUser(service.createdBy).then((createdByUser) => {
              if (createdByUser) {
                if (service.assignedTo == userId) {
                  if (assUser.fieldNames.fieldNameService) {
                    fieldName = assUser.fieldNames.fieldNameService;
                    superUserTimeZone = assUser.timeZone;
                  }
                } else if (service.createdBy == userId) {
                  if (createdByUser.fieldNames.fieldNameService) {
                    fieldName = createdByUser.fieldNames.fieldNameService;
                    superUserTimeZone = createdByUser.timeZone;
                  }
                } else {
                  // need to fetch superuserdetails for fieldnames
                  getassignedToUser(userId).then((superUser) => {
                    if (superUser.fieldNames.fieldNameService) {
                      fieldName = superUser.fieldNames.fieldNameService;
                      superUserTimeZone = superUser.timeZone;
                    }
                  });
                }
                //pushNotification To mobile app
                let assignedTo = service.assignedTo;
                let assigednToNotif = `${fieldName}: ${service.serviceTitle} created by ${createdByUser.firstname} have been assinged to you`;
                let navUrl = `service/service-details/${docId}`;
                if (service.createdBy != assignedTo) {
                  sendPushNotificationToUser(
                    assigednToNotif,
                    assignedTo,
                    docId,
                    navUrl
                  );
                }
              }
            });
          }
        });
      });
      }
    }
    resolve();
  }).catch((error) => {
    console.error("Error:", error);
    reject(error);
  });
  });

// to send email if assigned to change while editing a service
exports.serviceEdited = functions
  .region(region)
  .firestore.document("/users/{userId}/services/{documentId}")
  .onUpdate((change, context) => {
    return new Promise((resolve, reject) => {
    const userId = context.params.userId; //superUserId
    const docId = context.params.documentId;
    let fieldName = "Support";
    const newServiceData = change.after.data();
    var prevServiceData = change.before.data();
    let superUserTimeZone;

    if (newServiceData.assignedTo !== prevServiceData.assignedTo) {
      getServicePipelines(userId).then(servicePipeline=>{
        servicePipelines = servicePipeline.servicePipelines;
      // fetch email of assignedto person and send a mail
      getassignedToUser(newServiceData.assignedTo).then((assUser) => {
        if (assUser) {
          console.log(assUser.email);
          assignedToEmail = assUser.email;
          if (assignedToEmail) {
            getassignedToUser(newServiceData.createdBy).then(
              (createdByUser) => {
                if (createdByUser) {
                  if (newServiceData.assignedTo == userId) {
                    if (assUser.fieldNames.fieldNameService) {
                      fieldName = assUser.fieldNames.fieldNameService;
                      superUserTimeZone = assUser.timeZone;
                    }
                  } else if (newServiceData.createdBy == userId) {
                    if (createdByUser.fieldNames.fieldNameService) {
                      fieldName = createdByUser.fieldNames.fieldNameService;
                      superUserTimeZone = createdByUser.timeZone;
                    }
                  } else {
                    // need to fetch superuserdetails for fieldnames
                    getassignedToUser(userId).then((superUser) => {
                      if (superUser.fieldNames.fieldNameService) {
                        fieldName = superUser.fieldNames.fieldNameService;
                        superUserTimeZone = superUser.timeZone;
                      }
                    });
                  }
                  let emailData = {
                    to: assignedToEmail,
                    template: {
                      name: "reAssignService",
                      data: {
                        fieldName: fieldName,
                        serviceTitle: newServiceData.serviceTitle,
                        stage: getStatusName(servicePipelines, newServiceData.selectedServPipeline,newServiceData.servicesStage),
                        startDate: convertDate(
                          newServiceData.startDate,
                          superUserTimeZone
                        ),
                        expCompletionDate: convertDate(
                          newServiceData.expCompletionDate,
                          superUserTimeZone
                        ),
                        createdBy: createdByUser.lastname
                          ? createdByUser.firstname +
                            " " +
                            createdByUser.lastname
                          : createdByUser.firstname,
                        dateCreated: dateFormat(newServiceData.createdDate),
                        assignedToName: newServiceData.assignedToName,
                      },
                    },
                  };
                  console.log("emailData", emailData);

                  let message = `${fieldName} : ${emailData.template.data.serviceTitle}, stage ${emailData.template.data.stage}, startDate: ${emailData.template.data.startDate}, expected Completion Date: ${emailData.template.data.expCompletionDate} created on ${emailData.template.data.dateCreated} has been re-assigned to you`;
                  console.log("notification msg", message);

                  addToNotification(
                    message,
                    "Service",
                    docId,
                    newServiceData.assignedTo
                  );
                  sendNotificationMail(emailData);
                }
              }
            );
          }
          //push Notif
          getassignedToUser(newServiceData.createdBy).then((createdByUser) => {
            if (createdByUser) {
              if (newServiceData.assignedTo == userId) {
                if (assUser.fieldNames.fieldNameService) {
                  fieldName = assUser.fieldNames.fieldNameService;
                  superUserTimeZone = assUser.timeZone;
                }
              } else if (newServiceData.createdBy == userId) {
                if (createdByUser.fieldNames.fieldNameService) {
                  fieldName = createdByUser.fieldNames.fieldNameService;
                  superUserTimeZone = createdByUser.timeZone;
                }
              } else {
                // need to fetch superuserdetails for fieldnames
                getassignedToUser(userId).then((superUser) => {
                  if (superUser.fieldNames.fieldNameService) {
                    fieldName = superUser.fieldNames.fieldNameService;
                    superUserTimeZone = superUser.timeZone;
                  }
                });
              }
              let assignedTo = newServiceData.assignedTo;
              let assigednToNotif = `${fieldName}: ${newServiceData.serviceTitle} created by ${createdByUser.firstname} have been reassinged to you`;
              if (newServiceData.createdBy != assignedTo) {
                let navUrl = `service/service-details/${docId}`;
                sendPushNotificationToUser(
                  assigednToNotif,
                  assignedTo,
                  docId,
                  navUrl
                );
              }
            }
          });
        }
      });
    });
    }
    resolve();
  }).catch((error) => {
    console.error("Error:", error);
    reject(error);
  });
  });

// task
exports.taskCreated = functions
  .region(region)
  .firestore.document("/users/{userId}/tasks/{documentId}")
  .onCreate((snap, context) => {
    return new Promise((resolve, reject) => {
    const task = snap.data();
    const userId = context.params.userId; //superUserId
    let fieldName = "Task";
    const docId = context.params.documentId;
    let assignedToEmail;
    let superUserTimeZone;

    if (task) {
      console.log(task.createdBy, task.assignedTo);
      if (task.createdBy !== task.assignedTo) {
        // fetch email of assignedto person and send a mail
        getassignedToUser(task.assignedTo).then((assUser) => {
          if (assUser) {
            console.log(assUser.email);
            assignedToEmail = assUser.email;
            if (assignedToEmail) {
              getassignedToUser(task.createdBy).then((createdByUser) => {
                if (createdByUser) {
                  if (task.assignedTo == userId) {
                    fieldName = assUser.fieldNames.fieldNameTask;
                    superUserTimeZone = assUser.timeZone;
                  } else if (task.createdBy == userId) {
                    fieldName = createdByUser.fieldNames.fieldNameTask;
                    superUserTimeZone = createdByUser.timeZone;
                  } else {
                    // need to fetch superuserdetails for fieldnames
                    getassignedToUser(userId).then((superUser) => {
                      fieldName = superUser.fieldNames.fieldNameTask;
                      superUserTimeZone = superUser.timeZone;
                    });
                  }
                  let emailData = {
                    to: assignedToEmail,
                    template: {
                      name: "newTaskAssigned",
                      data: {
                        fieldName: fieldName,
                        taskTitle: task.title,
                        createdBy: createdByUser.lastname
                          ? createdByUser.firstname +
                            " " +
                            createdByUser.lastname
                          : createdByUser.firstname,
                        dueDate: convertDate(task.dueDate, superUserTimeZone),
                        assignedToName: task.assignedToName,
                      },
                    },
                  };
                  console.log("emailData", emailData);

                  let message = `${fieldName} : ${emailData.template.data.taskTitle}, due on ${emailData.template.data.dueDate} has been assigned to you`;
                  console.log("notification msg", message);

                  addToNotification(message, "Task", docId, task.assignedTo);
                  sendNotificationMail(emailData);
                }
              });
            }
            //push notif
            getassignedToUser(task.createdBy).then((createdByUser) => {
              if (createdByUser) {
                if (task.assignedTo == userId) {
                  fieldName = assUser.fieldNames.fieldNameTask;
                  superUserTimeZone = assUser.timeZone;
                } else if (task.createdBy == userId) {
                  fieldName = createdByUser.fieldNames.fieldNameTask;
                  superUserTimeZone = createdByUser.timeZone;
                } else {
                  // need to fetch superuserdetails for fieldnames
                  getassignedToUser(userId).then((superUser) => {
                    fieldName = superUser.fieldNames.fieldNameTask;
                    superUserTimeZone = superUser.timeZone;
                  });
                }
                let assignedTo = task.assignedTo;
                console.log("Assigned To" + assignedTo);
                let assigednToNotif = `${fieldName}: ${task.title} created by ${createdByUser.firstname} have been assinged to you`;
                let custId = task.customerId ? task.customerId : "none";
                console.log("CUSTID" + custId);
                console.log("task.createdBy" + task.createdBy);
                if (task.createdBy != assignedTo) {
                  console.log("task.createdBy" + task.createdBy);
                  let navUrl = `task-crud/Update/${docId}/none/none`;

                  console.log("navUrl" + navUrl);
                  sendPushNotificationToUser(
                    assigednToNotif,
                    assignedTo,
                    docId,
                    navUrl
                  );
                }
              }
            });
          }
        });
      }
    }
    resolve();
  }).catch((error) => {
    console.error("Error:", error);
    reject(error);
  });
  });

// to send email if assigned to change while editing a task
exports.taskEdited = functions
  .region(region)
  .firestore.document("/users/{userId}/tasks/{documentId}")
  .onUpdate((change, context) => {
    return new Promise((resolve, reject) => {
    const userId = context.params.userId; //superUserId
    const docId = context.params.documentId;
    let fieldName = "Task";
    const newTaskData = change.after.data();
    var prevTaskData = change.before.data();
    let superUserTimeZone;

    console.log(userId, newTaskData.assignedTo, newTaskData.createdBy);
    if (newTaskData.assignedTo !== prevTaskData.assignedTo) {
      // fetch email of assignedto person and send a mail
      getassignedToUser(newTaskData.assignedTo).then((assUser) => {
        if (assUser) {
          console.log(assUser.email);
          assignedToEmail = assUser.email;
          if (assignedToEmail) {
            getassignedToUser(newTaskData.createdBy).then((createdByUser) => {
              if (newTaskData.assignedTo == userId) {
                console.log("if 1");
                fieldName = assUser.fieldNames.fieldNameTask;
                superUserTimeZone = assUser.timeZone;
              } else if (newTaskData.createdBy == userId) {
                console.log("if 2");
                fieldName = createdByUser.fieldNames.fieldNameTask;
                superUserTimeZone = createdByUser.timeZone;
              } else {
                // need to fetch superuserdetails for fieldnames
                console.log("if 3");
                getassignedToUser(userId).then((superUser) => {
                  fieldName = superUser.fieldNames.fieldNameTask;
                  superUserTimeZone = superUser.timeZone;
                });
              }
              let emailData = {
                to: assignedToEmail,
                template: {
                  name: "reAssignTask",
                  data: {
                    fieldName: fieldName,
                    taskTitle: newTaskData.title,
                    createdBy: createdByUser.lastname
                      ? createdByUser.firstname + " " + createdByUser.lastname
                      : createdByUser.firstname,
                    dueDate: convertDate(
                      newTaskData.dueDate,
                      superUserTimeZone
                    ),
                    assignedToName: newTaskData.assignedToName,
                  },
                },
              };
              console.log("emailData", emailData);

              let message = `${fieldName} : ${emailData.template.data.taskTitle}, due on ${emailData.template.data.dueDate} has been re-assigned to you`;
              console.log("notification msg", message);

              addToNotification(message, "Task", docId, newTaskData.assignedTo);
              sendNotificationMail(emailData);
            });
          }
          //push notifications
          getassignedToUser(newTaskData.createdBy).then((createdByUser) => {
            if (newTaskData.assignedTo == userId) {
              fieldName = assUser.fieldNames.fieldNameTask;
              superUserTimeZone = assUser.timeZone;
            } else if (newTaskData.createdBy == userId) {
              fieldName = createdByUser.fieldNames.fieldNameTask;
              superUserTimeZone = createdByUser.timeZone;
            } else {
              // need to fetch superuserdetails for fieldnames
              getassignedToUser(userId).then((superUser) => {
                fieldName = superUser.fieldNames.fieldNameTask;
                superUserTimeZone = superUser.timeZone;
              });
            }
            let assignedTo = newTaskData.assignedTo;
            console.log("ASSIGNED TO", assignedTo);
            let assigednToNotif = `${fieldName}: ${newTaskData.title} created by ${createdByUser.firstname} have been reassinged to you`;
            console.log("assigednToNotif", assigednToNotif);
            let custId = newTaskData.customerId
              ? newTaskData.customerId
              : "none";
            console.log("newTaskData.createdBy" + newTaskData.createdBy);
            if (newTaskData.createdBy != assignedTo) {
              let navUrl = `task-crud/Update/${docId}/none/none`;
              // this.router.navigate(['/task-crud', 'Update', task.id, 'none', 'none']);
              console.log("NAVURL" + navUrl);
              sendPushNotificationToUser(
                assigednToNotif,
                assignedTo,
                docId,
                navUrl
              );
            }
          });
        }
      });
    }
    resolve();
  }).catch((error) => {
    console.error("Error:", error);
    reject(error);
  });
  });

// followups
exports.followUpCreated = functions
  .region(region)
  .firestore.document("/users/{userId}/Follow Ups/{documentId}")
  .onCreate((snap, context) => {
    return new Promise((resolve, reject) => {
    const followUp = snap.data();
    const userId = context.params.userId; //superUserId
    let fieldName = "Follow Up";
    const docId = context.params.documentId;
    let assignedToEmail;
    let superUserTimeZone;

    if (followUp) {
      console.log(followUp.createdBy, followUp.assignedTo);
      if (followUp.createdBy !== followUp.assignedTo) {
        // fetch email of assignedto person and send a mail
        getassignedToUser(followUp.assignedTo).then((assUser) => {
          if (assUser) {
            console.log(assUser.email);
            assignedToEmail = assUser.email;
            if (assignedToEmail) {
              getassignedToUser(followUp.createdBy).then((createdByUser) => {
                if (createdByUser) {
                  console.log(createdByUser.email);
                  if (followUp.assignedTo == userId) {
                    fieldName = assUser.fieldNames.fieldNameFollowup;
                    superUserTimeZone = assUser.timeZone;
                  } else if (followUp.createdBy == userId) {
                    fieldName = createdByUser.fieldNames.fieldNameFollowup;
                    superUserTimeZone = createdByUser.timeZone;
                  } else {
                    // need to fetch superuserdetails for fieldnames
                    getassignedToUser(userId).then((superUser) => {
                      fieldName = superUser.fieldNames.fieldNameFollowup;
                      superUserTimeZone = superUser.timeZone;
                    });
                  }
                  let emailData = {
                    to: assignedToEmail,
                    template: {
                      name: "newfollowUpAssigned",
                      data: {
                        fieldName: fieldName,
                        notes: followUp.notes
                          ? followUp.notes
                          : "notes not provided",
                        createdBy: createdByUser.lastname
                          ? createdByUser.firstname +
                            " " +
                            createdByUser.lastname
                          : createdByUser.firstname,
                        followUpTime: followUp.callStartTime
                          ? followUp.callStartTime
                          : "Time not provided",
                        followUpDate: convertDate(
                          followUp.callStartDate,
                          superUserTimeZone
                        ),
                        assignedToName: followUp.assignedToName,
                      },
                    },
                  };
                  console.log("emailData", emailData);

                  let message = `${fieldName} : ${emailData.template.data.notes}, scheduled on ${emailData.template.data.followUpDate} at ${emailData.template.data.followUpTime} has been assigned to you`;
                  console.log("notification msg", message);

                  addToNotification(
                    message,
                    "FollowUp",
                    docId,
                    followUp.assignedTo
                  );
                  sendNotificationMail(emailData);
                }
              });
            }
            //push notification
            getassignedToUser(followUp.createdBy).then((createdByUser) => {
              if (createdByUser) {
                console.log(createdByUser.email);
                if (followUp.assignedTo == userId) {
                  fieldName = assUser.fieldNames.fieldNameFollowup;
                } else if (followUp.createdBy == userId) {
                  fieldName = createdByUser.fieldNames.fieldNameFollowup;
                } else {
                  // need to fetch superuserdetails for fieldnames
                  getassignedToUser(userId).then((superUser) => {
                    fieldName = superUser.fieldNames.fieldNameFollowup;
                  });
                }
                //push notification
                let assignedTo = followUp.assignedTo;
                console.log("AssignedTo " + assignedTo);
                let assigednToNotif = `${fieldName} created by ${createdByUser.firstname} have been assinged to you`;
                console.log("assigednToNotif " + assigednToNotif);
                console.log("followUp.createdBy " + followUp.createdBy);
                let custId;
                if (followUp.customerId) {
                  custId = followUp.customerId;
                } else {
                  custId = "none";
                }
                if (followUp.createdBy != assignedTo) {
                  let navUrl = `followup/edit/${docId}/${custId}/none`;
                  console.log("NavigationURl" + navUrl);
                  sendPushNotificationToUser(
                    assigednToNotif,
                    assignedTo,
                    docId,
                    navUrl
                  );
                }
              }
            });
          }
        });
      }
    }
    resolve();
  }).catch((error) => {
    console.error("Error:", error);
    reject(error);
  });
  });

// to send email if assigned to change while editing a task
exports.followUpEdited = functions
  .region(region)
  .firestore.document("/users/{userId}/Follow Ups/{documentId}")
  .onUpdate((change, context) => {
    return new Promise((resolve, reject) => {
    const userId = context.params.userId; //superUserId
    const docId = context.params.documentId;
    let fieldName = "Follow Up";
    const newfollowUpData = change.after.data();
    var prevfollowUpData = change.before.data();
    let superUserTimeZone;

    if (newfollowUpData.assignedTo !== prevfollowUpData.assignedTo) {
      // fetch email of assignedto person and send a mail
      getassignedToUser(newfollowUpData.assignedTo).then((assUser) => {
        if (assUser) {
          console.log(assUser.email);
          assignedToEmail = assUser.email;
          if (assignedToEmail) {
            getassignedToUser(newfollowUpData.createdBy).then(
              (createdByUser) => {
                if (createdByUser) {
                  if (newfollowUpData.assignedTo == userId) {
                    fieldName = assUser.fieldNames.fieldNameFollowup;
                    superUserTimeZone = assUser.timeZone;
                  } else if (newfollowUpData.createdBy == userId) {
                    fieldName = createdByUser.fieldNames.fieldNameFollowup;
                    superUserTimeZone = createdByUser.timeZone;
                  } else {
                    // need to fetch superuserdetails for fieldnames
                    getassignedToUser(userId).then((superUser) => {
                      fieldName = superUser.fieldNames.fieldNameFollowup;
                      superUserTimeZone = superUser.timeZone;
                    });
                  }
                  let emailData = {
                    to: assignedToEmail,
                    template: {
                      name: "reAssignFollowup",
                      data: {
                        fieldName: fieldName,
                        notes: newfollowUpData.notes
                          ? newfollowUpData.notes
                          : "notes not provided",
                        createdBy: createdByUser.lastname
                          ? createdByUser.firstname +
                            " " +
                            createdByUser.lastname
                          : createdByUser.firstname,
                        followUpTime: newfollowUpData.callStartTime
                          ? newfollowUpData.callStartTime
                          : "Time not provided",
                        followUpDate: convertDate(
                          newfollowUpData.callStartDate,
                          superUserTimeZone
                        ),
                        assignedToName: newfollowUpData.assignedToName,
                      },
                    },
                  };
                  console.log("emailData", emailData);

                  let message = `${fieldName} : ${emailData.template.data.notes}, scheduled on ${emailData.template.data.followUpDate} at ${emailData.template.data.followUpTime} has been re-assigned to you`;
                  console.log("notification msg", message);

                  addToNotification(
                    message,
                    "FollowUp",
                    docId,
                    newfollowUpData.assignedTo
                  );
                  sendNotificationMail(emailData);
                }
              }
            );
          }
          //push notif
          getassignedToUser(newfollowUpData.createdBy).then((createdByUser) => {
            if (createdByUser) {
              if (newfollowUpData.assignedTo == userId) {
                fieldName = assUser.fieldNames.fieldNameFollowup;
                superUserTimeZone = assUser.timeZone;
              } else if (newfollowUpData.createdBy == userId) {
                fieldName = createdByUser.fieldNames.fieldNameFollowup;
                superUserTimeZone = createdByUser.timeZone;
              } else {
                // need to fetch superuserdetails for fieldnames
                getassignedToUser(userId).then((superUser) => {
                  fieldName = superUser.fieldNames.fieldNameFollowup;
                  superUserTimeZone = superUser.timeZone;
                });
              }
              let assignedTo = newfollowUpData.assignedTo;
              console.log("AssignedTo" + assignedTo);
              let custId = newfollowUpData.customerId;
              console.log("custId" + custId);
              console.log(
                "newfollowUpData.createdBy" + newfollowUpData.createdBy
              );

              let assigednToNotif = `${fieldName}: Created by ${createdByUser.firstname} have been reassinged to you`;
              if (newfollowUpData.customerId) {
                custId = newfollowUpData.customerId;
              } else {
                custId = "none";
              }
              if (newfollowUpData.createdBy != assignedTo) {
                let navUrl = `followup/edit/${docId}/${custId}/none`;

                console.log("navUrl" + navUrl);
                sendPushNotificationToUser(
                  assigednToNotif,
                  assignedTo,
                  docId,
                  navUrl
                );
              }
            }
          });
        }
      });
    }
    resolve();
  }).catch((error) => {
    console.error("Error:", error);
    reject(error);
  });
  });

function dateFormat(date) {
  if (date) {
    console.log(date);
    var d = new Date(date);
    (month = "" + (d.getMonth() + 1)),
      (day = "" + d.getDate()),
      (year = d.getFullYear());

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  } else return "Date is not provided";
}
function addToNotification(dueMessage, type, docId, userId) {
  console.log("addToNotification fn");
  return admin
    .firestore()
    .collection("users/" + userId + "/Notifications")
    .add({
      message: dueMessage,
      createdDate: Date.now(),
      viewStatus: false,
      type: type,
      docId: docId,
    })
    .then((res) => {
      console.log("added to notification collection");
    })
    .catch((e) => {
      console.log(e.message);
    });
}

// new ends here

//fb lead capture
exports.fbIntegration = functions.region(region).https.onRequest((req, res) => {
  if (path.includes(req.headers.origin)) {
    res.set("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.set("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    res.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    );
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  } else {
    return cors(req, res, () => {
      getFormData(req.body.form_id,req.body.field_data);
    });
  }
});
function getFormData(form_id,field_data) {

  admin
    .firestore()
    .doc("FBForms/" + form_id)
    .get()
    .then((data) => {
      let formData = data.data();
      getUserData(
        formData.superUserID,
        formData.Fields,
        field_data,
        formData,
        form_id
      );
    })

}
function getUserData(
  superUserId,
  Fields,
  field_data,
  formData,
  form_id
) {
  admin
    .firestore()
    .doc("users/" + superUserId)
    .get()
    .then(async (data) => {
      let superUserdata = data.data();
      if (superUserdata) {
        let contactSequentialNumber = 0;
        if (superUserdata.contactSequentialNumber) {
          contactSequentialNumber = superUserdata.contactSequentialNumber;
        }

        //increment the contact sequence no
        if (contactSequentialNumber) {
          contactSequenceNumber = contactSequentialNumber + 1;
        } else {
          contactSequenceNumber = 1;
        }
        let salutation = "";
        let firstName = "";
        let secondName = "";
        let surname = "";
        let companyName = "";
        let altContactCode = "";
        let alternateContactNumber = "";
        let billingaddress1 = "";
        let billingaddress2 = "";
        let bpin = "";
        let code = "";
        let contactNo = "";
        let country = "";
        let department = "";
        let district = "";
        let email = "";
        let taxId = "";
        let state = "";
        let priority = "Medium";
        let status = "Lead";
        let custLeadValue = "";
        let assignedTo = "";
        let assignedToName = "";
        let selectedContactPipeline = 0;
        let isCompany = false;
        let statusArray = [];
        let columns = [];

        let contactAddtFields = []; //to save superuser contact additional field
        let contactAddFArray = {}; // to create additionalFieldsArr field of contact document
        // contact additional field code changes starts here
        if (!!superUserdata.customFieldsContact) {
          contactAddtFields = superUserdata.customFieldsContact;
        }

        contactAddtFields.forEach((field, index) => {
          contactAddFArray[index] = {
            fieldValue: field.defaultValue,
          };
        });

        columns = Object.values(Fields);
        columns.forEach((element) => {
          field_data.forEach((mapData) => {
            if (element.mappedField) {
              if (mapData.name == element.columnDef) {
                if (element.mappedTo === "salutation") {
                  if (mapData.values.length > 0) {
                    salutation = mapData.values ? mapData.values + "" : "";
                  } else {
                    salutation = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.mappedTo === "firstName") {
                  if (mapData.values.length > 0) {
                    firstName = mapData.values ? mapData.values + "" : "";
                  } else {
                    firstName = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.mappedTo === "secondName") {
                  if (mapData.values.length > 0) {
                    secondName = mapData.values ? mapData.values + "" : "";
                  } else {
                    secondName = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.mappedTo === "surname") {
                  if (mapData.values.length > 0) {
                    surname = mapData.values ? mapData.values + "" : "";
                  } else {
                    surname = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.mappedTo === "companyName") {
                  if (mapData.values.length > 0) {
                    companyName = mapData.values ? mapData.values + "" : "";
                  } else {
                    companyName = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.mappedTo === "altContactCode") {
                  if (mapData.values.length > 0) {
                    altContactCode = mapData.values ? mapData.values + "" : "";
                  } else {
                    altContactCode = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.mappedTo === "alternateContactNumber") {
                  if (mapData.values.length > 0) {
                    if(mapData.values){
                      const numobject = splitNumber(mapData.values[0]);
                      alternateContactNumber = numobject.number
                        ? numobject.number + ""
                        : "";
                        altContactCode = numobject.code
                        ?  numobject.code + ""
                        : "";
                    }else{
                      alternateContactNumber ='';
                    }
                  } else {
                    alternateContactNumber = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.mappedTo === "billingaddress1") {
                  if (mapData.values.length > 0) {
                    billingaddress1 = mapData.values ? mapData.values + "" : "";
                  } else {
                    billingaddress1 = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.mappedTo === "billingaddress2") {
                  if (mapData.values.length > 0) {
                    billingaddress2 = mapData.values ? mapData.values + "" : "";
                  } else {
                    billingaddress2 = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.mappedTo === "bpin") {
                  if (mapData.values.length > 0) {
                    bpin = mapData.values ? mapData.values + "" : "";
                  } else {
                    bpin = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.mappedTo === "code") {
                  if (mapData.values.length > 0) {
                    code = mapData.values ? mapData.values + "" : "";
                  } else {
                    code = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.mappedTo === "contactNo") {
                  if (mapData.values.length > 0) {
                    if(mapData.values){
                      const numContact = splitNumber(mapData.values[0]);
                      contactNo = numContact.number
                        ? numContact.number + ""
                        : "";
                        code = numContact.code
                        ? numContact.code + ""
                        : "";
                    }else{
                      contactNo ='';
                    }
                  } else {
                    contactNo = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.mappedTo === "country") {
                  if (mapData.values.length > 0) {
                    country = mapData.values ? mapData.values + "" : "";
                  } else {
                    country = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.mappedTo === "department") {
                  if (mapData.values.length > 0) {
                    department = mapData.values ? mapData.values + "" : "";
                  } else {
                    department = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.mappedTo === "district") {
                  if (mapData.values.length > 0) {
                    district = mapData.values ? mapData.values + "" : "";
                  } else {
                    district = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.mappedTo === "email") {
                  if (mapData.values.length > 0) {
                    email = mapData.values ? mapData.values + "" : "";
                  } else {
                    email = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.mappedTo === "taxId") {
                  if (mapData.values.length > 0) {
                    taxId = mapData.values ? mapData.values + "" : "";
                  } else {
                    taxId = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.mappedTo === "state") {
                  if (mapData.values.length > 0) {
                    state = mapData.values ? mapData.values + "" : "";
                  } else {
                    state = element.defaultValue
                      ? element.defaultValue + ""
                      : "";
                  }
                } else if (element.customField && element.isActive) {
                  if (mapData.values.length > 0) {
                    if (
                      element.inputType == "date_time" ||
                      element.inputType == "date"
                    ) {
                      //if field is a date_time or date field convert it to timestamp
                      contactAddFArray[element.custIndex] = {
                        fieldValue: mapData.values[0]
                          ? new Date(Date.parse(mapData.values[0]))
                          : "",
                      };
                    } else if (element.inputType == "number") {
                      //save other field values
                      contactAddFArray[element.custIndex] = {
                        fieldValue: Number(mapData.values[0]),
                      };
                    } else {
                      //save other field values
                      contactAddFArray[element.custIndex] = {
                        fieldValue: mapData.values[0] + "",
                      };
                    }
                  } else {
                    if (
                      element.inputType == "date_time" ||
                      element.inputType == "date"
                    ) {
                      //if field is a date_time or date field convert it to timestamp
                      if (element.defaultValue) {
                        contactAddFArray[element.custIndex] = {
                          fieldValue: element.defaultValue,
                        };
                      }
                    } else {
                      if (element.defaultValue) {
                        //save other field values
                        contactAddFArray[element.custIndex] = {
                          fieldValue: element.defaultValue,
                        };
                      }
                    }
                  }
                }
              }
            } else {
              if (element.columnDef === "salutation") {
                salutation = element.defaultValue
                  ? element.defaultValue + ""
                  : "";
              } else if (element.columnDef === "firstName") {
                firstName = element.defaultValue
                  ? element.defaultValue + ""
                  : "";
              } else if (element.columnDef === "secondName") {
                secondName = element.defaultValue
                  ? element.defaultValue + ""
                  : "";
              } else if (element.columnDef === "surname") {
                surname = element.defaultValue ? element.defaultValue + "" : "";
              } else if (element.columnDef === "companyName") {
                companyName = element.defaultValue
                  ? element.defaultValue + ""
                  : "";
              } else if (element.columnDef === "altContactCode") {
                altContactCode = element.defaultValue
                  ? element.defaultValue + ""
                  : "";
              } else if (element.columnDef === "alternateContactNumber") {
                alternateContactNumber = element.defaultValue
                  ? element.defaultValue + ""
                  : "";
              } else if (element.columnDef === "billingaddress1") {
                billingaddress1 = element.defaultValue
                  ? element.defaultValue + ""
                  : "";
              } else if (element.columnDef === "billingaddress2") {
                billingaddress2 = element.defaultValue
                  ? element.defaultValue + ""
                  : "";
              } else if (element.columnDef === "bpin") {
                bpin = element.defaultValue ? element.defaultValue + "" : "";
              } else if (element.columnDef === "code") {
                code = element.defaultValue ? element.defaultValue + "" : "";
              } else if (element.columnDef === "contactNo") {
                contactNo = element.defaultValue
                  ? element.defaultValue + ""
                  : "";
              } else if (element.columnDef === "country") {
                country = element.defaultValue ? element.defaultValue + "" : "";
              } else if (element.columnDef === "department") {
                department = element.defaultValue
                  ? element.defaultValue + ""
                  : "";
              } else if (element.columnDef === "district") {
                district = element.defaultValue
                  ? element.defaultValue + ""
                  : "";
              } else if (element.columnDef === "email") {
                email = element.defaultValue ? element.defaultValue + "" : "";
              } else if (element.columnDef === "taxId") {
                taxId = element.defaultValue ? element.defaultValue + "" : "";
              } else if (element.columnDef === "state") {
                state = element.defaultValue ? element.defaultValue + "" : "";
              } else if (element.columnDef === "status") {
                status = element.defaultValue ? element.defaultValue : 0;
                statusArray = element.categories ? element.categories : [];
              } else if (element.columnDef === "custLeadValue") {
                custLeadValue = element.defaultValue ? element.defaultValue : 0;
              } else if (element.columnDef === "priority") {
                priority = element.defaultValue
                  ? element.defaultValue + ""
                  : "";
              } else if (element.columnDef === "selectedContactPipeline") {
                selectedContactPipeline = element.defaultValue
                  ? element.defaultValue
                  : 0;
              } else if (element.customField && element.isActive) {
                if (
                  element.inputType == "date_time" ||
                  element.inputType == "date"
                ) {
                  //if field is a date_time or date field convert it to timestamp
                  if (element.defaultValue) {
                    contactAddFArray[element.custIndex] = {
                      fieldValue: element.defaultValue,
                    };
                  }
                } else {
                  //save other field values
                  if (element.defaultValue) {
                    contactAddFArray[element.custIndex] = {
                      fieldValue: element.defaultValue,
                    };
                  }
                }
              }
            }
          });
        });
        let associatedBranch = "none";
        let lastAssignedChanged = false;
        let byUserCallerIndex = 0;
        let byProfileCallerIndex = 0;

        if (formData.assignedToRole == "By User") {
          // if (formData.assignedToArray.length > 0) {
          //   let assignedToSubUser =
          //     formData.assignedToArray[formData.byUserCallerIndex];
          //   if (assignedToSubUser !== superUserId) {
          //     let subUserData = await getSubUserData(
          //       superUserId,
          //       assignedToSubUser
          //     );
          //     if (subUserData) {
          //       assignedTo = subUserData.data().userId;
          //       assignedToName = subUserData.data().firstname;
          //       associatedBranch = subUserData.data().branchId
          //         ? subUserData.data().branchId
          //         : "none";
          //       if (
          //         formData.byUserCallerIndex >=
          //         formData.assignedToArray.length - 1
          //       ) {
          //         byUserCallerIndex = 0;
          //       } else {
          //         if (
          //           formData.byUserCallerIndex ||
          //           formData.byUserCallerIndex == 0
          //         ) {
          //           byUserCallerIndex = formData.byUserCallerIndex + 1;
          //         } else {
          //           byUserCallerIndex = 0;
          //         }
          //       }
          //       lastAssignedChanged = true;
          //     }
          //   } else {
          //     assignedTo = superUserId;
          //     assignedToName =
          //       (superUserdata.firstname ? superUserdata.firstname : "") +
          //       (superUserdata.lastname ? superUserdata.lastname : ""); //assigned to user name
          //     associatedBranch = superUserdata.associatedBranch
          //       ? superUserdata.associatedBranch
          //       : "none";
          //     if (
          //       formData.byUserCallerIndex >=
          //       formData.assignedToArray.length - 1
          //     ) {
          //       byUserCallerIndex = 0;
          //     } else {
          //       if (
          //         formData.byUserCallerIndex ||
          //         formData.byUserCallerIndex == 0
          //       ) {
          //         byUserCallerIndex = formData.byUserCallerIndex + 1;
          //       } else {
          //         byUserCallerIndex = 0;
          //       }
          //     }
          //     lastAssignedChanged = true;
          //   }
          // }
          let oldIndex = formData.byUserCallerIndex;
          //If role is by user
          if (formData.assignedToArray.length > 0) {
            //call recursive function to find the assigned subuser
            let assignObj = assignToSubUser(formData.assignedToArray, formData.byUserCallerIndex, superUserId, superUserdata, lastAssignedChanged, oldIndex)
            //get values from object returned by the function
            assignedTo = (await assignObj).assignedTo;
            assignedToName = (await assignObj).assignedToName;
            associatedBranch = (await assignObj).associatedBranch;
            byUserCallerIndex = (await assignObj).byUserCallerIndex;
            lastAssignedChanged = (await assignObj).lastAssignedChanged;
          }

        } else {
          let callerList = await getCallerList(superUserId,formData.profileName);
          var index = 0;
          let callerIndexs = formData.byProfileCallerIndex
          callerList.forEach((element) => {
            if (index == callerIndexs) {
              assignedTo = element.data().userId;
              assignedToName = element.data().firstname;
              associatedBranch = element.data().branchId
                ? element.data().branchId
                : "none";
              if (formData.byProfileCallerIndex >= callerList.size - 1) {
                byProfileCallerIndex = 0;
              } else {
                if (
                  formData.byProfileCallerIndex ||
                  formData.byProfileCallerIndex == 0
                ) {
                  byProfileCallerIndex = formData.byProfileCallerIndex + 1;
                } else {
                  byProfileCallerIndex = 0;
                }
              }
              lastAssignedChanged = true;
              return;
            }
            index++;
          });
        }

        if (assignedTo == "" || assignedTo == null || assignedTo == undefined) {
          assignedTo = superUserId;
          assignedToName =
            (superUserdata.firstname ? superUserdata.firstname : "") +
            (superUserdata.lastname ? superUserdata.lastname : ""); //assigned to user name
          associatedBranch = superUserdata.associatedBranch
            ? superUserdata.associatedBranch
            : "none";
        }
        let changeLog = [];
        changeLog[0] = {
          changedBy: assignedTo,
          changedByName: assignedToName,
          changesFrom: "FaceBook Integration",
          dateModified: new Date().getTime(),
          currentValues: "",
          previousValues: "",
        };
        let sampleSearchTerm = {
          companyName: companyName.toLowerCase(),
          firstName: firstName.toLowerCase(),
          secondName: secondName.toLowerCase(),
          surname: surname.toLowerCase(),
        };



        let contactStageHistory = [
          {
            date: new Date().getTime(),
            stageId: status,
            pipelineId: selectedContactPipeline,
          },
        ];
        if (companyName) {
          isCompany = true;
        } else {
          isCompany = false;
          companyName = "Individual";
        }

        if (status === statusArray[statusArray.length - 1]) {
          lost = true;
          won = false;
          inPipeline = false;
        } else if (status === statusArray[statusArray.length - 2]) {
          lost = false;
          won = true;
          inPipeline = false;
        } else {
          lost = false;
          won = false;
          inPipeline = true;
        }
        let contactDetails = {
          altContactCode: altContactCode,
          alternateContactNumber: alternateContactNumber,
          billingaddress1: billingaddress1,
          billingaddress2: billingaddress2,
          bpin: bpin,
          code: code,
          companyName: companyName, //use in sales sample data also
          contactNo: contactNo,
          country: country,
          department: department,
          district: district,
          email: email,
          firstName: firstName,
          surname: surname,
          salutation: salutation,
          secondName: secondName,
          taxId: taxId,
          state: state,
          priority: priority,

          inPipeline: inPipeline,
          won: won,
          lost: lost,
          status: status,
          custLeadValue: custLeadValue,

          associatedBranch: associatedBranch ? associatedBranch : "",
          assignedTo: assignedTo,
          assignedToName: assignedToName,
          createdBy: superUserId,
          changeLog: changeLog,

          additionalFieldsArr: contactAddFArray,

          ongoingSales: 0,
          salePipelineValue: 0,
          saleOngoingValue: 0,
          collectedAmount: 0,
          sequenceNumber: contactSequenceNumber,
          invoicedAmount: 0,
          totalAmountCollected: 0,
          orgId: "",
          selectedContactPipeline: selectedContactPipeline,

          createdYear: new Date().getFullYear(),
          currentStatusDate: new Date().getTime(),
          dateCreated: new Date().getTime(),
          month: new Date().getMonth(),

          followUpFlag: 0,
          isCompany: isCompany,

          searchTerm: sampleSearchTerm,
          stageHistory: contactStageHistory,
          lastModifiedDate: new Date().getTime(),
          assignedToDate: new Date().getTime(),
        };
        admin
          .firestore()
          .collection("users/" + superUserId + "/customers")
          .add({
            ...contactDetails,
          })
          .then((respond) => {
            admin
              .firestore()
              .doc("users/" + superUserId)
              .update({
                contactSequentialNumber: contactSequenceNumber,
              })
              .then((resp) => {
                if (formData.assignedToRole == "By User") {
                  if (lastAssignedChanged) {
                    admin
                      .firestore()
                      .doc(
                        "FBForms/" + form_id
                      )
                      .update({
                        byUserCallerIndex: byUserCallerIndex,
                      })

                  } else {

                  }
                } else {
                  if (lastAssignedChanged) {
                    admin
                      .firestore()
                      .doc(
                        "FBForms/"  + form_id
                      )
                      .update({
                        byProfileCallerIndex: byProfileCallerIndex,
                      })

                  } else {

                  }
                }
              });
          })

      } else {

      }
    });
}
function splitNumber(value) {
	const country_codes = ["+91", "+1", "+44", "+93", "+355", "+213", "+376", "+244", "+54", "+374", "+297", "+61", "+43",
  "+994", "+973", "+880", "+375", "+32", "+501", "+229", "+975", "+591", "+387", "+267", "+55", "+246", "+673", "+359",
  "+226", "+257", "+855", "+237", "+238", "+599", "+236", "+235", "+56", "+86", "+57", "+269", "+243", "+242", "+682",
  "+506", "+225", "+385", "+53", "+357", "+420", "+45", "+253", "+593", "+20", "+503", "+240", "+291", "+372", "+251",
  "+500", "+298", "+679", "+358", "+33", "+594", "+689", "+241", "+220", "+995", "+49", "+233", "+350", "+30", "+299",
  "+590", "+502", "+224", "+245", "+592", "+509", "+504", "+852", "+36", "+354", "+62", "+98", "+964", "+353", "+972",
  "+39", "+81", "+962", "+7", "+254", "+686", "+383", "+965", "+996", "+856", "+371", "+961", "+266", "+231", "+218",
  "+423", "+370", "+352", "+853", "+389", "+261", "+265", "+60", "+960", "+223", "+356", "+692", "+596", "+222", "+230",
   "+262", "+52", "+691", "+373", "+377", "+976", "+382", "+212", "+258", "+95", "+264", "+674", "+977", "+31", "+687",
    "+64", "+505", "+227", "+234", "+683", "+672", "+850", "+47", "+968", "+92", "+680", "+970", "+507", "+675", "+595",
    "+51", "+63", "+48", "+351", "+974", "+40", "+250", "+290", "+508", "+685", "+378", "+239", "+966", "+221", "+381",
    "+248", "+232", "+65", "+421", "+386", "+677", "+252", "+27", "+82", "+211", "+34", "+94", "+249", "+597", "+268",
    "+46", "+41", "+963", "+886", "+992", "+255", "+66", "+670", "+228", "+690", "+676", "+216", "+90", "+993", "+688",
    "+256", "+380", "+971", "+598", "+998", "+678", "+58", "+84", "+681", "+967", "+260", "+263", "+358"];

	for (let i = 0; i < country_codes.length; i++) {
	    if(value.includes(country_codes[i])){
	        let code_size = country_codes[i].length;
	        return {"code" : value.substring(0, code_size) , "number" : value.substring(code_size)};
	    }
	}
  return {"code" : '' , "number" : value};
}
async function getSubUserData(superUserId, subUserId) {
  // get user details which phone is equal to receivedNumber
  return await admin
    .firestore()
    .doc("users/" + superUserId + "/subUsers/" + subUserId)
    .get()
    .then((subUserData) => {
      return subUserData;
    });
}
async function getCallerList(superUserId, profileName) {
  // get user details which phone is equal to receivedNumber
  return await admin
    .firestore()
    .collection("users/" + superUserId + "/subUsers")
    .where("status", "==", "active")
    .where("accountType", "==", profileName)
    .get()
    .then((subUserData) => {
      return subUserData;
    });
}
exports.followUpDateUpdateInCustomerWhenFollowupCreated = functions
  .region(region)
  .firestore.document("/users/{userId}/Follow Ups/{documentId}")
  .onCreate((snap, context) => {
    const followUp = snap.data();
    const userId = context.params.userId; //superUserId
    updateFollowupDate(followUp, userId);
  });
async function updateFollowupDate(followUp, superUserId) {
  // check if custmer id is there
  if (followUp.customerId) {
    if (followUp.completedStatus) {
      // if completed update previous followupdate
      updatePreviousFollowupDate(followUp, superUserId);
    } else {
      // if not completed update next followupdate
      updateNextFollowupDate(followUp, superUserId);
    }
  }
}
async function updatePreviousFollowupDate(followup, superUserId) {
  // update previous followupdate in customer
  let followups = await getFollowupByCustomerId(
    followup.customerId,
    superUserId
  );
  let followupsDescendingOrder = followups;
  // sort followup by descending order
  followupsDescendingOrder.sort(
    (a, b) => b.data().callStartDate - a.data().callStartDate
  ); // sort all followup by call start date descending order
  let previousFollowupDate = "";
  let previousFollowupTime = "";
  for (let element of followupsDescendingOrder) {
    if (element.data().completedStatus) {
      previousFollowupDate = element.data().callStartDate;
      previousFollowupTime = element.data().callStartTime;
      break;
    }
  }
  admin
    .firestore()
    .doc("users/" + superUserId + "/customers/" + followup.customerId)
    .update({
      previousFollowupDate: previousFollowupDate,
      previousFollowupTime: previousFollowupTime,
    })
    .then((resp) => {
      console.log("previous followup updated");
    })
    .catch((e) => {
      console.log("error on previous followup updated");
    });
}
async function updateNextFollowupDate(followup, superUserId) {
  // update next followupdate in customer
  let followups = await getFollowupByCustomerId(
    followup.customerId,
    superUserId
  );
  let followupsAscendingOrder = followups;
  // sort followup by ascending order
  followupsAscendingOrder.sort(
    (a, b) => a.data().callStartDate - b.data().callStartDate
  ); // sort open followup by call start date ascending order
  let nextFollowupDate = "";
  let nextFollowupTime = "";
  for (let element of followupsAscendingOrder) {
    if (
      !element.data().completedStatus &&
      element.data().direction == "Outbound"
    ) {
      nextFollowupDate = element.data().callStartDate;
      nextFollowupTime = element.data().callStartTime;
      break;
    }
  }
  admin
    .firestore()
    .doc("users/" + superUserId + "/customers/" + followup.customerId)
    .update({
      nextFollowupDate: nextFollowupDate,
      nextFollowupTime: nextFollowupTime,
    })
    .then((resp) => {
      console.log("next followup updated");
    })
    .catch((e) => {
      console.log("error on next followup updated");
    });
}
exports.followUpDateUpdateInCustomerWhenFollowupEdit = functions
  .region(region)
  .firestore.document("/users/{userId}/Follow Ups/{documentId}")
  .onUpdate((change, context) => {
    var followup = change.after.data(); // new followup details
    var oldfollowup = change.before.data(); // old followup details
    var superUserId = context.params.userId;
    // if followup start date,direction, customer or completed status is changed update next/previous followup date in customer
    if (
      followup.callStartDate != oldfollowup.callStartDate ||
      followup.completedStatus != oldfollowup.completedStatus ||
      followup.direction != oldfollowup.direction ||
      followup.customerId != oldfollowup.customerId
    ) {
      inCustomerUpdateFollowupDate(followup, superUserId, oldfollowup);
    }
  });
async function inCustomerUpdateFollowupDate(
  followup,
  superUserId,
  oldfollowup
) {
  // customer tagged in followup changed update old and new followup date in old and new customer
  // customer tagged in followup is not changed update old and new followup date in  new customer
  if (followup.customerId != oldfollowup.customerId) {
    updatePreviousFollowupDate(oldfollowup, superUserId);
    updateNextFollowupDate(oldfollowup, superUserId);
  }
  updatePreviousFollowupDate(followup, superUserId);
  updateNextFollowupDate(followup, superUserId);
}
async function getFollowupByCustomerId(customerId, superUserId) {
  console.log(customerId, superUserId);
  return await admin
    .firestore()
    .collection("users/" + superUserId + "/Follow Ups")
    .where("customerId", "==", customerId)
    .get()
    .then((followup) => {
      return followup.docs;
    });
}
