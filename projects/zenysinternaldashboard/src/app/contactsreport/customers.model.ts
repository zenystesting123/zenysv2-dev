export class CustomerModel{
    constructor(
        public id: string,
        public status: string,
        public firstName: string,
        public secondName:string,
        public companyName: string,
        public dateCreated: any,
        public priority: string,
        public assignedToName: string,
        public custField1Name: string,
        public custField2Name : string,
        public custField3Name:string,
        public custField4Name:string,
        public custCategory1Name:string,
        public custCategory2Name:string,
        public custField1: string,
        public custField2 : string,
        public custField3:string,
        public custField4:string,
        public custCategory1:string,
        public custCategory2:string,
    ){}
}