export class UserModel{
    constructor(
        public id: string,
        public superUserId : string,
        public email : string,
        public firstname : string,
        public lastname : string,
        public countryCode:string,
        public phone : number,
        public category : string,
        public categoryOthers : string,
        public createdDate : string,
        public profileCompletionStatus : boolean,
        public plan : string
    ){}
}