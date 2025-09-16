// help video model
export class HelpVideoModel{
    constructor(
        public id:string,
        public page : string,
        public link : string,
    ){}
}
// help topics model
export class HelpTopicsModel{
    constructor(
        public id:string,
        public page : string,
        public helpTopic : Array<HelpContentModel>
    ){}
}
// help content model
export interface HelpContentModel {
    position:number;
    title: string;
    snippet: string;
    content: string;
    contentLink:string;
  }