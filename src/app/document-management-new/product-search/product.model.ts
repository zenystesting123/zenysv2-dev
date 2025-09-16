export class Product {
    constructor(
        public id: string,
        public itemName: string,
        public description: string,
        public unit: string,
        public hsnCode: string,
        public rate: number,
        public discountPercentage: number,
        public sgstPercentage: number,
        public cgstPercentage: number,
        public igstPercentage: number,
        public vatPercentage: number,
    ) { }
}