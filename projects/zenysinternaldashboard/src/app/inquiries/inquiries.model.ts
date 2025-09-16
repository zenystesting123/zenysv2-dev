export class InquiriesModel{
    constructor(
        public id: string,
        public phone:string,
        public email:string,
        public message:string,
        public date:any,
        public status:string,
        public profileFname:string,
        public profileSname:string,
        public profileCompany:string,
        public profileDistrict:string,
        public profileState:string,
        public month:string,
        public year:string,
        public profileEmail:string,
        public profilePhone:string
    ){}
}
// id,contact no, email, message, date created, status, assigned to