import { DatePipe } from '@angular/common';
import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  PaymentReceipt,
  Customer,
  ProductModel,
  Profile,
  Sales,
  SubUsers,
  UserAccessDetails,
  FollowUps,
  Task,
  Expenses,
  Service,
  customerCardFields,
  salesCardFields,
  serviceCardFields,
  sampleContact,
  sampleSale,
  sampleService,
  sampleTask,
  sampleCall,
  changeLogModel,
  QueryOptions,
  taskCardFields,
  followupCardFields,
  OrganisationModel,
  contactSettings,
  SettingsItem,
  defaultSaleSettings,
  defaultContactSettings,
  defaultServiceSettings,
  sampleOrg,
  Branch,
  orgCardFields,
  emailTemp1,
  emailTemp5,
  emailTemp4,
  emailTemp3,
  emailTemp2,
  autom1,
  autom2,
  autom3,
  autom4,
  autom5,
  autom6,
  autom7,
  messageTemplateModel,
  ReportSettingsData,
  dashboardSettingsData,
  customerCardFieldsInvPlan,
  customerCardFieldsLeadPlan,
  Overseas_fields,
  realEst_fields,
  teleMaerketing_fields,
  modules,
  StageHistoryModel,
} from './data-models';
import {
  AddDocumentDisable,
  docCreationLimits,
  UserDatas,
  UserFeatures,
} from './model/productfeatures.model';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from 'date-fns';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  DefaultCustomerPipelines,
  DefaultSalePipelines,
  DefaultServicePipelines,
  Pipelines,
  customerPipelines,
  overSeasPipelineCust,
  overSeasPipelineSale,
  realEstPipelineCust,
  realEstPipelineSale,
  salePipelines,
  servicePipelines,
  teleMarkPipelineCust,
} from './model/pipeline.modal';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  customerFields = customerCardFields;
  salesFields = salesCardFields;
  serviceFields = serviceCardFields;
  taskFieldsDef = taskCardFields;
  followupFieldsDef = followupCardFields;
  add_contact_enabled = false; // varaibel to decide if the logged in user can add a contact
  view_contact_enabled = false;
  view_settings = false; // varaibel to decide if the logged in user can add a contact
  edit_settings = false; // varaibel to decide if the logged in user can add a contact
  //trial_variable: string = "init_value";
  isTabletsize: boolean = false; //Variable to find if the current device screen size if tablet
  isMobilesize: boolean = false; //Variable to find if the current device screen size if mobile
  userData: Profile;
  superUserData: Profile;
  usrProfileData: any;
  subscribedPlan: any;
  contactAddDisabled: boolean;
  userDetails: Subject<Profile> = new Subject<Profile>();
  superUserDetails: Subject<Profile> = new Subject<Profile>();
  userDatas: BehaviorSubject<UserDatas> = new BehaviorSubject<UserDatas>(null);
  userPlan: UserFeatures;
  planChecked: string;
  isFreePopupOpen: boolean = false;
  addDocLimitaion: AddDocumentDisable = {
    addContactDisable: false,
    addSaleDisable: false,
    addEstimateDisable: false,
    addQuotationDisable: false,
    addInvoiceDisable: false,
    balanceCustomers: docCreationLimits.Contact_monthly_limit,
    balanceSales: docCreationLimits.Sales_monthly_limit,
    balanceInvoices: docCreationLimits.Inv_monthly_limit,
    balanceQuotations: docCreationLimits.Quote_monthly_limit,
    balanceEstimates: docCreationLimits.Est_monthly_limit,
    balanceCustomerFlag: false,
    customerOverFlag: false,
  };
  customersInMonth: number;
  // saving Product to edit in mobile to avoid Single product fetch from DB
  productToEdit: ProductModel;
  saleToEdit: Sales;
  taskToEdit: Task;
  paymentToEdit: PaymentReceipt;
  expenseToEdit: Expenses;
  customerToEdit: Customer;
  orgToEdit: OrganisationModel = null;
  customerDetailsforSale: Customer;
  userId: string;
  userAuthDetails: firebase.default.UserInfo;
  subUserDetails: SubUsers[];
  branches: Branch[];
  products: ProductModel[];
  organisations: OrganisationModel[];
  waTempls: messageTemplateModel[];
  changeDetectionEmitter: EventEmitter<void> = new EventEmitter<void>();
  followUpDetails: FollowUps; // for edit followup
  productCat: string[] = [];
  logoutToBeRecorded = false;
  callLogOut = new Subject();
  autoLogouts = false;
  serviceToEdit: Service;

  disableUploadFile = false;
  disableUploadCSV = false;
  tableDefaultData: any[]; // default data for table

  followupViewId: number = 0; // followup view selected id
  followUpDefaultView: string = 'grid'; //decides if view grid/ table for followup
  followUpView: string = 'grid'; //decides if view grid/ table for followup

  taskViewId: number = 0; // task view selected id
  taskDefaultView: string = 'grid'; //decides if view grid/ table for task
  taskView: string = 'grid'; //decides if view grid/ table for task
  selectedReportListModule: string = 'customer'; // for storing selected report in report list

  customerPipelines: Pipelines[] = []; // customer pipeline array
  salePipelines: Pipelines[] = []; // sale pipeline array
  servicePipelines: Pipelines[] = []; // service pipeline array
  defaultCustomerPipelines: any;
  defaultSalePipelines: any;
  defaultServicePipelines: any;
  firstCustomerPipeline: number;
  firstSalePipeline: number;
  firstServicePipeline: number;
  customCustomerPipelines: Pipelines[] = []; //save custom customer pipeline to a local variable
  customSalePipelines: Pipelines[] = []; //save custom customer pipeline to a local variable

  constructor(
    private firestore: AngularFirestore,
    public datepipe: DatePipe,
    private http: HttpClient
  ) {
    // console.log("userDetails : " +this.userDetails)
    //Read the following from signed in user: 1. Profile assigned, 2. Data Access Rule
    //Read the following fromm corresponding super user: 1. Profile definition 2. Plan
    //Logic for enabling/ disabling add contact
    //If free trial and less than tiral duration and user profile has create access, then
    //this.add_contact_enabled =  true;
    //Logic for accessing settings
    //If the prfole setting for signed in user is enabled
    //this.add_contact_enabled =  true;
    // console.log(this.logoutToBeRecorded);
  }

  //store the user profile
  updateUserData(data: Profile) {
    this.userData = data;
  }

  //store the super user profile
  updateSuperUserData(superUserData: Profile) {
    this.superUserData = superUserData;
    //console.log("Super user data", this.superUserData)
    this.subscribedPlan = superUserData?.plan;
    this.changeDetectionEmitter.emit();
  }

  //store the user profile (assigned profile for access)
  updateUsrProfileDetails(data) {
    this.usrProfileData = data;
  }
  getProfileData() {
    return this.usrProfileData;
  }
  updateUserPlan(data) {
    this.userPlan = data;
  }
  updateUserLimitation(data) {
    this.addDocLimitaion = data;
  }
  onUpdatePlanCheck(data) {
    this.planChecked = data;
  }
  onUpdateCustomersInMonth(data) {
    this.customersInMonth = data;
  }

  getUserData() {
    return this.userData;
  }
  getSuperUserData() {
    return this.superUserData;
  }
  getUserPlan() {
    return this.userPlan;
  }
  getUserId() {
    return this.userId;
  }
  updateUserAuthDetails(authDetails: firebase.default.UserInfo) {
    this.userAuthDetails = authDetails;
    this.userId = this.userAuthDetails?.uid;
  }
  updatesubUserDetails(subUserDetails: SubUsers[]) {
    this.subUserDetails = subUserDetails;
  }
  updateCustomerPipelines(customerPipelines: Pipelines[]) {
    this.customerPipelines = customerPipelines;
  }
  updateSalePipelines(salePipelines: Pipelines[]) {
    this.salePipelines = salePipelines;
  }
  updateSuppPipelines(servicePipelines: Pipelines[]) {
    this.servicePipelines = servicePipelines;
  }
  getSubUsersforComponents() {
    return this.subUserDetails;
  }
  updatebranchDetails(branches: Branch[]) {
    this.branches = branches;
  }
  getbranchforComponents() {
    return this.branches;
  }
  updateproductDetails(products: ProductModel[]) {
    this.products = products;
  }
  getproductforComponents() {
    return this.products;
  }
  updateOrgDetails(organisations: OrganisationModel[]) {
    this.organisations = organisations;
  }
  // update fetched Whatsapp templates
  updateWhatsappTemplates(waTempls: messageTemplateModel[]) {
    this.waTempls = waTempls;
  }
  getOrgforComponents() {
    return this.organisations;
  }
  getUserAuthDetails() {
    return this.userAuthDetails;
  }
  updateSaleToEdit(data) {
    this.saleToEdit = data;
  }
  getSaleToEdit() {
    return this.saleToEdit;
  }
  updateStatus(data) {
    this.disableUploadFile = data;
  }
  getStatus() {
    return this.disableUploadFile;
  }
  updateCSVStatus(data: boolean) {
    this.disableUploadCSV = data;
  }
  getCSVStatus() {
    return this.disableUploadCSV;
  }
  updateserviceToEdit(data) {
    this.serviceToEdit = data;
  }
  getserviceToEdit() {
    return this.serviceToEdit;
  }
  updateServiceToEdit(data) {
    this.serviceToEdit = data;
  }
  getServiceToEdit() {
    return this.serviceToEdit;
  }
  updateTaskToEdit(data) {
    this.taskToEdit = data;
  }
  getTaskToEdit() {
    return this.taskToEdit;
  }
  updatePaymentToEdit(data) {
    this.paymentToEdit = data;
  }
  getPaymentToEdit() {
    return this.paymentToEdit;
  }
  updateExpenseToEdit(data) {
    this.expenseToEdit = data;
  }
  getExpenseToEdit() {
    return this.expenseToEdit;
  }
  updateCustForSaleToEdit(data) {
    this.customerDetailsforSale = data;
  }
  getCustForSaleToEdit() {
    return this.customerDetailsforSale;
  }
  updateProductToEdit(data) {
    this.productToEdit = data;
  }
  getProductToEdit() {
    return this.productToEdit;
  }
  updateProductCat(data) {
    this.productCat = data;
  }
  getProductCat() {
    return this.productCat;
  }
  updateCustomerToEdit(data) {
    this.customerToEdit = data;
  }
  getCustomerToEdit() {
    return this.customerToEdit;
  }
  updateOrgToEdit(data) {
    this.orgToEdit = data;
  }
  getOrgToEdit() {
    return this.orgToEdit;
  }
  updateLogOut(data) {
    this.logoutToBeRecorded = data;
  }
  getLogOut() {
    return this.logoutToBeRecorded;
  }
  updateAutoLogOut(data) {
    this.autoLogouts = data;
  }
  getAutoLogOut() {
    return this.autoLogouts;
  }

  getUserDetailsFromDb(userId: string) {
    // for getting user details
    return this.firestore.doc<Profile>('users/' + userId).valueChanges();
  }
  getSuperUserDetailsFromDb(superUserId: string) {
    // for getting super user details
    return this.firestore.doc<Profile>('users/' + superUserId).valueChanges();
  }
  getsubUsersFormDb(superuserId: any) {
    // for getting all sub users
    return this.firestore
      .collection('users/' + superuserId + '/subUsers')
      .snapshotChanges();
  }
  getbranchesFormDb(superuserId: any) {
    // for getting all sub users
    return this.firestore
      .collection('users/' + superuserId + '/branches')
      .snapshotChanges();
  }
  getorgsFormDb(superuserId: any) {
    // for getting all sub users
    return this.firestore
      .collection('users/' + superuserId + '/Organisations')
      .snapshotChanges();
  }
  // for getting all whatsapp templates
  getAllWaTemp(superUserId) {
    return this.firestore
      .collection('users/' + superUserId + '/messageTemplates', (ref) =>
        ref.where('templateType', '==', 'WhatsApp')
      )
      .snapshotChanges();
  }
  getproductsFormDb(superuserId: any) {
    // for getting all sub users
    return this.firestore
      .collection('users/' + superuserId + '/products')
      .snapshotChanges();
  }
  getProfileDefinitionFromDb(superUserId: string, profilename: string) {
    // for getting acces control rule of user
    return this.firestore
      .collection<UserAccessDetails>(
        'users/' + superUserId + '/profilesDefault',
        (ref) => ref.where('profileName', '==', profilename)
      )
      .valueChanges();
  }

  //Function to check if a prticular user is team manager of another user
  checkTeamMember(managerId, assignedToId) {
    let assignedToUserDetails: any;
    //get the subuser object based on id
    assignedToUserDetails = this.subUserDetails.filter((obj) => {
      return obj.userId === assignedToId;
    });
    //Check if the assigned to user reports to the signed in user (if assigned to is super user, filter will not return any result, hence handle for empty array as well)
    if (
      assignedToUserDetails.length > 0 &&
      assignedToUserDetails[0].reportsToId === managerId
    ) {
      return true;
    } else {
      return false;
    }
  }
  //Function to check if a prticular user is team manager of another user
  checkBranchMember(branchId, assignedToId) {
    let assignedToUserDetails: any;
    //get the subuser object based on id
    assignedToUserDetails = this.subUserDetails.filter((obj) => {
      return obj.userId === assignedToId;
    });
    //Check if the assigned to user reports to the signed in user (if assigned to is super user, filter will not return any result, hence handle for empty array as well)
    if (
      assignedToUserDetails.length > 0 &&
      assignedToUserDetails[0].branchId === branchId
    ) {
      return true;
    } else {
      return false;
    }
  }
  //function to check if data access is allowed for a particular user to a particular record
  //return true if access is allowed, else false
  checkDataAccessRule(module, userId, assignedToId, branchId) {
    //if contact module
    if (module == 'customers') {
      let viewContact = false;
      //If the user's acces to contact module is blocked or contact view access is blocked set the flag
      if (
        this.usrProfileData.isCheckedCont == false ||
        this.usrProfileData.contactsView == false
      ) {
        viewContact = false;
      } else {
        viewContact = true;
      }
      //If contact access/ view is diabled, then return false
      if (!viewContact) {
        return false;
      } else {
        //if data access rule for contact is all, allow access
        if (this.usrProfileData[0].contactDataAccessRule == 'All') {
          return true;
          //if data access rule for contact is own, allow access if asigned to and signed in uer are same
        } else if (this.usrProfileData[0].contactDataAccessRule == 'Own') {
          return userId == assignedToId;
          //if data access rule for contact is team, allow access if asigned to and reports to user
        } else if (this.usrProfileData[0].contactDataAccessRule == 'Team') {
          if (userId == assignedToId) {
            return true;
          } else {
            if (this.checkTeamMember(userId, assignedToId)) {
              return true;
            } else {
              return false;
            }
          }
          // if data access rule is branch and customer branch is same, return true
        } else if (this.usrProfileData[0].contactDataAccessRule == 'Branch') {
          let userBranch = this.getBranch(this.userId);
          if (userBranch == branchId) {
            return true;
          } else {
            return false;
          }
          // if logged in user is tagged for this particular contact themn also return true
        } else {
          /* if (userId == assignedToId) {
            return true;
          } else {
            const userBranch = this.subUserDetails.find(
              (item) => item.userId === userId
            )?.branchId
              ? this.subUserDetails.find((item) => item.userId === userId)
                  ?.branchId
              : this.userData.associatedBranch
              ? this.userData.associatedBranch
              : 'none';
            if (this.checkBranchMember(userBranch, assignedToId)) {
              return true;
            } else {
              return false;
            }
          }*/
          return false;
        }
      }
    } else if (module == 'sales') {
      let viewSale = false;
      //If the user's acces to contact module is blocked or contact view access is blocked set the flag
      if (
        this.usrProfileData.isCheckedSale == false ||
        this.usrProfileData.salesView == false
      ) {
        viewSale = false;
      } else {
        viewSale = true;
      }
      if (!viewSale) {
        return false;
      } else {
        //if data access rule for sale is all, allow access
        if (this.usrProfileData[0].saleDataAccessRule == 'All') {
          return true;
          //if data access rule for sales is own, allow access if asigned to and signed in uer are same
        } else if (this.usrProfileData[0].saleDataAccessRule == 'Own') {
          return userId == assignedToId;
          //if data access rule for sale is team, allow access if asigned to and reports to user
        } else if (this.usrProfileData[0].saleDataAccessRule == 'Team') {
          if (userId == assignedToId) {
            return true;
          } else {
            if (this.checkTeamMember(userId, assignedToId)) {
              return true;
            } else {
              return false;
            }
          }
        } else if (this.usrProfileData[0].saleDataAccessRule == 'Branch') {
          /*if (userId == assignedToId) {
            return true;
          } else {
            const userBranch = this.subUserDetails.find(
              (item) => item.userId === userId
            )?.branchId
              ? this.subUserDetails.find((item) => item.userId === userId)
                  ?.branchId
              : this.userData.associatedBranch
              ? this.userData.associatedBranch
              : 'none';
            if (this.checkBranchMember(userBranch, assignedToId)) {
              return true;
            } else {
              return false;
            }
          }*/

          let userBranch = this.getBranch(this.userId);
          if (userBranch == branchId) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    } else if (module == 'services') {
      let viewService = false;
      //If the user's acces to contact module is blocked or contact view access is blocked set the flag
      if (
        this.usrProfileData.isCheckedService == false ||
        this.usrProfileData.servicesView == false
      ) {
        viewService = false;
      } else {
        viewService = true;
      }
      if (!viewService) {
        return false;
      } else {
        //if data access rule for sale is all, allow access
        if (this.usrProfileData[0].serviceDataAccessRule == 'All') {
          return true;
          //if data access rule for sales is own, allow access if asigned to and signed in uer are same
        } else if (this.usrProfileData[0].serviceDataAccessRule == 'Own') {
          return userId == assignedToId;
          //if data access rule for sale is team, allow access if asigned to and reports to user
        } else if (this.usrProfileData[0].serviceDataAccessRule == 'Team') {
          if (userId == assignedToId) {
            return true;
          } else {
            if (this.checkTeamMember(userId, assignedToId)) {
              return true;
            } else {
              return false;
            }
          }
        } else if (this.usrProfileData[0].serviceDataAccessRule == 'Branch') {
          /*if (userId == assignedToId) {
            return true;
          } else {
            const userBranch = this.subUserDetails.find(
              (item) => item.userId === userId
            )?.branchId
              ? this.subUserDetails.find((item) => item.userId === userId)
                  ?.branchId
              : this.userData.associatedBranch
              ? this.userData.associatedBranch
              : 'none';
            if (this.checkBranchMember(userBranch, assignedToId)) {
              return true;
            } else {
              return false;
            }
          }*/
          let userBranch = this.getBranch(this.userId);
          if (userBranch == branchId) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    } else if (module == 'organisations') {
      let viewOrg = false;
      //If the user's acces to contact module is blocked or contact view access is blocked set the flag
      if (
        this.usrProfileData.isCheckedOrg == false ||
        this.usrProfileData.orgsView == false
      ) {
        viewOrg = false;
      } else {
        viewOrg = true;
      }
      if (!viewOrg) {
        return false;
      } else {
        //if data access rule for sale is all, allow access
        if (this.usrProfileData[0].orgDataAccessRule == 'All') {
          return true;
          //if data access rule for sales is own, allow access if asigned to and signed in uer are same
        } else if (this.usrProfileData[0].orgDataAccessRule == 'Own') {
          return userId == assignedToId;
          //if data access rule for sale is team, allow access if asigned to and reports to user
        } else if (this.usrProfileData[0].orgDataAccessRule == 'Team') {
          if (userId == assignedToId) {
            return true;
          } else {
            if (this.checkTeamMember(userId, assignedToId)) {
              return true;
            } else {
              return false;
            }
          }
        } else if (this.usrProfileData[0].orgDataAccessRule == 'Branch') {
          /*if (userId == assignedToId) {
            return true;
          } else {
            const userBranch = this.subUserDetails.find(
              (item) => item.userId === userId
            )?.branchId
              ? this.subUserDetails.find((item) => item.userId === userId)
                  ?.branchId
              : this.userData.associatedBranch
              ? this.userData.associatedBranch
              : 'none';
            if (this.checkBranchMember(userBranch, assignedToId)) {
              return true;
            } else {
              return false;
            }
          }*/

          let userBranch = this.getBranch(this.userId);
          if (userBranch == branchId) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    }
  }
  // view check whether tagged user and allow access
  checkTaggedUser(module, userId, taggedUserIdArray) {
    //if contact module
    if (module == 'customers') {
      let viewContact = false;
      //If the user's acces to contact module is blocked or contact view access is blocked set the flag
      if (
        this.usrProfileData.isCheckedCont == false ||
        this.usrProfileData.contactsView == false
      ) {
        viewContact = false;
      } else {
        viewContact = true;
      }
      //If contact access/ view is diabled, then return false
      if (!viewContact) {
        return false;
      } else if (taggedUserIdArray !== null && taggedUserIdArray.length > 0) {
        if (taggedUserIdArray.includes(userId)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else if (module == 'sales') {
      let viewSale = false;
      //If the user's acces to sales module is blocked or sales view access is blocked set the flag
      if (
        this.usrProfileData.isCheckedSale == false ||
        this.usrProfileData.salesView == false
      ) {
        viewSale = false;
      } else {
        viewSale = true;
      }
      if (!viewSale) {
        return false;
      } else if (taggedUserIdArray !== null && taggedUserIdArray.length > 0) {
        //check for tagged user case
        if (taggedUserIdArray.includes(userId)) {
          //if tagged user, then permit view access
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else if (module == 'services') {
      let viewService = false;
      //If the user's acces to service module is blocked or service view access is blocked set the flag
      if (
        this.usrProfileData.isCheckedService == false ||
        this.usrProfileData.servicesView == false
      ) {
        viewService = false;
      } else {
        viewService = true;
      }
      if (!viewService) {
        return false;
      } else if (taggedUserIdArray !== null && taggedUserIdArray.length > 0) {
        //check for tagged user case
        if (taggedUserIdArray.includes(userId)) {
          //if tagged user, then permit view access
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  getCardFields(module, fieldNameContactNotes, fieldNameFollowup) {
    //Function to get the list of fields to be displayed inside customer/ sale/ service cards based on user settings, additional fields and field customization for module
    let cardFields = [];
    let displayFields = [];
    let userDetails = this.userData;
    let fieldCustomSettings: any = [];
    let fieldCustomSettingsContact: any = [];
    let customFields: any = [];

    if (module == 'customer') {
      if (userDetails.customerCardFields) {
        //console.log("customer card fields", userDetails.customerCardFields)
        //if the customer card fields are present in the
        cardFields = userDetails.customerCardFields;
      } else {
        if (userDetails.plan == 'invoicing') {
          cardFields = customerCardFieldsInvPlan;
          this.tableDefaultData = customerCardFieldsInvPlan;
        } else if (userDetails.plan == 'leadManagement') {
          cardFields = customerCardFieldsLeadPlan;
          this.tableDefaultData = customerCardFieldsLeadPlan;
        } else {
          cardFields = this.customerFields;
        }
      }
      if (userDetails.plan == 'invoicing') {
        this.tableDefaultData = customerCardFieldsInvPlan;
      } else if (userDetails.plan == 'leadManagement') {
        this.tableDefaultData = customerCardFieldsLeadPlan;
      } else {
        this.tableDefaultData = this.customerFields;
      }
      fieldCustomSettings = this.superUserData.contactSettings; //field customization settings
      customFields = this.superUserData.customFieldsContact; //Additional fields
    } else if (module == 'sale') {
      if (userDetails.saleCardFields) {
        cardFields = userDetails.saleCardFields;
      } else {
        cardFields = this.salesFields;
      }
      this.tableDefaultData = this.salesFields;
      fieldCustomSettings = this.superUserData.saleSettings;
      fieldCustomSettingsContact = this.superUserData.contactSettings;
      customFields = this.superUserData.customFieldsSale;
    } else if (module == 'service') {
      if (userDetails.serviceCardFields) {
        cardFields = userDetails.serviceCardFields;
      } else {
        cardFields = this.serviceFields;
      }
      this.tableDefaultData = this.serviceFields;
      fieldCustomSettings = this.superUserData.serviceSettings;
      fieldCustomSettingsContact = this.superUserData.contactSettings;
      customFields = this.superUserData.customFieldsService;
    } else if (module == 'task') {
      if (userDetails.taskCardFields) {
        cardFields = userDetails.taskCardFields;
      } else {
        cardFields = this.taskFieldsDef;
      }
      this.tableDefaultData = this.taskFieldsDef;
      // console.log('card fields', cardFields)
      fieldCustomSettings = this.superUserData.taskSettings;
      customFields = this.superUserData.customFieldsTask;
    } else if (module == 'followup') {
      if (userDetails.followupCardFields) {
        cardFields = userDetails.followupCardFields;
      } else {
        cardFields = this.followupFieldsDef;
      }
      this.tableDefaultData = this.followupFieldsDef;
      // console.log('card fields', cardFields)
      fieldCustomSettings = this.superUserData.followUpSettings;
      fieldCustomSettingsContact = this.superUserData.contactSettings; //field customization settings
      customFields = this.superUserData.customFieldsFollowUp;
    } else if (module == 'Organisation') {
      if (userDetails.orgCardFields) {
        //console.log("customer card fields", userDetails.customerCardFields)
        //if the customer card fields are present in the
        cardFields = userDetails.orgCardFields;
      } else {
        cardFields = orgCardFields;
      }
      // console.log('org card fields', cardFields);
      this.tableDefaultData = orgCardFields;
      fieldCustomSettings = this.superUserData.organisationSettings; //field customization settings
      customFields = this.superUserData.customFieldsOrganisation; //Additional fields
    }
    //check and add any new fields in the data model an dremove additional field which is deleted
    if (customFields !== undefined && customFields.length > 0) {
      //check and add any additional fields configured newly if these are not present in the customFields array
      for (var i = customFields.length - 1; i >= 0; i--) {
        // customFields.forEach((element, index) => {
        let field = 'additionalFieldsArr[' + i + ']fieldValue';
        // check if the field is active or not
        if (customFields[i]?.isActive) {
          let fieldPresent = false;
          cardFields.forEach((col) => {
            if (
              col.ind == i &&
              col.fieldType == 'Additional' &&
              col.header != customFields[i]?.fieldName
            ) {
              col.header = customFields[i]?.fieldName;
            }

            if (col.columnDef == field) {
              fieldPresent = true;
              // console.log("Field present")
            }
          });

          if (fieldPresent == false) {
            cardFields.push({
              columnDef: field,
              header: customFields[i].fieldName,
              display: false,
              type: customFields[i].fieldType,
              fieldType: 'Additional',
              ind: i,
            });
          }
        } else {
          cardFields.forEach((col, k) => {
            if (
              col.ind == i &&
              col.fieldType == 'Additional' &&
              cardFields[k]?.columnDef ==
                'additionalFieldsArr[' + i + ']fieldValue'
            ) {
              cardFields?.splice(k, 1);
            }
          });
        }
      }
    }
    let object1Names = this.tableDefaultData?.map((obj) => obj.columnDef); // for caching the result
    let objectNames = cardFields?.map((obj) => obj.columnDef); // for caching the result
    object1Names?.filter((ele) => {
      if (!objectNames?.includes(ele)) {
        this.tableDefaultData.filter((data) => {
          if (data.columnDef === ele) {
            cardFields.push(data);
            return;
          }
        });
      }
    });
    // for handling the fieldname customization and remove column if it is unchecked in fieldname settings
    for (var i = cardFields.length - 1; i >= 0; i--) {
      if (fieldCustomSettings) {
        Object.keys(fieldCustomSettings).forEach((ele) => {
          if (cardFields[i]?.columnDef == ele) {
            cardFields[i].header = fieldCustomSettings[`${ele}`].displayName;
            if (!fieldCustomSettings[`${ele}`].display) {
              cardFields.splice(i, 1); // removing the column
            }
          }
        });
      }
      if (
        cardFields[i]?.columnDef == 'contactNumber' &&
        module == 'followup' &&
        fieldCustomSettingsContact
      ) {
        cardFields[i].header =
          fieldCustomSettingsContact[`${'contactNo'}`].displayName;
      }
      if (
        cardFields[i]?.columnDef == 'contactNumber' &&
        (module == 'sale' || module == 'service') &&
        fieldCustomSettingsContact
      ) {
        let ele = 'contactNo';
        cardFields[i].header = fieldCustomSettingsContact[`${ele}`].displayName;
        if (!fieldCustomSettingsContact[`${ele}`].display) {
          cardFields.splice(i, 1); // removing the column
        }
      } else if (
        cardFields[i]?.columnDef == 'altContactNumber' &&
        (module == 'sale' || module == 'service') &&
        fieldCustomSettingsContact
      ) {
        let ele = 'alternateContactNumber';
        cardFields[i].header = fieldCustomSettingsContact[`${ele}`].displayName;
        if (!fieldCustomSettingsContact[`${ele}`].display) {
          cardFields.splice(i, 1); // removing the column
        }
      }
    }

    //to remove branch from cardFields if branch is not enabled
    if (!this.userPlan.branchEnabled) {
      cardFields = cardFields.filter(
        (val) => val.columnDef !== 'associatedBranch'
      );
    }
    cardFields.forEach((ele) => {
      // for changing the header by custom field name
      if (ele?.columnDef == 'lastNoteDate') {
        ele.header = 'Last ' + fieldNameContactNotes + ' Date';
      } else if (ele?.columnDef == 'lastAddedNote') {
        ele.header = 'Last ' + fieldNameContactNotes;
      } else if (ele?.columnDef == 'nextFollowupDate') {
        ele.header = 'Next ' + fieldNameFollowup + ' Date';
      } else if (ele?.columnDef == 'previousFollowupDate') {
        ele.header = 'Previous ' + fieldNameFollowup + ' Date';
      }
      if (ele.display == true) {
        displayFields.push(ele);
      }
    });
    return [cardFields, displayFields];
  }

  //function to get values of field for sorting without doing any manipulaitons
  getFieldValueSort(field, data) {
    let cellValue: any;
    if (field.fieldType == 'Additional') {
      try {
        let addnlFieldArray = data.additionalFieldsArr; // Get the sepcific value
        cellValue = addnlFieldArray[field.ind].fieldValue;
      } catch {
        cellValue = '';
      }
    } else {
      // if normal field get the value

      if (field.fieldType == 'docData') {
        if (field.columnDef == 'docData.createdDate') {
          cellValue = data.docData.createdDate;
        }
        if (field.columnDef == 'docData.docDate') {
          cellValue = data.docData.docDate;
        }
      } else {
        cellValue = data[field.columnDef];
      }
    }
    return cellValue;
  }

  getFieldValue(field, data, moduleName) {
    let cellValue: any;
    if (field.fieldType == 'Additional') {
      try {
        let addnlFieldArray = data.additionalFieldsArr; // Get the sepcific value
        cellValue = addnlFieldArray[field.ind].fieldValue;
      } catch {
        cellValue = '';
      }
    } else {
      // if normal field get the value
      try {
        cellValue = data[field.columnDef];
      } catch {
        cellValue = '';
      }
    }

    //fieldSplit = fieldSplit.split("]",1)

    //function to display the values in each cell of the table
    if (field.type == 'date') {
      if (typeof cellValue === 'number') {
        //if the date is stored as normal number and not timestamp
        try {
          return this.datepipe.transform(new Date(cellValue), 'dd-MM-yyyy');
        } catch {
          return '';
        }
      } else {
        //If the field type is in timestamp, then convert to date format
        let dateTemp = cellValue;
        //console.log("Date", dateTemp)
        try {
          //to hanndle cases where data is not presenet
          return this.datepipe.transform(
            new Date(dateTemp.seconds * 1000),
            'dd-MM-yyyy'
          );
        } catch {
          //if data is not present return empty string
          return '';
        }
      }
    } else if (field.type == 'date_time') {
      if (typeof cellValue === 'number') {
        //if the date is stored as normal number and not timestamp
        try {
          return this.datepipe.transform(new Date(cellValue), 'dd-MM-yyyy');
        } catch {
          return '';
        }
      } else {
        if (
          field.columnDef != 'nextFollowupDate' &&
          field.columnDef != 'previousFollowupDate'
        ) {
          //If the field type is in timestamp, then convert to date format
          let dateTemp = cellValue;
          //console.log("Date", dateTemp)
          try {
            //to hanndle cases where data is not presenet
            return this.datepipe.transform(
              new Date(dateTemp.seconds * 1000),
              'dd-MM-yyyy hh:mm a'
            );
          } catch {
            //if data is not present return empty string
            return '';
          }
        } else if (field.columnDef == 'nextFollowupDate') {
          // for displaying date with time
          //If the field type is in timestamp, then convert to date format
          let dateTemp = cellValue;
          //console.log("Date", dateTemp)
          try {
            //to hanndle cases where data is not presenet

            let nextFollowupTime = data.nextFollowupTime
              ? this.transformTo12Hour(data.nextFollowupTime)
              : '';
            return (
              this.datepipe.transform(
                new Date(dateTemp.seconds * 1000),
                'dd-MM-yyyy'
              ) +
              ' ' +
              nextFollowupTime
            );
          } catch {
            //if data is not present return empty string
            return '';
          }
        } else if (field.columnDef == 'previousFollowupDate') {
          // for displaying date with time
          //If the field type is in timestamp, then convert to date format
          let dateTemp = cellValue;
          //console.log("Date", dateTemp)
          try {
            //to hanndle cases where data is not presenet

            let previousFollowupTime = data.previousFollowupTime
              ? this.transformTo12Hour(data.previousFollowupTime)
              : '';
            return (
              this.datepipe.transform(
                new Date(dateTemp.seconds * 1000),
                'dd-MM-yyyy'
              ) +
              ' ' +
              previousFollowupTime
            );
          } catch {
            //if data is not present return empty string
            return '';
          }
        }
      }
    } else if (field.columnDef == 'createdBy') {
      let userIdList = [];
      let userDetailsAll = [];
      let createdBy: any;
      [userIdList, userDetailsAll] = this.createUserlist('All', 'any'); //create list of all subusers
      //console.log('users', userDetailsAll, cellValue)
      userDetailsAll.forEach((ele) => {
        if (ele.userId == cellValue) {
          createdBy = ele;
        }
      });
      /*createdBy = userDetailsAll.filter((ele)=>
         ele.userId == cellValue
      )
      //console.log("created by",createdBy)
      //return this.userNamesArray[this.userIdsArray.indexOf(cellValue)];//Get the name corresponding to the Id*/
      try {
        return createdBy.firstname + ' ' + createdBy.lastname;
      } catch {
        return 'Auto';
      }
    } else if (field.columnDef == 'associatedBranch') {
      const pos = this.branches.map((e) => e.id).indexOf(cellValue);

      try {
        return this.branches[pos].name;
      } catch {
        return 'NA';
      }
    } else if (
      field.columnDef == 'contactNumber' &&
      (moduleName == modules.sales || moduleName == modules.services)
    ) {
      let countryCode = data.countryCode ? data.countryCode : '';
      let contactNumber = cellValue ? cellValue : '';
      return countryCode + ' ' + contactNumber;
    } else if (
      field.columnDef == 'altContactNumber' &&
      (moduleName == modules.sales || moduleName == modules.services)
    ) {
      let altCountryCode = data.altCountryCode ? data.altCountryCode : '';
      let altContactNumber = cellValue ? cellValue : '';
      return altCountryCode + ' ' + altContactNumber;
    } else {
      //get the value stored in the corresponding field
      try {
        return cellValue; // this needs to be replaced with string literals
      } catch {
        return '';
      }
    }
  }

  addSampleReport(userId: string, profile?) {
    let reportSettings = ReportSettingsData;
    let contactModName = 'Customer';
    let saleModName = 'Sale';
    let taskModName = 'Task';
    let callModName = 'Call';
    let suppModName = 'Support';
    let estModName = 'Estimate';
    let quotModName = 'Quotation';
    let invModName = 'Invoice';
    let collModName = 'Collection';
    let expModName = 'Expense';

    if (profile === 'Overseas Education') {
      contactModName = Overseas_fields.fieldNames.fieldNameContact;
      saleModName = Overseas_fields.fieldNames.fieldNameSale;
      taskModName = Overseas_fields.fieldNames.fieldNameTask;
      callModName = Overseas_fields.fieldNames.fieldNameFollowup;
      suppModName = Overseas_fields.fieldNames.fieldNameService;
      estModName = Overseas_fields.fieldNames.fieldNameEstimate;
      quotModName = Overseas_fields.fieldNames.fieldNameQuotation;
      invModName = Overseas_fields.fieldNames.fieldNameInvoice;
      collModName = Overseas_fields.fieldNames.fieldNameCollection;
      expModName = Overseas_fields.fieldNames.fieldNameExpense;
    } else if (profile === 'Real Estate') {
      contactModName = realEst_fields.fieldNames.fieldNameContact;
      saleModName = realEst_fields.fieldNames.fieldNameSale;
      taskModName = realEst_fields.fieldNames.fieldNameTask;
      callModName = realEst_fields.fieldNames.fieldNameFollowup;
      suppModName = realEst_fields.fieldNames.fieldNameService;
      estModName = realEst_fields.fieldNames.fieldNameEstimate;
      quotModName = realEst_fields.fieldNames.fieldNameQuotation;
      invModName = realEst_fields.fieldNames.fieldNameInvoice;
      collModName = realEst_fields.fieldNames.fieldNameCollection;
      expModName = realEst_fields.fieldNames.fieldNameExpense;
    } else if (profile === 'Tele-Sales') {
      contactModName = teleMaerketing_fields.fieldNames.fieldNameContact;
      saleModName = teleMaerketing_fields.fieldNames.fieldNameSale;
      taskModName = teleMaerketing_fields.fieldNames.fieldNameTask;
      callModName = teleMaerketing_fields.fieldNames.fieldNameFollowup;
      suppModName = teleMaerketing_fields.fieldNames.fieldNameService;
      estModName = teleMaerketing_fields.fieldNames.fieldNameEstimate;
      quotModName = teleMaerketing_fields.fieldNames.fieldNameQuotation;
      invModName = teleMaerketing_fields.fieldNames.fieldNameInvoice;
      collModName = teleMaerketing_fields.fieldNames.fieldNameCollection;
      expModName = teleMaerketing_fields.fieldNames.fieldNameExpense;
    }
    reportSettings[0].title = `${contactModName}s in pipeline`;
    reportSettings[0].pipelineSelected =
      this.defaultCustomerPipelines.customerPipelines[0].pipelineId;
    reportSettings[1].title = `All ${saleModName}s closing this month`;
    reportSettings[1].pipelineSelected =
      this.defaultSalePipelines.salePipelines[0].pipelineId;
    reportSettings[2].title = `${contactModName}s lost this month`;
    reportSettings[2].pipelineSelected =
      this.defaultCustomerPipelines.customerPipelines[0].pipelineId;
    reportSettings[3].title = `This month's ${taskModName}s`;
    reportSettings[4].title = `This month's ${callModName}s`;
    reportSettings[5].title = `${contactModName}s won this month`;
    reportSettings[5].pipelineSelected =
      this.defaultCustomerPipelines.customerPipelines[0].pipelineId;
    reportSettings[6].title = `${saleModName}s completed this month`;
    reportSettings[6].pipelineSelected =
      this.defaultSalePipelines.salePipelines[0].pipelineId;
    reportSettings[7].title = `${invModName}s created this month`;
    reportSettings[8].title = `${expModName}s added this month`;
    reportSettings[9].title = `${collModName}s added this month`;
    reportSettings[10].title = `${suppModName} tickets added this month`;
    reportSettings[10].pipelineSelected =
      this.defaultServicePipelines.servicePipelines[0].pipelineId;
    reportSettings[11].title = `${quotModName}s created this month`;
    reportSettings[12].title = `${estModName}s created this month`;
    reportSettings[13].title = `${saleModName}s in progress`;
    reportSettings[13].pipelineSelected =
      this.defaultSalePipelines.salePipelines[0].pipelineId;

    reportSettings.forEach((element, index) => {
      return this.firestore
        .collection('users/' + userId + '/reports')
        .doc(index.toLocaleString())
        .set({ ...element });
    });
  }

  addSampleDashBoardReport(userId: string) {
    let dashboardSettings = dashboardSettingsData;
    dashboardSettings.forEach((element) => {
      return this.firestore
        .collection('users')
        .doc(userId)
        .collection('dashBoardReports')
        .add({ ...element });
    });
  }
  // addSample email templates
  addEmailTemp1(sid) {
    return this.firestore
      .collection('users/' + sid + '/emailTemplates')
      .doc(`67psFNlwz668MGBe2Tsl`)
      .set({
        ...emailTemp1.DATA,
      });
  }
  addEmailTemp2(sid) {
    return this.firestore
      .collection('users/' + sid + '/emailTemplates')
      .doc(`JpEtOIPPqdZIVGGnf7zP`)
      .set({
        ...emailTemp2.DATA,
      });
  }
  addEmailTemp3(sid) {
    return this.firestore
      .collection('users/' + sid + '/emailTemplates')
      .doc(`izuiTcyGif7nQHtB8Ilg`)
      .set({
        ...emailTemp3.DATA,
      });
  }
  addEmailTemp4(sid) {
    return this.firestore
      .collection('users/' + sid + '/emailTemplates')
      .doc(`ojbMH1vmiQGG0ThhEHnI`)
      .set({
        ...emailTemp4.DATA,
      });
  }
  addEmailTemp5(sid) {
    return this.firestore
      .collection('users/' + sid + '/emailTemplates')
      .doc(`uxHegVqprmSIaDkzXDjp`)
      .set({
        ...emailTemp5.DATA,
      });
  }
  // add sample automation
  addAutom1(sid, profile?) {
    let defaultStageautomation = autom1.DATA;
    let contactModName = 'Customers';
    let saleModName = 'Sale';
    if (profile === 'Overseas Education') {
      contactModName = Overseas_fields.fieldNames.fieldNameContact;
      saleModName = Overseas_fields.fieldNames.fieldNameSale;

      //pipelineId
      defaultStageautomation.form1.pipeline =
        this.defaultCustomerPipelines.customerPipelines[0].pipelineId;

      //valuechangeTo customer won
      defaultStageautomation.form1.valueChangeTo =
        this.defaultCustomerPipelines.customerPipelines[0].pipelineStages[6].stageId;

      // data_tovalue
      defaultStageautomation.data.toValue =
        this.defaultCustomerPipelines.customerPipelines[0].pipelineStages[6].stageId;

      // data_pipeline
      defaultStageautomation.data.pipeline =
        this.defaultCustomerPipelines.customerPipelines[0].pipelineId;
      defaultStageautomation.name = `Update ${contactModName} status to ${this.defaultCustomerPipelines.customerPipelines[0].pipelineStages[6].name} when ${saleModName} is added`;
      defaultStageautomation.form1.name = `Update ${contactModName} status to ${this.defaultCustomerPipelines.customerPipelines[0].pipelineStages[6].name} when ${saleModName} is added`;
    } else if (profile === 'Real Estate') {
      contactModName = realEst_fields.fieldNames.fieldNameContact;
      saleModName = realEst_fields.fieldNames.fieldNameSale;

      //pipelineId
      defaultStageautomation.form1.pipeline =
        this.defaultCustomerPipelines.customerPipelines[0].pipelineId;

      //valuechangeTo customer won
      defaultStageautomation.form1.valueChangeTo =
        this.defaultCustomerPipelines.customerPipelines[0].pipelineStages[4].stageId;

      // data_tovalue
      defaultStageautomation.data.toValue =
        this.defaultCustomerPipelines.customerPipelines[0].pipelineStages[4].stageId;

      // data_pipeline
      defaultStageautomation.data.pipeline =
        this.defaultCustomerPipelines.customerPipelines[0].pipelineId;

      defaultStageautomation.name = `Update ${contactModName} status to ${this.defaultCustomerPipelines.customerPipelines[0].pipelineStages[4].name} when ${saleModName} is added`;
      defaultStageautomation.form1.name = `Update ${contactModName} status to ${this.defaultCustomerPipelines.customerPipelines[0].pipelineStages[4].name} when ${saleModName} is added`;
    } else if (profile === 'Tele-Sales') {
      contactModName = teleMaerketing_fields.fieldNames.fieldNameContact;
      saleModName = teleMaerketing_fields.fieldNames.fieldNameSale;

      //pipelineId
      defaultStageautomation.form1.pipeline =
        this.defaultCustomerPipelines.customerPipelines[0].pipelineId;
      //valuechangeTo customer won
      defaultStageautomation.form1.valueChangeTo =
        this.defaultCustomerPipelines.customerPipelines[0].pipelineStages[3].stageId;
      // data_tovalue
      defaultStageautomation.data.toValue =
        this.defaultCustomerPipelines.customerPipelines[0].pipelineStages[3].stageId;

      // data_pipeline
      defaultStageautomation.data.pipeline =
        this.defaultCustomerPipelines.customerPipelines[0].pipelineId;

      defaultStageautomation.name = `Update ${contactModName} status to ${this.defaultCustomerPipelines.customerPipelines[0].pipelineStages[3].name} when ${saleModName} is added`;
      defaultStageautomation.form1.name = `Update ${contactModName} status to ${this.defaultCustomerPipelines.customerPipelines[0].pipelineStages[3].name} when ${saleModName} is added`;
    } else {
      //pipelineId
      defaultStageautomation.form1.pipeline =
        this.defaultCustomerPipelines.customerPipelines[0].pipelineId;

      //valuechangeTo customer won
      defaultStageautomation.form1.valueChangeTo =
        this.defaultCustomerPipelines.customerPipelines[0].pipelineStages[3].stageId;

      // data_tovalue
      defaultStageautomation.data.toValue =
        this.defaultCustomerPipelines.customerPipelines[0].pipelineStages[3].stageId;

      // data_pipeline
      defaultStageautomation.data.pipeline =
        this.defaultCustomerPipelines.customerPipelines[0].pipelineId;
    }
    return this.firestore
      .collection('users/' + sid + '/automations')
      .doc(`4j1k3eD13tORNcKgz8cu`)
      .set({
        ...defaultStageautomation,
      });
  }
  addAutom2(sid) {
    return this.firestore
      .collection('users/' + sid + '/automations')
      .doc(`9BX1uT31j1d5ump8Zdub`)
      .set({
        ...autom2.DATA,
      });
  }
  addAutom3(sid) {
    return this.firestore
      .collection('users/' + sid + '/automations')
      .doc(`HDBaXbbBZ3eE8sH6URYM`)
      .set({
        ...autom3.DATA,
      });
  }
  addAutom4(sid) {
    return this.firestore
      .collection('users/' + sid + '/automations')
      .doc(`JcUOkhkRB65XneogLKDG`)
      .set({
        ...autom4.DATA,
      });
  }
  addAutom5(sid, profile?) {
    let defaultStageAutom = autom5.DATA;

    let invModName = 'Invoice';
    let saleModName = 'Sale';
    if (profile === 'Overseas Education') {
      saleModName = Overseas_fields.fieldNames.fieldNameSale;
      invModName = Overseas_fields.fieldNames.fieldNameInvoice;

      //pipelineId
      defaultStageAutom.form1.pipeline =
        this.defaultSalePipelines.salePipelines[0].pipelineId;

      //valuechangeTo customer won
      defaultStageAutom.form1.valueChangeTo =
        this.defaultSalePipelines.salePipelines[0].pipelineStages[8].stageId;

      // data_tovalue
      defaultStageAutom.data.toValue =
        this.defaultSalePipelines.salePipelines[0].pipelineStages[8].stageId;

      // data_pipeline
      defaultStageAutom.data.pipeline =
        this.defaultSalePipelines.salePipelines[0].pipelineId;
      defaultStageAutom.name = `Update ${saleModName} stage to ${this.defaultSalePipelines.salePipelines[0].pipelineStages[8].name} when ${invModName} is added`;
      defaultStageAutom.form1.name = `Update ${saleModName} stage to ${this.defaultSalePipelines.salePipelines[0].pipelineStages[8].name} when ${invModName} is added`;
    } else if (profile === 'Real Estate') {
      saleModName = realEst_fields.fieldNames.fieldNameSale;
      invModName = realEst_fields.fieldNames.fieldNameInvoice;

      //pipelineId
      defaultStageAutom.form1.pipeline =
        this.defaultSalePipelines.salePipelines[0].pipelineId;

      //valuechangeTo customer won
      defaultStageAutom.form1.valueChangeTo =
        this.defaultSalePipelines.salePipelines[0].pipelineStages[4].stageId;

      // data_tovalue
      defaultStageAutom.data.toValue =
        this.defaultSalePipelines.salePipelines[0].pipelineStages[4].stageId;

      // data_pipeline
      defaultStageAutom.data.pipeline =
        this.defaultSalePipelines.salePipelines[0].pipelineId;

      defaultStageAutom.name = `Update ${saleModName} stage to ${this.defaultSalePipelines.salePipelines[0].pipelineStages[4].name} when ${invModName} is added`;
      defaultStageAutom.form1.name = `Update ${saleModName} stage to ${this.defaultSalePipelines.salePipelines[0].pipelineStages[4].name} when ${invModName} is added`;
    } else {
      //pipelineId
      defaultStageAutom.form1.pipeline =
        this.defaultSalePipelines.salePipelines[0].pipelineId;

      //valuechangeTo customer won
      defaultStageAutom.form1.valueChangeTo =
        this.defaultSalePipelines.salePipelines[0].pipelineStages[3].stageId;

      // data_tovalue
      defaultStageAutom.data.toValue =
        this.defaultSalePipelines.salePipelines[0].pipelineStages[3].stageId;

      // data_pipeline
      defaultStageAutom.data.pipeline =
        this.defaultSalePipelines.salePipelines[0].pipelineId;
    }

    //data.pipeline
    defaultStageAutom.data.pipeline = this.defaultSalePipelines.salePipelines[0]
      .pipelineId
      ? this.defaultSalePipelines.salePipelines[0].pipelineId
      : DefaultSalePipelines.salePipelines[0].pipelineId;
    //form1.pipeline
    defaultStageAutom.form1.pipeline = this.defaultSalePipelines
      .salePipelines[0].pipelineId
      ? this.defaultSalePipelines.salePipelines[0].pipelineId
      : DefaultSalePipelines.salePipelines[0].pipelineId;

    //valueTo changes
    defaultStageAutom.data.toValue = this.defaultSalePipelines.salePipelines[0]
      .pipelineStages[3].stageId
      ? this.defaultSalePipelines.salePipelines[0].pipelineStages[3].stageId
      : DefaultSalePipelines.salePipelines[0].pipelineStages[3];
    //valueChangeTo changes
    defaultStageAutom.form1.valueChangeTo = this.defaultSalePipelines
      .salePipelines[0].pipelineStages[3].stageId
      ? this.defaultSalePipelines.salePipelines[0].pipelineStages[3].stageId
      : DefaultSalePipelines.salePipelines[0].pipelineStages[3].stageId;
    return this.firestore
      .collection('users/' + sid + '/automations')
      .doc(`iI6k2M8PWBVnmnCtnPAm`)
      .set({
        ...defaultStageAutom,
      });
  }
  addAutom6(sid) {
    return this.firestore
      .collection('users/' + sid + '/automations')
      .doc(`sIutxJLTTtI1Z9dleGXM`)
      .set({
        ...autom6.DATA,
      });
  }
  addAutom7(sid) {
    return this.firestore
      .collection('users/' + sid + '/automations')
      .doc(`uRvSxcv0sjMqSCTyGuhP`)
      .set({
        ...autom7.DATA,
      });
  }

  // sample org for new superuser
  addSampleOrg(assignedToName, sid) {
    let changeLog = <changeLogModel>{};
    changeLog[0] = {
      changedBy: sid,
      changedByName: assignedToName,
      changesFrom: 'sampleData',
      dateModified: new Date().getTime(),
      currentValues: '',
      previousValues: '',
    };
    return this.firestore
      .collection('users/' + sid + '/Organisations')
      .doc(`sampleOrg`)
      .set({
        ...sampleOrg.DATA,
        assignedTo: sid,
        assignedToName: assignedToName,
        createdBy: sid,
        changeLog,
        associatedBranch: 'NA',
      });
  }

  // sample contact for new superuser
  addSampleContact(assignedToName, sid) {
    let changeLog = <changeLogModel>{};
    changeLog[0] = {
      changedBy: sid,
      changedByName: assignedToName,
      changesFrom: 'sampleData',
      dateModified: new Date().getTime(),
      currentValues: '',
      previousValues: '',
    };
    let stageHistory = [
      {
        date: new Date().getTime(),
        stageId: this.defaultCustomerPipelines.customerPipelines[0]
          .pipelineStages[0].stageId
          ? this.defaultCustomerPipelines.customerPipelines[0].pipelineStages[0]
              .stageId
          : DefaultCustomerPipelines.customerPipelines[0].pipelineStages[0]
              .stageId,
        pipelineId: this.defaultCustomerPipelines.customerPipelines[0]
          .pipelineId
          ? this.defaultCustomerPipelines.customerPipelines[0].pipelineId
          : DefaultCustomerPipelines.customerPipelines[0].pipelineId,
      },
    ];
    return this.firestore
      .collection('users/' + sid + '/customers')
      .doc(`sampleContact`)
      .set({
        ...sampleContact.DATA,
        selectedContactPipeline: this.defaultCustomerPipelines
          .customerPipelines[0].pipelineId
          ? this.defaultCustomerPipelines.customerPipelines[0].pipelineId
          : DefaultCustomerPipelines.customerPipelines[0].pipelineId,
        status: this.defaultCustomerPipelines.customerPipelines[0]
          .pipelineStages[0].stageId
          ? this.defaultCustomerPipelines.customerPipelines[0].pipelineStages[0]
              .stageId
          : DefaultCustomerPipelines.customerPipelines[0].pipelineStages[0]
              .stageId,
        stageHistory: stageHistory,
        assignedTo: sid,
        assignedToName: assignedToName,
        createdBy: sid,
        changeLog,
        associatedBranch: 'NA',
      });
  }

  // sale
  addSampleSale(assignedToName, sid) {
    let changeLog = <changeLogModel>{};
    changeLog[0] = {
      changedBy: sid,
      changedByName: assignedToName,
      changesFrom: 'sampleData',
      dateModified: new Date().getTime(),
      currentValues: '',
      previousValues: '',
    };
    let stageHistory = [
      {
        date: new Date().getTime(),
        stageId: this.defaultSalePipelines.salePipelines[0].pipelineStages[0]
          .stageId
          ? this.defaultSalePipelines.salePipelines[0].pipelineStages[0].stageId
          : DefaultSalePipelines.salePipelines[0].pipelineStages[0].stageId,
        pipelineId: this.defaultSalePipelines.salePipelines[0].pipelineId
          ? this.defaultSalePipelines.salePipelines[0].pipelineId
          : DefaultSalePipelines.salePipelines[0].pipelineId,
      },
    ];
    return this.firestore
      .collection('users/' + sid + '/sales')
      .doc(`sampleSale`)
      .set({
        ...sampleSale.DATA,
        selectedSalePipeline: this.defaultSalePipelines.salePipelines[0]
          .pipelineId
          ? this.defaultSalePipelines.salePipelines[0].pipelineId
          : DefaultSalePipelines.salePipelines[0].pipelineId,
        salesStage: this.defaultSalePipelines.salePipelines[0].pipelineStages[0]
          .stageId
          ? this.defaultSalePipelines.salePipelines[0].pipelineStages[0].stageId
          : DefaultSalePipelines.salePipelines[0].pipelineStages[0].stageId,
        stageHistory: stageHistory,
        assignedTo: sid,
        assignedToName: assignedToName,
        createdBy: sid,
        changeLog,
        associatedBranch: 'NA',
      });
  }

  // service
  addSampleService(assignedToName, sid) {
    let changeLog = <changeLogModel>{};
    changeLog[0] = {
      changedBy: sid,
      changedByName: assignedToName,
      changesFrom: 'sampleData',
      dateModified: new Date().getTime(),
      currentValues: '',
      previousValues: '',
    };
    let stageHistory = [
      {
        date: new Date().getTime(),
        stageId: this.defaultServicePipelines.servicePipelines[0]
          .pipelineStages[0].stageId
          ? this.defaultServicePipelines.servicePipelines[0].pipelineStages[0]
              .stageId
          : DefaultServicePipelines.servicePipelines[0].pipelineStages[0]
              .stageId,
        pipelineId: this.defaultServicePipelines.servicePipelines[0].pipelineId
          ? this.defaultServicePipelines.servicePipelines[0].pipelineId
          : DefaultServicePipelines.servicePipelines[0].pipelineId,
      },
    ];
    return this.firestore
      .collection('users/' + sid + '/services')
      .doc(`sampleService`)
      .set({
        ...sampleService.DATA,
        servicesStage: this.defaultServicePipelines.servicePipelines[0]
          .pipelineStages[0].stageId
          ? this.defaultServicePipelines.servicePipelines[0].pipelineStages[0]
              .stageId
          : DefaultServicePipelines.servicePipelines[0].pipelineStages[0]
              .stageId,
        selectedServPipeline: this.defaultServicePipelines.servicePipelines[0]
          .pipelineId
          ? this.defaultServicePipelines.servicePipelines[0].pipelineId
          : DefaultServicePipelines.servicePipelines[0].pipelineId,
        stageHistory: stageHistory,
        assignedTo: sid,
        assignedToName: assignedToName,
        createdBy: sid,
        changeLog,
        associatedBranch: 'NA',
      });
  }

  // task
  addSampleTask(assignedToName, sid) {
    let changeLog = <changeLogModel>{};
    changeLog[0] = {
      changedBy: sid,
      changedByName: assignedToName,
      changesFrom: 'sampleData',
      dateModified: new Date().getTime(),
      currentValues: '',
      previousValues: '',
    };
    return this.firestore
      .collection('users/' + sid + '/tasks')
      .doc(`sampleTask`)
      .set({
        ...sampleTask.DATA,
        assignedTo: sid,
        assignedToName: assignedToName,
        createdBy: sid,
        createdByName: assignedToName,
        changeLog,
        associatedBranch: 'NA',
      });
  }

  // follow up
  addSampleCall(assignedToName, sid) {
    let changeLog = <changeLogModel>{};
    changeLog[0] = {
      changedBy: sid,
      changedByName: assignedToName,
      changesFrom: 'sampleData',
      dateModified: new Date().getTime(),
      currentValues: '',
      previousValues: '',
    };
    return this.firestore
      .collection('users/' + sid + '/Follow Ups')
      .doc(`sampleCall`)
      .set({
        ...sampleCall.DATA,
        assignedTo: sid,
        assignedToName: assignedToName,
        createdBy: sid,
        changeLog,
        associatedBranch: 'NA',
      });
  }

  //Function to read primary query settings saved in db and then use for further querying from DB
  //Added by MK on 19-Aug-2022
  // Used in listviews
  // Contact,
  // Sale,
  // Service,
  // Task,
  // follow Up
  // products and services
  getQueryData(query): QueryOptions {
    //console.log('get query data called', query);
    let queryData: QueryOptions = {
      queryField: '',
      queryType: '',
      operator: '<',
      comparisonValue: [],
      fieldType: '',
      ind: 0,
    };
    queryData.queryField = query.queryField; // query filed
    queryData.queryType = query.queryType; // query type
    queryData.fieldType = query.fieldType;
    queryData.ind = query.ind;

    // if query type is date get the comparison value as number format
    if (query.queryType == 'date') {
      queryData.operator = null;
      let date = new Date();
      if (query.operator == 'During') {
        let firstDay = query.comparisonValue[0];
        let lastDay = query.comparisonValue[1];
        queryData.comparisonValue[0] = new Date(firstDay).getTime();
        let last = new Date(lastDay);
        last.setHours(23, 59, 59, 999);
        queryData.comparisonValue[1] = last.getTime();
      } else if (query.operator == 'Today') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          0,
          0,
          0,
          0
        );
        let lastDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          23,
          59,
          59,
          999
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (query.operator == 'This Week') {
        let firstDay = new Date(startOfWeek(date)); //find first day of the week
        let lastDay = new Date(endOfWeek(date)); // find lastday of the week
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (query.operator == 'This Month') {
        let firstDay = new Date(startOfMonth(date)); //find first day of the week
        let lastDay = new Date(endOfMonth(date)); // find lastday of the week
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (query.operator == 'Tomorrow') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          0,
          0,
          0,
          0
        );
        let lastDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          23,
          59,
          59,
          999
        );
        //console.log("Tomorrow dates", firstDay, lastDay)
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (query.operator == 'Yesterday') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() - 1,
          0,
          0,
          0,
          0
        );
        let lastDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() - 1,
          23,
          59,
          59,
          999
        );
        //console.log("Tomorrow dates", firstDay, lastDay)
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (query.operator == 'Before Date') {
        let firstDay = query.comparisonValue[0];
        queryData.comparisonValue[0] = new Date(firstDay).getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      } else if (query.operator == 'After Date') {
        let firstDay = query.comparisonValue[0];
        let last = new Date(firstDay);
        last.setHours(23, 59, 59, 999);
        queryData.comparisonValue[0] = last.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date greater than the date
      } else if (query.operator == 'Before Date Today') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          0,
          0,
          0,
          0
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      } else if (query.operator == 'After Date Today') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          23,
          59,
          59,
          999
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      } else if (query.operator == 'Before Date Tomorrow') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          0,
          0,
          0,
          0
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      } else if (query.operator == 'After Date Tomorrow') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          23,
          59,
          59,
          999
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      } else if (query.operator == 'Before Date Yesterday') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() - 1,
          0,
          0,
          0,
          0
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      } else if (query.operator == 'After Date Yesterday') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() - 1,
          23,
          59,
          59,
          999
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      } else if (query.operator == 'Before Date This Week') {
        let firstDay = new Date(startOfWeek(date));
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      } else if (query.operator == 'After Date This Week') {
        let firstDay = new Date(endOfWeek(date));
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      } else if (query.operator == 'Before Date This Month') {
        let firstDay = new Date(startOfMonth(date));
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      } else if (query.operator == 'After Date This Month') {
        let firstDay = new Date(endOfMonth(date));
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      } else {
      }
    }
    // if query type is timestamp get the comparison value as number format
    else if (query.queryType == 'timestamp') {
      queryData.operator = null;
      let date = new Date();
      if (query.operator == 'During') {
        let firstDay = query.comparisonValue[0];
        let lastDay = query.comparisonValue[1];
        queryData.comparisonValue[0] = new Date(firstDay);
        queryData.comparisonValue[1] = new Date(lastDay);
        queryData.comparisonValue[1].setHours(23, 59, 59, 999);
      } else if (query.operator == 'Today') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          0,
          0,
          0,
          0
        );
        let lastDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          23,
          59,
          59,
          999
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (query.operator == 'This Week') {
        let firstDay = new Date(startOfWeek(date)); //find first day of the week
        let lastDay = new Date(endOfWeek(date)); // find lastday of the week
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (query.operator == 'This Month') {
        let firstDay = new Date(startOfMonth(date)); //find first day of the week
        let lastDay = new Date(endOfMonth(date)); // find lastday of the week
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (query.operator == 'Tomorrow') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          0,
          0,
          0,
          0
        );
        let lastDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          23,
          59,
          59,
          999
        );
        // console.log("Tomorrow dates", firstDay, lastDay)
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (query.operator == 'Yesterday') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() - 1,
          0,
          0,
          0,
          0
        );
        let lastDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() - 1,
          23,
          59,
          59,
          999
        );
        //console.log("Tomorrow dates", firstDay, lastDay)
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = lastDay.getTime();
      } else if (query.operator == 'Before Date') {
        let firstDay = query.comparisonValue[0];
        queryData.comparisonValue[0] = new Date(firstDay);
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      } else if (query.operator == 'After Date') {
        let firstDay = query.comparisonValue[0];
        queryData.comparisonValue[0] = new Date(firstDay);
        queryData.comparisonValue[0].setHours(23, 59, 59, 999);
        queryData.comparisonValue[1] = 'After Date'; // for query data only date greater than the date
      } else if (query.operator == 'Before Date Today') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          0,
          0,
          0,
          0
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      } else if (query.operator == 'After Date Today') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          23,
          59,
          59,
          999
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      } else if (query.operator == 'Before Date Tomorrow') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          0,
          0,
          0,
          0
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      } else if (query.operator == 'After Date Tomorrow') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() + 1,
          23,
          59,
          59,
          999
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      } else if (query.operator == 'Before Date Yesterday') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() - 1,
          0,
          0,
          0,
          0
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      } else if (query.operator == 'After Date Yesterday') {
        let firstDay = new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate() - 1,
          23,
          59,
          59,
          999
        );
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      } else if (query.operator == 'Before Date This Week') {
        let firstDay = new Date(startOfWeek(date));
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      } else if (query.operator == 'After Date This Week') {
        let firstDay = new Date(endOfWeek(date));
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      } else if (query.operator == 'Before Date This Month') {
        let firstDay = new Date(startOfMonth(date));
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'Before Date'; // for query data only date less than the date
      } else if (query.operator == 'After Date This Month') {
        let firstDay = new Date(endOfMonth(date));
        queryData.comparisonValue[0] = firstDay.getTime();
        queryData.comparisonValue[1] = 'After Date'; // for query data only date less than the date
      } else {
      }
    } // if query type is number or option
    else if (query.queryType == 'boolean') {
      queryData.operator = query.operator;
      queryData.comparisonValue = query.comparisonValue;
    }
    // if query type is number or option
    else {
      queryData.operator = query.operator;
      queryData.comparisonValue = query.comparisonValue;
    }
    return queryData;
  }

  //Function for filtering the data read from db as per the filters created for a particular view
  filterData(record, filterData) {
    let fieldValue = null;
    //If filter is based on additional data field, get the field value
    if (filterData.fieldType == 'Additional') {
      try {
        let addnlFieldArray = record.additionalFieldsArr; // Get the sepcific value
        fieldValue = addnlFieldArray[filterData.ind].fieldValue;
      } catch {
        fieldValue = '';
      }
    }
    // else get the value of the
    else {
      if (filterData.fieldType == 'docData') {
        if (filterData.queryField == 'docData.createdDate') {
          fieldValue = record.docData.createdDate;
        }
        if (
          filterData.queryField == 'docDate' ||
          filterData.queryField == 'docData.docDate'
        ) {
          fieldValue = record.docData.docDate;
        }
        if (
          filterData.queryField == 'dueDate' ||
          filterData.queryField == 'docData.dueDate'
        ) {
          fieldValue = record.docData.dueDate;
        }
      } else {
        fieldValue = record[filterData.queryField];
      }
    }

    if (filterData.queryType == 'number') {
    } else if (filterData.queryType == 'date') {
      if (filterData.comparisonValue[1] == 'Before Date') {
        // for query data only date less than the date
        return fieldValue < filterData.comparisonValue[0];
      } else if (filterData.comparisonValue[1] == 'After Date') {
        // for query data only date greater than the date
        return fieldValue > filterData.comparisonValue[0];
      } else {
        return (
          fieldValue >= filterData.comparisonValue[0] &&
          fieldValue <= filterData.comparisonValue[1]
        );
      }
    } else if (filterData.queryType == 'timestamp') {
      if (filterData.comparisonValue[1] == 'Before Date') {
        //if the field is an additional field, then additional field value if timestamp needs to be converted to date format for query to work properly
        let start = new Date();
        if (filterData.queryType == 'timestamp') {
          start = new Date(filterData.comparisonValue[0]);
        } else {
          start = filterData.comparisonValue[0];
        }
        // for query data only date less than the date
        return fieldValue?.seconds * 1000 < filterData.comparisonValue[0];
      } else if (filterData.comparisonValue[1] == 'After Date') {
        //if the field is an additional field, then additional field value if timestamp needs to be converted to date format for query to work properly
        let start = new Date();
        if (filterData.queryType == 'timestamp') {
          start = new Date(filterData.comparisonValue[0]);
        } else {
          start = filterData.comparisonValue[0];
        }
        // for query data only date greater than the date
        return fieldValue?.seconds * 1000 > filterData.comparisonValue[0];
      } else {
        //if the field is an additional field, then additional field value if timestamp needs to be converted to date format for query to work properly
        let start = new Date();
        let end = new Date();
        if (filterData.queryType == 'timestamp') {
          start = new Date(filterData.comparisonValue[0]);
          end = new Date(filterData.comparisonValue[1]);
        } else {
          start = filterData.comparisonValue[0];
          end = filterData.comparisonValue[1];
        }
        return (
          fieldValue?.seconds * 1000 >= filterData.comparisonValue[0] &&
          fieldValue?.seconds * 1000 <= filterData.comparisonValue[1]
        );
      }
    } else if (filterData.queryType == 'boolean') {
      return fieldValue == filterData.comparisonValue[0];
    } else {
      let comparisonValues = filterData.comparisonValue;
      if (filterData.operator == 'in') {
        return comparisonValues.includes(fieldValue);
      } else {
        return !comparisonValues.includes(fieldValue);
      }
    }
  }

  createUserlist(dataAccessRule, userId) {
    //function to create list of users as per data acces rule
    //console.log("super user details", this.superUserData)
    let userList = []; //Array containing user object with name and branch
    let userIdArray = []; //Array containing ids
    const usersBranch = this.subUserDetails.find(
      (item) => item.userId === userId
    )?.branchId
      ? this.subUserDetails.find((item) => item.userId === userId)?.branchId
      : this.userData.associatedBranch
      ? this.userData.associatedBranch
      : 'none';
    const userStatus = this.subUserDetails.find(
      (item) => item.userId === userId
    )?.status;
    if (dataAccessRule == 'All') {
      if (this.subUserDetails) {
        // create array of subuser ids and names
        this.subUserDetails.forEach((elem) => {
          userIdArray.push(elem.userId);
          userList.push({
            firstname: elem.firstname,
            lastname: elem.lastname ? elem.lastname : '',
            userId: elem.userId,
            branchId: elem.branchId ? elem.branchId : 'none',
            email: elem.email,
            code: elem.code,
            contactNo: elem.contactNo,
            status: elem.status,
          });
        });
        userIdArray.push(this.superUserData.superUserId);
        userList.push({
          firstname: this.superUserData.firstname,
          lastname: this.superUserData.lastname
            ? this.superUserData.lastname
            : '',
          userId: this.superUserData.superUserId,
          branchId: this.superUserData.associatedBranch
            ? this.superUserData.associatedBranch
            : 'none',
          email: this.superUserData.email,
          code: this.superUserData.countryCode,
          contactNo: this.superUserData.phone,
        });
      }
    } else if (dataAccessRule == 'Team') {
      //this.subuserNameList = [];
      if (this.subUserDetails) {
        // check if teamhead is in subuser collection to fetch branchId
        // assign subusers
        for (let i = 0; i < this.subUserDetails.length; i++) {
          if (this.subUserDetails[i].reportsToId === userId) {
            userIdArray.push(this.subUserDetails[i].userId);
            userList.push({
              firstname: this.subUserDetails[i].firstname,
              lastname: this.subUserDetails[i].lastname
                ? this.subUserDetails[i].lastname
                : '',
              userId: this.subUserDetails[i].userId,
              branchId: this.subUserDetails[i].branchId
                ? this.subUserDetails[i].branchId
                : 'none',
              email: this.subUserDetails[i].email,
              code: this.subUserDetails[i].code,
              contactNo: this.subUserDetails[i].contactNo,
              status: this.subUserDetails[i].status,
            });
          }
        }
        userIdArray.push(userId);
        userList.push({
          firstname: this.userData.firstname,
          lastname: this.userData.lastname ? this.userData.lastname : '',
          userId: userId,
          branchId: usersBranch,
          email: this.userData.email,
          code: this.userData.countryCode,
          contactNo: this.userData.phone,
          status: userStatus,
        });
      }
    } /*else if (dataAccessRule == 'Branch') {
      //this.subuserNameList = [];
      if (this.subUserDetails) {
        // check branch of user in subuser collection to fetch branchId
        const usersBranch = this.subUserDetails.find(
          (item) => item.userId === userId
        )?.branchId
          ? this.subUserDetails.find((item) => item.userId === userId)?.branchId
          : this.userData.associatedBranch
          ? this.userData.associatedBranch
          : 'none';
        console.log('branch Id', usersBranch);
        // assign subusers
        for (let i = 0; i < this.subUserDetails.length; i++) {
          if (this.subUserDetails[i].branchId === usersBranch) {
            userIdArray.push(this.subUserDetails[i].userId);
            userList.push({
              firstname: this.subUserDetails[i].firstname,
              lastname: this.subUserDetails[i].lastname
                ? this.subUserDetails[i].lastname
                : '',
              userId: this.subUserDetails[i].userId,
              branchId: this.subUserDetails[i].branchId
                ? this.subUserDetails[i].branchId
                : 'none',
            });
          }
        }
        userIdArray.push(userId);
        userList.push({
          firstname: this.userData.firstname,
          lastname: this.userData.lastname ? this.userData.lastname : '',
          userId: userId,
          branchId: usersBranch,
        });
      }
    } */ else {
      //If data access rule is own, then only get the current user details
      // check if teamhead is in subuser collection to fetch branchId

      userIdArray.push(userId);
      userList.push({
        firstname: this.userData.firstname,
        lastname: this.userData.lastname ? this.userData.lastname : '',
        userId: userId,
        branchId: usersBranch,
        email: this.userData.email,
        code: this.userData.countryCode,
        contactNo: this.userData.phone,
        status: userStatus,
      });
    }
    userList.sort((a, b) => {
      let nameA = a.firstname;
      let nameB = b.firstname;
      if (nameA > nameB) {
        return 1;
      } else if (nameA < nameB) {
        return -1;
      } else {
        return 0;
      }
    });

    userList = userList.filter((el, i, a) => i === a.indexOf(el)); // remove duplicate entries if any
    userIdArray = userIdArray.filter((el, i, a) => i === a.indexOf(el)); // remove duplicate entries if any

    return [userIdArray, userList];
  }

  getBranch(userId) {
    if (this.subUserDetails) {
      // check branch of user in subuser collection to fetch branchId
      const usersBranch = this.subUserDetails.find(
        (item) => item.userId === userId
      )?.branchId
        ? this.subUserDetails.find((item) => item.userId === userId)?.branchId
        : this.userData.associatedBranch
        ? this.userData.associatedBranch
        : 'none';
      return usersBranch;
      // assign subusers
    }
  }

  //function sort an object array
  sortData(data, sortField, order) {
    // console.log("sort details",sortField,order)
    let sortedData = [];
    if (order == 'Asc') {
      sortedData = data.sort((a, b) => {
        let valueA = this.getFieldValueSort(sortField, a);
        let valueB = this.getFieldValueSort(sortField, b);
        if (valueA < valueB) {
          return -1;
        }
        if (valueA > valueB) {
          return 1;
        }
        return 0;
      });
    } else {
      sortedData = data.sort((a, b) => {
        let valueA = this.getFieldValueSort(sortField, a);
        let valueB = this.getFieldValueSort(sortField, b);
        if (valueA > valueB) {
          return -1;
        }
        if (valueA < valueB) {
          return 1;
        }
        return 0;
      });
    }
    return sortedData;
  }

  readPrimaryData(superUserId, module, queryData: QueryOptions, userIdArray) {
    //console.log("red primary data called",queryData )
    //console.log(superUserId, module, queryData, userIdArray)
    //console.log("queryData =="+JSON.stringify(queryData))
    // if primary query is not array comparison (operator = 'in') since this leads to failure if two array comparisons occur

    if (queryData.queryType == 'boolean') {
      return this.firestore
        .collection('users/' + superUserId + '/' + module, (ref) =>
          ref.where(queryData.queryField, '==', queryData.comparisonValue[0])
        )
        .snapshotChanges();
    } else if (queryData.queryType == 'number') {
      return this.firestore
        .collection('users/' + superUserId + '/' + module, (ref) =>
          ref.where(
            queryData.queryField,
            queryData.operator,
            Number(queryData.comparisonValue[0])
          )
        )
        .snapshotChanges();
    } else if (
      (queryData.queryType == 'date' || queryData.queryType == 'timestamp') &&
      queryData.fieldType != 'Additional'
    ) {
      if (queryData.comparisonValue[1] == 'Before Date') {
        let start = new Date();
        if (queryData.queryType == 'timestamp') {
          start = new Date(queryData.comparisonValue[0]);
        } else {
          start = queryData.comparisonValue[0];
        }
        return this.firestore
          .collection('users/' + superUserId + '/' + module, (ref) =>
            ref.where(queryData.queryField, '<', start)
          )
          .snapshotChanges();
      } else if (queryData.comparisonValue[1] == 'After Date') {
        let start = new Date();
        if (queryData.queryType == 'timestamp') {
          start = new Date(queryData.comparisonValue[0]);
        } else {
          start = queryData.comparisonValue[0];
        }
        return this.firestore
          .collection('users/' + superUserId + '/' + module, (ref) =>
            ref.where(queryData.queryField, '>', start)
          )
          .snapshotChanges();
      } else {
        //console.log('date if. not addi')
        let start = new Date();
        let end = new Date();
        if (queryData.queryType == 'timestamp') {
          start = new Date(queryData.comparisonValue[0]);
          end = new Date(queryData.comparisonValue[1]);
        } else {
          start = queryData.comparisonValue[0];
          end = queryData.comparisonValue[1];
        }
        // console.log(superUserId, module, start, end, queryData.queryField)
        return this.firestore
          .collection('users/' + superUserId + '/' + module, (ref) =>
            ref
              .where(queryData.queryField, '>=', start)
              .where(queryData.queryField, '<=', end)
          )
          .snapshotChanges();
      }
    } else if (
      (queryData.queryType == 'date' || queryData.queryType == 'timestamp') &&
      queryData.fieldType == 'Additional'
    ) {
      if (queryData.comparisonValue[1] == 'Before Date') {
        let queryfield: string =
          'additionalFieldsArr.' + queryData.ind.toString() + '.fieldValue';
        let start = new Date(queryData.comparisonValue[0]);
        return this.firestore
          .collection('users/' + superUserId + '/' + module, (ref) =>
            ref.where(queryfield, '<', start)
          )
          .snapshotChanges();
      } else if (queryData.comparisonValue[1] == 'After Date') {
        let queryfield: string =
          'additionalFieldsArr.' + queryData.ind.toString() + '.fieldValue';
        let start = new Date(queryData.comparisonValue[0]);
        return this.firestore
          .collection('users/' + superUserId + '/' + module, (ref) =>
            ref.where(queryfield, '>', start)
          )
          .snapshotChanges();
      } else {
        let queryfield: string =
          'additionalFieldsArr.' + queryData.ind.toString() + '.fieldValue';
        let start = new Date(queryData.comparisonValue[0]);
        let end = new Date(queryData.comparisonValue[1]);
        return this.firestore
          .collection('users/' + superUserId + '/' + module, (ref) =>
            ref.where(queryfield, '>=', start).where(queryfield, '<=', end)
          )
          .snapshotChanges();
      }
    } else {
      if (queryData.fieldType != 'Additional') {
        return this.firestore
          .collection('users/' + superUserId + '/' + module, (ref) =>
            ref.where(
              queryData.queryField,
              queryData.operator,
              queryData.comparisonValue
            )
          )
          .snapshotChanges();
      } else {
        //If additional field
        let queryfield: string =
          'additionalFieldsArr.' + queryData.ind.toString() + '.fieldValue';
        return this.firestore
          .collection('users/' + superUserId + '/' + module, (ref) =>
            ref.where(queryfield, queryData.operator, queryData.comparisonValue)
          )
          .snapshotChanges();
      }
    }
  }

  checkCustomField(defaultSettings, customSettingdb) {
    Object.keys(defaultSettings).forEach((field) => {
      let present: boolean = false;
      Object.keys(customSettingdb).forEach((col) => {
        if (field == col) {
          present = true;
        }
      });
      //if not available, push them
      if (present == false) {
        customSettingdb[field] = {
          display: defaultSettings[field].display,
          displayName: defaultSettings[field].displayName,
          mandatory: defaultSettings[field].mandatory,
        };
      }
    });
  }
  // checkCustomField(defaultSettings,customSettingdb){
  //   const defaultKeys = Object.keys(defaultSettings);
  //   const keysDb = Object.keys(customSettingdb)
  //   var defaultKeysArrray = [];
  //   var keysDbArrray = [];
  //   defaultKeysArrray.push(defaultKeys);
  //   keysDbArrray.push(keysDb);
  //   var result = defaultKeysArrray.filter((item) => { return keysDbArrray.indexOf(item) == -1});
  //   console.log(result);
  //   console.log(
  //     defaultKeysArrray.filter(function(v) {
  //       return !keysDbArrray.includes(v);
  //     })
  //   )
  //   //  console.log(defaultKeysArrray)
  //   //  console.log(keysDbArrray)
  // }
  createGroupigArrayAssignedTo() {
    let groupingArrayValues = [];
    let groupingArrayNames = [];
    //function to create grouping array for assigned to based on the data access rule

    if (this.subUserDetails) {
      // create array of subuser ids and names
      this.subUserDetails.forEach((elem) => {
        groupingArrayValues.push(elem.userId);
        groupingArrayNames.push(
          elem.firstname + ' ' + (elem.lastname ? elem.lastname : '')
        );
      });
      //add the super user data to the arrays
      groupingArrayValues.push(this.superUserData.superUserId);
      groupingArrayNames.push(
        this.superUserData.firstname +
          ' ' +
          (this.superUserData.lastname ? this.superUserData.lastname : '')
      );
    }
    return [groupingArrayValues, groupingArrayNames];
  }
  transformTo12Hour(time: any): any {
    let hour = time.split(':')[0];
    let min = time.split(':')[1];
    let part;

    if (hour <= 11) {
      part = 'AM';
      if (hour == 0) {
        hour = 12;
      }
    } else if (hour == 12) {
      part = 'PM';
    } else if (hour >= 13) {
      part = 'PM';
      hour = hour - 12;
    }

    min = (min + '').length == 1 ? `0${min}` : min;
    hour = (hour + '').length == 1 ? `0${hour}` : hour;
    return `${hour}:${min} ${part}`;
  }
  // for displaying assigned to name from subuser details
  getAssignedToName(assignedToId) {
    if (assignedToId == this.userData.superUserId) {
      // if it is a super user
      let firstname = this.superUserData?.firstname
        ? this.superUserData?.firstname
        : '';
      let lastname = this.superUserData?.lastname
        ? this.superUserData?.lastname
        : '';
      let name = firstname + ' ' + lastname;
      try {
        return name;
      } catch {
        return 'NA';
      }
    } else {
      // if it is a sub user get name from subuser array
      const pos = this.subUserDetails
        .map((e) => e.userId)
        .indexOf(assignedToId);
      let firstname = this.subUserDetails[pos]?.firstname
        ? this.subUserDetails[pos]?.firstname
        : '';
      let lastname = this.subUserDetails[pos]?.lastname
        ? this.subUserDetails[pos]?.lastname
        : '';
      let name = firstname + ' ' + lastname;
      try {
        return name;
      } catch {
        return 'NA';
      }
    }
  }
  // post data to autocall api
  onAutoCall(
    sourceNumber,
    destinationNumber,
    superUserId,
    userId,
    userName,
    companyName,
    customerId,
    customerName,
    startTime,
    callId,
    autoCallToken,
    DIDNumber,
    orgId,
    associatedBranch,
    ext,
    callType,
    saleTitle,
    saleId,
    serviceTitle,
    serviceId
  ) {
    let callBridgingServiceProvider = this.superUserData
      .callBridgingServiceProvider
      ? this.superUserData.callBridgingServiceProvider
      : '';
    if (callBridgingServiceProvider == 'Bonvoice') {
      let autoCallURL = this.superUserData.autoCallURL
        ? this.superUserData.autoCallURL
        : '';
      let channelID = this.superUserData.channelID
        ? this.superUserData.channelID
        : '1';
      return this.http.post(environment.cloudFunctions.ivrAutoCall, {
        destination: sourceNumber,
        legBDestination: destinationNumber,
        superUserId: superUserId,
        userId: userId,
        userName: userName,
        companyName: companyName,
        customerId: customerId,
        customerName: customerName,
        startTime: startTime,
        callId: callId,
        autoCallToken: autoCallToken,
        DIDNumber: DIDNumber,
        orgId: orgId,
        associatedBranch: associatedBranch,
        autoCallURL: autoCallURL,
        channelID: channelID,
        saleTitle: saleTitle,
        saleId: saleId,
        serviceTitle: serviceTitle,
        serviceId: serviceId,
      });
    } else if (callBridgingServiceProvider == 'Voxbay') {
      let PINNumber = this.superUserData.voxbayPin
        ? this.superUserData.voxbayPin
        : ''; //Pin number of superuser
      let UIDNumber = this.superUserData.voxbayUid
        ? this.superUserData.voxbayUid
        : ''; //UID no of superuser
      let DIDNumber;
      if (this.superUserData.superUserId === userId) {
        DIDNumber = this.superUserData.voxbayCallerid
          ? this.superUserData.voxbayCallerid
          : '';
      } else {
        let result;
        this.subUserDetails.forEach((ele) => {
          if (ele.userId === userId) {
            result = ele.callerId;
          }
        });
        DIDNumber = result;
      }
      return this.http.post(environment.cloudFunctions.voxBayAutoCall, {
        source: '91' + sourceNumber,
        destination: '91' + destinationNumber,
        superUserId: superUserId,
        userId: userId,
        userName: userName,
        companyName: companyName,
        customerId: customerId,
        customerName: customerName,
        startTime: startTime,
        callId: callId,
        callerid: DIDNumber,
        orgId: orgId,
        associatedBranch: associatedBranch,
        ext: ext ? ext : '',
        outBoundCallType: callType,
        pinNumber: PINNumber,
        uidNumber: UIDNumber,
        saleTitle: saleTitle,
        saleId: saleId,
        serviceTitle: serviceTitle,
        serviceId: serviceId,
      });
    }
  }
  getContact(userId, id) {
    return this.firestore
      .doc('users/' + userId + '/customers/' + id)
      .valueChanges();
  }
  addDefaultPipeline(userId: string, category?) {
    this.defaultCustomerPipelines = [];
    this.defaultSalePipelines = [];
    this.defaultServicePipelines = [];

    if (category === 'Overseas Education') {
      this.defaultCustomerPipelines = overSeasPipelineCust;
      this.defaultSalePipelines = overSeasPipelineSale;
      this.defaultServicePipelines = DefaultServicePipelines;
    } else if (category === 'Real Estate') {
      this.defaultCustomerPipelines = realEstPipelineCust;
      this.defaultSalePipelines = realEstPipelineSale;
      this.defaultServicePipelines = DefaultServicePipelines;
    } else if (category === 'Tele-Sales') {
      this.defaultCustomerPipelines = teleMarkPipelineCust;
      this.defaultSalePipelines = DefaultSalePipelines;
      this.defaultServicePipelines = DefaultServicePipelines;
    } else {
      this.defaultCustomerPipelines = DefaultCustomerPipelines;
      this.defaultSalePipelines = DefaultSalePipelines;
      this.defaultServicePipelines = DefaultServicePipelines;
    }

    this.firestore
      .collection('users/' + userId + '/pipelines')
      .doc('customerPipelines')
      .set({ ...this.defaultCustomerPipelines });
    this.firestore
      .collection('users/' + userId + '/pipelines')
      .doc('salePipelines')
      .set({ ...this.defaultSalePipelines });
    this.firestore
      .collection('users/' + userId + '/pipelines')
      .doc('servicePipelines')
      .set({ ...this.defaultServicePipelines });
  }
  getCustomerPipeline(userId: string) {
    // for getting customer Pipeline
    return this.firestore
      .doc<customerPipelines>(
        'users/' + userId + '/pipelines/customerPipelines'
      )
      .valueChanges();
  }
  getSalePipeline(userId: string) {
    // for getting sale Pipeline
    return this.firestore
      .doc<salePipelines>('users/' + userId + '/pipelines/salePipelines')
      .valueChanges();
  }
  getServicePipeline(userId: string) {
    // for getting service Pipeline
    return this.firestore
      .doc<servicePipelines>('users/' + userId + '/pipelines/servicePipelines')
      .valueChanges();
  }
  // get staatus based on pipeline
  getStatusArray(module, pipelineId) {
    let pipelineArray = [];
    if (module === modules.customers) {
      pipelineArray = this.customerPipelines;
    } else if (module === modules.sales) {
      pipelineArray = this.salePipelines;
    } else if (module === modules.services) {
      pipelineArray = this.servicePipelines;
    }
    var result = pipelineArray?.filter((obj) => {
      return obj.pipelineId === pipelineId;
    });
    if (result?.length > 0) {
      const statusArray = result[0]?.pipelineStages.map(
        ({ name, stageId }) => ({
          name,
          stageId,
        })
      );
      return statusArray;
    } else {
      return [];
    }
  }
  // get a status object ith status id
  getStatusObject(module, pipelineId, statusId) {
    const statusArr = this.getStatusArray(module, pipelineId);
    var result = statusArr.filter((obj) => {
      return obj.stageId === statusId;
    });
    const statusObj = result[0];
    return statusObj;
  }
  // getpipeline name by pipeline id
  getPipelineNames(module, pipelineId) {
    let pipelineArray = [];
    if (module === modules.customers) {
      pipelineArray = this.customerPipelines;
    } else if (module === modules.sales || module === modules.products) {
      pipelineArray = this.salePipelines;
    } else if (module === modules.services) {
      pipelineArray = this.servicePipelines;
    }
    let pipelinDetails = pipelineArray?.filter((obj) => {
      return obj.pipelineId === pipelineId;
    });
    if (pipelinDetails?.length > 0) {
      return pipelinDetails[0]?.pipelineName;
    } else {
      return 'N/A';
    }
  }
  // getpipeline names by module
  getAllPipelineNames(module) {
    let pipelineArray = [];
    let pipelineNameArray = [];

    if (module === modules.customers) {
      pipelineArray = this.customerPipelines;
    } else if (module === modules.sales) {
      pipelineArray = this.salePipelines;
    } else if (module === modules.services) {
      pipelineArray = this.servicePipelines;
    }
    pipelineArray.forEach((result) => {
      pipelineNameArray.push({
        pipelineName: result.pipelineName,
        pipelineId: result.pipelineId,
      });
    });
    return pipelineNameArray;
  }
  // getAll pipeline name and id
  getPipelineNamesAndId(module) {
    let pipelineArray = [];
    if (module === modules.customers) {
      pipelineArray = this.customerPipelines;
    } else if (module === modules.sales) {
      pipelineArray = this.salePipelines;
    } else if (module === modules.services) {
      pipelineArray = this.servicePipelines;
    }
    let pipelineObject = [];
    pipelineArray.forEach((result) => {
      pipelineObject.push({
        pipelineName: result.pipelineName,
        pipelineId: result.pipelineId,
      });
    });
    return pipelineObject;
  }
  getPipelineIdArray(module) {
    if (module === modules.customers) {
      var pipelineArray = this.customerPipelines.map(function (item) {
        return item['pipelineId'];
      });
      return pipelineArray;
    } else if (module === modules.services) {
      var pipelineArray = this.servicePipelines.map(function (item) {
        return item['pipelineId'];
      });
      return pipelineArray;
    } else if (module === modules.sales) {
      var pipelineArray = this.salePipelines.map(function (item) {
        return item['pipelineId'];
      });
      return pipelineArray;
    }
  }
  // get status name with pipeline id
  getStatusName(module, pipelineId, statusId) {
    const statusArr = this.getStatusArray(module, pipelineId);
    if (statusArr.length > 0) {
      var result = statusArr?.filter((obj) => {
        return obj.stageId === statusId;
      });
      const statusName = result[0]?.name ? result[0]?.name : 'N/A';
      return statusName;
    } else {
      return 'N/A';
    }
  }
  // get status name with statusId
  getStatusNameWithStatusId(module, statusId) {
    let pipelineArray = [];
    if (module === modules.customers) {
      pipelineArray = this.customerPipelines;
    } else if (module === modules.sales) {
      pipelineArray = this.salePipelines;
    } else if (module === modules.services) {
      pipelineArray = this.servicePipelines;
    }
    let result = '';
    pipelineArray.forEach((ele) => {
      ele.pipelineStages.forEach((innerEle) => {
        if (innerEle.stageId === statusId) {
          result = innerEle.name ? innerEle.name : '';
        }
      });
    });
    return result;
  }

  getStageNameAndPipeLineName(pipelineArray: Pipelines[], stageId) {
    let stageDetails = [];
    let pipelineName = '';
    pipelineArray.forEach((element) => {
      element.pipelineStages.forEach((data) => {
        if (data.stageId === stageId) {
          stageDetails.push(data);
          pipelineName = element.pipelineName;
        }
      });
    });
    if (stageDetails.length > 0) {
      return stageDetails[0].name + ' - ' + pipelineName;
    } else {
      return 'N/A';
    }
  }
}
