import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Currencies, Currency } from '../../currencies';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { CreateProfileService } from 'src/app/create-profile/create-profile.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AdminProfile, customFieldNamesData, SubUserProfile, SuperUserProfile } from 'src/app/data-models';
import { CommonService } from 'src/app/common.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CountryCodeModel, getCountryCodes } from 'src/app/countryCode';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})
export class AdminViewComponent implements OnInit {
  addUserForm: FormGroup;
  hidePassword = true;
  isFormReady = false;
  paymentMode: string = '';
  isFormValid = false;
  planOptions = [
    { value: 'free', label: 'Free' },
    { value: 'silver', label: 'Silver' },
    { value: 'gold', label: 'Gold' },
    { value: 'diamond', label: 'Diamond' }
  ];

  paymentModeOptions = [
    { value: 'manual', label: 'Manual' },
    { value: 'subscription', label: 'Subscription' }
  ];

  packageDurationOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  currencyOptions: Currency[] = Currencies.getCurencies();

  // Country code properties
  countryCodeOptions: CountryCodeModel[] = getCountryCodes.CountryCodes;
  selectedCountryCode: CountryCodeModel = {
    name: 'India',
    dial_code: '+91',
    code: 'IN'
  };

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private analytics: AngularFireAnalytics,
    private serviceInstance: CreateProfileService, //create profile service instance
    private afAuth: AngularFireAuth,
    private commonService: CommonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    // Trigger change detection after form is initialized
    this.cdr.detectChanges();
  }


  initializeForm(): void {
    console.log('Initializing form...');
    this.addUserForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      contactNumber: ['', [
        Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)
      ]],
      countryCode: ['+91', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      plan: ['diamond', Validators.required],
      noOfUsers: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(1000)
      ]],
      paymentHistory: this.fb.group({
        paymentMode: ['', Validators.required],
        amount: ['', [
          Validators.required,
          Validators.min(0)
        ]],
        currency: ['INR', Validators.required],
        subscriptionEnd: [''],
        subscriptionId: [''],
        packageDuration: ['', Validators.required],
        chargeAt: [''],
        subscriptionStart: [''],
        paymentId: ['']
      })
    });

    // Set initial payment mode value
    this.paymentMode = this.addUserForm.get('paymentHistory.paymentMode')?.value || '';

    // Add conditional validation based on payment mode
    this.addUserForm.get('paymentHistory.paymentMode')?.valueChanges.subscribe(paymentMode => {
      this.updatePaymentHistoryValidation(paymentMode);
    });

    // Add conditional validation based on plan selection
    this.addUserForm.get('plan')?.valueChanges.subscribe(plan => {
      this.updatePlanBasedValidation(plan);
    });

    // Trigger initial validation for subscription mode
    this.updatePaymentHistoryValidation(this.paymentMode);

    // Trigger initial validation for plan
    this.updatePlanBasedValidation(this.addUserForm.get('plan')?.value);

    // Track form validity changes
    this.addUserForm.statusChanges.subscribe(status => {
      this.isFormValid = status === 'VALID';
    });

    // Initial validity check
    this.isFormValid = this.addUserForm.valid;

    // Set form as ready after initialization
    this.isFormReady = true;
    console.log('Form initialized successfully:', this.addUserForm);
  }

  modeSelected(event: any): void {
    const paymentMode = event.value;
    console.log(paymentMode)
    this.updatePaymentHistoryValidation(paymentMode);
  }

  onCountryCodeSelected(countryCode: CountryCodeModel): void {
    this.selectedCountryCode = countryCode;
    this.addUserForm.patchValue({
      countryCode: countryCode.dial_code
    });
  }

  updatePaymentHistoryValidation(paymentMode: string): void {
    this.paymentMode = paymentMode;

    const paymentHistory = this.addUserForm.get('paymentHistory');
    const subscriptionEnd = paymentHistory?.get('subscriptionEnd');
    const subscriptionId = paymentHistory?.get('subscriptionId');
    const chargeAt = paymentHistory?.get('chargeAt');
    const subscriptionStart = paymentHistory?.get('subscriptionStart');
    const paymentId = paymentHistory?.get('paymentId');

    if (paymentMode === 'manual') {
      // For manual payment, clear and disable subscription fields
      subscriptionEnd?.clearValidators();
      subscriptionId?.clearValidators();
      chargeAt?.clearValidators();
      subscriptionStart?.clearValidators();

      // Enable payment ID validation
      paymentId?.setValidators([Validators.required]);
    } else if (paymentMode === 'subscription') {
      // For subscription payment, enable subscription fields
      subscriptionEnd?.setValidators([Validators.required]);
      subscriptionId?.setValidators([Validators.required]);
      chargeAt?.setValidators([Validators.required]);
      subscriptionStart?.setValidators([Validators.required]);

      // Clear payment ID validation
      paymentId?.clearValidators();
    }

    // Update validation
    subscriptionEnd?.updateValueAndValidity();
    subscriptionId?.updateValueAndValidity();
    chargeAt?.updateValueAndValidity();
    subscriptionStart?.updateValueAndValidity();
    paymentId?.updateValueAndValidity();
  }

  updatePlanBasedValidation(plan: string): void {
    const paymentHistory = this.addUserForm.get('paymentHistory');
    const noOfUsers = this.addUserForm.get('noOfUsers');

    if (plan === 'free') {
      // Disable all payment history fields for free plan
      paymentHistory?.get('paymentMode')?.disable();
      paymentHistory?.get('amount')?.disable();
      paymentHistory?.get('currency')?.disable();
      paymentHistory?.get('subscriptionEnd')?.disable();
      paymentHistory?.get('subscriptionId')?.disable();
      paymentHistory?.get('packageDuration')?.disable();
      paymentHistory?.get('chargeAt')?.disable();
      paymentHistory?.get('subscriptionStart')?.disable();
      paymentHistory?.get('paymentId')?.disable();

      // Remove required validators from payment history fields
      paymentHistory?.get('paymentMode')?.clearValidators();
      paymentHistory?.get('amount')?.clearValidators();
      paymentHistory?.get('currency')?.clearValidators();
      paymentHistory?.get('subscriptionEnd')?.clearValidators();
      paymentHistory?.get('subscriptionId')?.clearValidators();
      paymentHistory?.get('packageDuration')?.clearValidators();
      paymentHistory?.get('chargeAt')?.clearValidators();
      paymentHistory?.get('subscriptionStart')?.clearValidators();
      paymentHistory?.get('paymentId')?.clearValidators();

      // Set noOfUsers to 1 and disable it
      noOfUsers?.setValue(1);
      noOfUsers?.disable();
      noOfUsers?.clearValidators();

      // Clear payment history values
      paymentHistory?.patchValue({
        paymentMode: '',
        amount: '',
        currency: 'INR',
        subscriptionEnd: '',
        subscriptionId: '',
        packageDuration: '',
        chargeAt: '',
        subscriptionStart: '',
        paymentId: ''
      });
    } else {
      // Enable all payment history fields for paid plans
      paymentHistory?.get('paymentMode')?.enable();
      paymentHistory?.get('amount')?.enable();
      paymentHistory?.get('currency')?.enable();
      paymentHistory?.get('subscriptionEnd')?.enable();
      paymentHistory?.get('subscriptionId')?.enable();
      paymentHistory?.get('packageDuration')?.enable();
      paymentHistory?.get('chargeAt')?.enable();
      paymentHistory?.get('subscriptionStart')?.enable();
      paymentHistory?.get('paymentId')?.enable();

      // Re-add required validators for payment history
      paymentHistory?.get('paymentMode')?.setValidators([Validators.required]);
      paymentHistory?.get('amount')?.setValidators([Validators.required, Validators.min(0)]);
      paymentHistory?.get('currency')?.setValidators([Validators.required]);
      paymentHistory?.get('packageDuration')?.setValidators([Validators.required]);

      // Enable noOfUsers and re-add validators
      noOfUsers?.enable();
      noOfUsers?.setValidators([Validators.required, Validators.min(1), Validators.max(1000)]);

      // Update payment history validation based on current payment mode
      const currentPaymentMode = paymentHistory?.get('paymentMode')?.value;
      if (currentPaymentMode) {
        this.updatePaymentHistoryValidation(currentPaymentMode);
      }
    }

    // Update validation for all affected fields
    paymentHistory?.get('paymentMode')?.updateValueAndValidity();
    paymentHistory?.get('amount')?.updateValueAndValidity();
    paymentHistory?.get('currency')?.updateValueAndValidity();
    paymentHistory?.get('subscriptionEnd')?.updateValueAndValidity();
    paymentHistory?.get('subscriptionId')?.updateValueAndValidity();
    paymentHistory?.get('packageDuration')?.updateValueAndValidity();
    paymentHistory?.get('chargeAt')?.updateValueAndValidity();
    paymentHistory?.get('subscriptionStart')?.updateValueAndValidity();
    paymentHistory?.get('paymentId')?.updateValueAndValidity();
    noOfUsers?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.addUserForm.valid) {
      // Get form values including disabled fields
      const userData = this.addUserForm.getRawValue();

      // Convert contact number to string to ensure consistency
      if (userData.contactNumber) {
        userData.contactNumber = userData.contactNumber.toString();
      }

      // Convert date fields to Unix timestamps before saving
      const processedUserData = this.convertDatesToTimestamps(userData);

      // Log analytics event for user addition
      this.analytics.logEvent('admin_user_add', {
        plan: userData.plan,
        paymentMode: userData.paymentHistory?.paymentMode,
        packageDuration: userData.paymentHistory?.packageDuration,
        currency: userData.paymentHistory?.currency,
        noOfUsers: userData.noOfUsers
      });

      console.log('User data to be submitted:', processedUserData);

      // Create user with Firebase Auth
      this.createUserWithFirebase(processedUserData);
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched();
    }
  }

  // Method to convert date fields to Unix timestamps
  private convertDatesToTimestamps(userData: any): any {
    const processedData = { ...userData };

    console.log('Original form data:', userData);

    // Convert payment history dates to timestamps
    if (processedData.paymentHistory) {
      const paymentHistory = { ...processedData.paymentHistory };

      // Convert subscription start date
      if (paymentHistory.subscriptionStart) {
        const originalDate = paymentHistory.subscriptionStart;
        paymentHistory.subscriptionStart = this.convertDateToTimestamp(paymentHistory.subscriptionStart);
        console.log(`Subscription Start: ${originalDate} -> ${paymentHistory.subscriptionStart}`);
      }

      // Convert subscription end date
      if (paymentHistory.subscriptionEnd) {
        const originalDate = paymentHistory.subscriptionEnd;
        paymentHistory.subscriptionEnd = this.convertDateToTimestamp(paymentHistory.subscriptionEnd);
        console.log(`Subscription End: ${originalDate} -> ${paymentHistory.subscriptionEnd}`);
      }

      // Convert charge at date
      if (paymentHistory.chargeAt) {
        const originalDate = paymentHistory.chargeAt;
        paymentHistory.chargeAt = this.convertDateToTimestamp(paymentHistory.chargeAt);
        console.log(`Charge At: ${originalDate} -> ${paymentHistory.chargeAt}`);
      }

      processedData.paymentHistory = paymentHistory;
    }

    console.log('Processed data with timestamps:', processedData);
    return processedData;
  }

  // Helper method to convert Date object to Unix timestamp
  private convertDateToTimestamp(date: Date | string): number {
    if (!date) return 0;

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date provided:', date);
      return 0;
    }

    // Return Unix timestamp in seconds
    return Math.floor(dateObj.getTime() / 1000);
  }

  markFormGroupTouched(): void {
    Object.keys(this.addUserForm.controls).forEach(key => {
      const control = this.addUserForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string, nestedField?: string): string {
    const field = nestedField ?
      this.addUserForm.get(`paymentHistory.${nestedField}`) :
      this.addUserForm.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        const displayName = nestedField ? nestedField : fieldName;
        return `${displayName.charAt(0).toUpperCase() + displayName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        const displayName = nestedField ? nestedField : fieldName;
        return `${displayName.charAt(0).toUpperCase() + displayName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        const displayName = nestedField ? nestedField : fieldName;
        return `${displayName.charAt(0).toUpperCase() + displayName.slice(1)} must not exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
      if (field.errors['pattern']) {
        if (fieldName === 'username') {
          return 'Username can only contain letters, numbers, and underscores';
        }
        if (fieldName === 'password') {
          return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        }
        if (fieldName === 'contactNumber') {
          return 'Please enter a valid contact number (e.g., +1234567890 or 1234567890)';
        }
      }
    }
    return '';
  }

  resetForm(): void {
    this.addUserForm.reset();
    this.addUserForm.patchValue({
      plan: 'diamond',
      noOfUsers: '',
      contactNumber: '',
      countryCode: '+91',
      paymentHistory: {
        paymentMode: '',
        amount: '',
        currency: 'INR',
        subscriptionEnd: '',
        subscriptionId: '',
        packageDuration: '',
        chargeAt: '',
        subscriptionStart: '',
        paymentId: ''
      }
    });

    // Reset payment mode and trigger validation update
    this.paymentMode = '';

    // Trigger plan-based validation for the reset form
    this.updatePlanBasedValidation('diamond');

    this.isFormValid = this.addUserForm.valid;
  }

  // Method to check if form is valid (for debugging)
  getFormValidity(): boolean {
    return this.addUserForm.valid;
  }

  // Method to force refresh conditional fields (for debugging)
  refreshConditionalFields(): void {
    const currentPaymentMode = this.addUserForm.get('paymentHistory.paymentMode')?.value;
    if (currentPaymentMode) {
      this.updatePaymentHistoryValidation(currentPaymentMode);
    }
  }

  // Utility method to convert Unix timestamp to Date (for future use when loading data)
  private convertTimestampToDate(timestamp: number): Date | null {
    if (!timestamp || timestamp === 0) return null;

    // Convert Unix timestamp (seconds) to milliseconds
    const date = new Date(timestamp * 1000);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid timestamp provided:', timestamp);
      return null;
    }

    return date;
  }

  // Utility method to format timestamp for display (for debugging)
  formatTimestampForDisplay(timestamp: number): string {
    if (!timestamp || timestamp === 0) return 'No date';

    const date = this.convertTimestampToDate(timestamp);
    if (!date) return 'Invalid date';

    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  // Method to create user with Firebase Auth and add to users collection
  private createUserWithFirebase(userData: any): void {
    const { email, password, username, contactNumber, plan, noOfUsers, paymentHistory, countryCode } = userData;

    // Create user with Firebase Auth
    firebase.default
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User created successfully:', user.uid);

        // Prepare user profile data for database
        const userProfileData: any = {
          uid: user.uid, // Add UID to userProfileData
          username: username,
          email: email,
          phone: contactNumber,
          firstname: username, // Using username as firstname for admin-created users
          lastname: '',
          company: '',
          category: 'General Sales',
          categoryOthers: '',
          plan: plan,
          noOfUsers: noOfUsers,
          accountType: 'SuperUser',
          superUserId: user.uid,
          zenysCustId: user.uid,
          createdDate: new Date().toISOString(),
          isFirstTimeUser: true,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          tzOffset: new Date().getTimezoneOffset(),
          estimateNoInit: 0,
          quoteNoInit: 0,
          invoiceNoInit: 0,
          // Add countryCode for createCustomer method
          countryCode: countryCode || '+91', // Use selected country code or default to +91
          // Add missing properties that app.component.ts expects
          logOutTime: null,
          autoLogoutActive: false
        };

        // Add payment history only for paid plans
        if (plan !== 'free') {
          const currentTime = Math.floor(Date.now() / 1000);
          const cycleEnd = paymentHistory?.subscriptionEnd || currentTime + (365 * 24 * 60 * 60); // Default to 1 year from now

          userProfileData.paymentHistory = [{
            // Core payment fields
            paymentMode: paymentHistory?.paymentMode || '',
            amount: paymentHistory?.amount || 0,
            currency: paymentHistory?.currency || 'INR',
            plan: plan,
            packageDuration: paymentHistory?.packageDuration || '',

            // Payment IDs
            payment_id: paymentHistory?.paymentId || '',
            subscription_id: paymentHistory?.subscriptionId || '',

            // Cycle dates
            currentCycleStartDate: paymentHistory?.subscriptionStart || currentTime,
            currentCycleEnd: cycleEnd,

            // Subscription specific fields
            subscriptionStart: paymentHistory?.subscriptionStart || currentTime,
            subscriptionEnd: paymentHistory?.subscriptionEnd || cycleEnd,
            charge_at: paymentHistory?.chargeAt || currentTime,

            // Additional fields for compatibility
            packageType: 'single',
            payingCustFromDate: currentTime
          }];

          // Add latest payment/subscription IDs to user profile
          if (paymentHistory?.paymentId) {
            userProfileData.latestpayment_id = paymentHistory.paymentId;
          }
          if (paymentHistory?.subscriptionId) {
            userProfileData.latestsubscription_id = paymentHistory.subscriptionId;
          }
        }

        // Prepare default address data for admin-created users
        const defaultAddressData = {
          street1: '',
          street2: '',
          city: '',
          state: '',
          pincode: '',
          country: '',
          gstnumber: ''
        };

        // Add user to users collection using CreateProfileService
        this.serviceInstance.createProfile(
          user.uid,
          email,
          userProfileData,
          defaultAddressData, // Default address data for admin-created users
          userProfileData.timeZone,
          userProfileData.tzOffset,
          plan,
          this.serviceInstance.getCategory(),
          customFieldNamesData.data
        ).then((resp1) => {
          // addDefaultPipeline after this only add sample contact/sale and service should be called
          this.commonService.addDefaultPipeline(user.uid, 'General Sales');
        })
        .then((resp2) => {
          this.commonService.addSampleReport(user.uid, 'General Sales');
          this.commonService.addAutom1(user.uid, 'General Sales');
          this.commonService.addAutom5(user.uid, 'General Sales');
        })
        .then((resp3) => {
          this.addSampleData(userProfileData);
        })
        .then(() => {
          // Create public profile after sample data is added
          return this.createPublicProfile(userProfileData);
        })
        .then(() => {
          console.log('User profile created successfully in database');
          // Reset form after successful creation
          this.resetForm();
          // You can add a success message or navigation here
        }).catch((error) => {
          console.error('Error creating user profile:', error);
          // Handle error - maybe show error message to user
        });

      })
      .catch((error) => {
        console.error('Error creating user:', error);
        // Handle Firebase Auth errors
        let errorMessage = 'An error occurred while creating the user.';

        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'This email is already registered.';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'The password is too weak.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address.';
        }

        console.error('Firebase Auth Error:', errorMessage);
        // You can show this error message to the user in the UI
      });
  }
  addSampleData(userProfileData) {
    // add sample contact, sale, service, task and followup
    // dashboard report
    this.commonService.addSampleDashBoardReport(userProfileData.uid);
    // 1.contact
    this.commonService.addSampleContact(
      userProfileData.username,
      userProfileData.uid
    );
    // 2.sale
    this.commonService.addSampleSale(userProfileData.username, userProfileData.uid);
    // 3.service
    this.commonService.addSampleService(
      userProfileData.username,
      userProfileData.uid
    );
    // 4.task
    this.commonService.addSampleTask(userProfileData.username, userProfileData.uid);
    // 5.followup
    this.commonService.addSampleCall(userProfileData.username, userProfileData.uid);
    // 6.organisation
    this.commonService.addSampleOrg(userProfileData.username, userProfileData.uid);
    // 7.email templates
    this.commonService.addEmailTemp1(userProfileData.uid);
    this.commonService.addEmailTemp2(userProfileData.uid);
    this.commonService.addEmailTemp3(userProfileData.uid);
    this.commonService.addEmailTemp4(userProfileData.uid);
    this.commonService.addEmailTemp5(userProfileData.uid);
    // 8.add automations
    this.commonService.addAutom2(userProfileData.uid);
    this.commonService.addAutom3(userProfileData.uid);
    this.commonService.addAutom4(userProfileData.uid);
    this.commonService.addAutom6(userProfileData.uid);
    this.commonService.addAutom7(userProfileData.uid);

    // adding SuperUser profile to DB
    this.serviceInstance.create(SuperUserProfile.data, userProfileData.uid);
    // adding Admin profile to DB
    this.serviceInstance.create(AdminProfile.data2, userProfileData.uid);
    // adding SubUser profile to DB
    this.serviceInstance.create(SubUserProfile.data3, userProfileData.uid);
  }

  // Method to create public profile with improved error handling
  private createPublicProfile(userProfileData: any): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Generate public profile ID from username or company name
        let firstValue = userProfileData.username || 'user';
        let first = firstValue.replace(/[^a-zA-Z ]/g, '');

        if (!first || first.trim() === '') {
          first = 'user'; // fallback if username is empty or invalid
        }

        let publicProfIDNotCreated = true;
        let attempts = 0;
        const maxAttempts = 10; // Prevent infinite loop

        const tryCreatePublicProfile = () => {
          if (attempts >= maxAttempts) {
            console.error('Maximum attempts reached for public profile creation');
            reject(new Error('Failed to create unique public profile ID after maximum attempts'));
            return;
          }

          attempts++;
          let random = Math.floor(Math.random() * 100000 + 1);
          let publicProfileId = first + random;

          // Check if public profile ID already exists
          this.serviceInstance
            .getpublicProf(publicProfileId)
            .pipe(take(1))
            .subscribe({
              next: (data) => {
                if (!data) {
                  // Public profile ID is available, create it
                  publicProfIDNotCreated = false;

                  // Update user profile with public profile ID
                  try {
                    this.serviceInstance.updateProfileId(publicProfileId, { uid: userProfileData.uid });
                    console.log('Public profile created successfully:', publicProfileId);
                    resolve();
                  } catch (error) {
                    console.error('Error updating profile with public ID:', error);
                    reject(error);
                  }
                } else {
                  // Public profile ID exists, try again
                  if (publicProfIDNotCreated) {
                    setTimeout(tryCreatePublicProfile, 100); // Small delay before retry
                  }
                }
              },
              error: (error) => {
                console.error('Error checking public profile existence:', error);
                reject(error);
              }
            });
        };

        tryCreatePublicProfile();

      } catch (error) {
        console.error('Error in createPublicProfile:', error);
        reject(error);
      }
    });
  }

  // Method to handle admin logout
  logout(): void {
    this.afAuth.signOut().then(() => {
      console.log('Admin logged out successfully');
      // Navigate to login page after logout
      this.router.navigate(['/user-login']);
    }).catch((error) => {
      console.error('Error during logout:', error);
      // Still navigate to login page even if logout fails
      this.router.navigate(['/user-login']);
    });
  }
}
