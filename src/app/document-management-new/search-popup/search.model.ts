import { Customer, OrganisationModel, Sales } from "src/app/data-models";

export interface DialogEmitData {
    org:OrganisationModel
    customer:Customer;
    sale:Sales
}