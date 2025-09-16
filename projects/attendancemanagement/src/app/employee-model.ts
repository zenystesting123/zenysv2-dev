//   Employee Gender
export class EmployeeGender {
  employeeGender: string[] = [];
  constructor() {
    this.employeeGender.push('Male', 'Female');
  }
}

//   Employee Status
export class EmployeeStatus {
  employeeStatus: string[] = [];
  constructor() {
    this.employeeStatus.push('Active Employee', 'Left Organization');
  }
}

// Employee data-model
export class EmployeeModel {
  constructor(
    public id: string,
    public imageURL: string,
    public employeeFirstName: string,
    public employeeSecondName: string,
    public dateOfBirth: any,
    public gender: string,
    public contactNo: number,
    public personalEmail: string,
    public officialEmail: string,
    public emergencyContactPerson: string,
    public emergencyContactNo: number,
    public commAddLine1: string,
    public commAddLine2: string,
    public commAddDist: string,
    public commAddState: string,
    public commAddCountry: string,
    public commAddZip: string,
    public permAddLine1: string,
    public permAddLine2: string,
    public permAddDist: string,
    public permAddState: string,
    public permAddCountry: string,
    public permAddZip: string,
    public status: string,
    public dateOfJoining: any,
    public exitDate: any,
    public employeeID: string,
    public designation: string,
    public bloodGroup: string,
    public superUsrId: string,
    public docId: string,
    public employeeNo: string,
    public CRMAccess:boolean,
    public accType: string
  ) {}
}
export class Upload {
  $key: string;
  file: File;
  name: string;
  url: string;
  type: string;
  progress: number;
  createdAt: Date = new Date();

  constructor(file: File) {
    this.file = file;
  }
}

//   Attendance Status
export class AttendanceStatus {
  attendanceStatus: string[] = [];
  constructor() {
    this.attendanceStatus.push('Working','Personal Leave', 'Public Holiday');
  }
}

// Attendance model
export class AttendanceModel {
  constructor(
    public id: string,
    public attStatus: string,
    public checkIn: string,
    public checkInUpdated: string,
    public checkOut: string,
    public checkOutUpdated: string,
    public loginTime: string,
    public logoutTime: string,
    public activeTime: string,
    public autoLogouts: number
  ) {}
}
export class AttendanceModelDB {
  constructor(
    public id: string,
    public docId: Array<object>
  ) {}
}
