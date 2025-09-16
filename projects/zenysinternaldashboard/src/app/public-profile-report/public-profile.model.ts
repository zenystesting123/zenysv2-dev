export class PublicProfileModel{
    constructor(
        public id: string,
        public category : string,
        public categoryOthers : string,
        public profileDistrict : string,
        public profileCountry : string,
        public profileFirstname : string,
        public profileLastname : string,
        public profilePhone:string,
        public userId:string
    ){}
}