export class emailTemplateModel{
    constructor(
        public id:string,
        public templateName : string,
        public subject:string,
        public body:string,
        public templateType:string
    ){}
}