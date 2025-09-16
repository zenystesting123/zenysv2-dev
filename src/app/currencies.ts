
export class Currency{
    constructor(
       public isoCode:string,
       public currencyName:string,
       public basicUnit:number
    ){}
}
export abstract class  Currencies {

    static getCurencies(): Currency[] {
        let curencies: Currency[] = [];
        curencies.push(new Currency('AED', 'United Arab Emirates Dirham', 100));
        curencies.push(new Currency('ALL', ' Albanian lek', 100));
        curencies.push(new Currency('AMD', 'Armenian dram', 100));
        curencies.push(new Currency('ARS', 'Argentine peso', 100));
        curencies.push(new Currency('AUD', 'Australian dollar', 100));
        curencies.push(new Currency('AWG', 'Aruban florin', 100));
        curencies.push(new Currency('BBD', 'Barbadian dollar', 100));
        curencies.push(new Currency('BDT', 'Bangladeshi taka', 100));
        curencies.push(new Currency('BMD', 'Bermudian dollar', 100));
        curencies.push(new Currency('BND', 'Brunei dollar', 100));
        curencies.push(new Currency('BOB', 'Bolivian boliviano	', 100));
        curencies.push(new Currency('BSD', 'Bahamian dollar', 100));
        curencies.push(new Currency('BWP', 'Botswana pula', 100));
        curencies.push(new Currency('BZD', 'Belize dollar', 100));
        curencies.push(new Currency('CAD', 'Canadian dollar', 100));
        curencies.push(new Currency('CHF', 'Swiss franc', 100));
        curencies.push(new Currency('CNY', 'Chinese yuan renminbi', 10));
        curencies.push(new Currency('COP', 'Colombian peso', 100));
        curencies.push(new Currency('CRC', 'Costa Rican colon', 100));
        curencies.push(new Currency('CUP', 'Cuban peso	', 100));
        curencies.push(new Currency('CZK', 'Czech koruna', 100));
        curencies.push(new Currency('DKK', 'Danish krone', 100));
        curencies.push(new Currency('DOP', 'Dominican peso	', 100));
        curencies.push(new Currency('DZD', 'Algerian dinar', 100));
        curencies.push(new Currency('EGP', 'Egyptian pound', 100));
        curencies.push(new Currency('ETB', 'Ethiopian birr', 100));
        curencies.push(new Currency('EUR', 'European euro', 100));
        curencies.push(new Currency('FJD', 'Fijian dollar', 100));
        curencies.push(new Currency('GBP', 'Pound sterling', 100));
        curencies.push(new Currency('GHS', 'Ghanian Cedi', 100));
        curencies.push(new Currency('GIP', 'Gibraltar pound', 100));
        curencies.push(new Currency('GMD', 'Gambian dalasi', 100));
        curencies.push(new Currency('GTQ', 'Guatemalan quetzal	', 100));
        curencies.push(new Currency('GYD', 'Guyanese dollar', 100));
        curencies.push(new Currency('HKD', 'Hong Kong dollar', 100));
        curencies.push(new Currency('HNL', 'Honduran lempira', 100));
        curencies.push(new Currency('HRK', 'Croatian kuna', 100));
        curencies.push(new Currency('HTG', 'Haitian gourde', 100));
        curencies.push(new Currency('HUF', ' Hungarian forint', 100));
        curencies.push(new Currency('IDR', 'Indonesian rupiah', 100));
        curencies.push(new Currency('ILS', 'Israeli new shekel', 100));
        curencies.push(new Currency('INR', 'Indian rupee', 100));
        curencies.push(new Currency('JMD', 'Jamaican dollar', 100));
        curencies.push(new Currency('KES', 'Kenyan shilling', 100));
        curencies.push(new Currency('KGS', 'Kyrgyzstani som', 100));
        curencies.push(new Currency('KHR', 'Cambodian riel', 100));
        curencies.push(new Currency('KYD', 'Cayman Islands dollar', 100));
        curencies.push(new Currency('KZT', 'Kazakhstani tenge', 100));
        curencies.push(new Currency('LAK', 'Lao kip', 100));
        curencies.push(new Currency('LBP', 'Lebanese pound', 100));
        curencies.push(new Currency('LKR', 'Sri Lankan rupee', 100));
        curencies.push(new Currency('LRD', 'Liberian dollar', 100));
        curencies.push(new Currency('LSL', 'Lesotho loti', 100));
        curencies.push(new Currency('MAD', 'Moroccan dirham', 100));
        curencies.push(new Currency('MDL', 'Moldovan leu', 100));
        curencies.push(new Currency('MKD', 'Macedonian denar', 100));
        curencies.push(new Currency('MMK', 'Myanmar kyat', 100));
        curencies.push(new Currency('MNT', 'Mongolian tugrik', 100));
        curencies.push(new Currency('MOP', 'Macanese pataca', 100));
        curencies.push(new Currency('MUR', 'Mauritian rupee', 100));
        curencies.push(new Currency('MVR', 'Maldivian rufiyaa', 100));
        curencies.push(new Currency('MWK', 'Malawian kwacha', 100));
        curencies.push(new Currency('MXN', 'Mexican peso', 100));
        curencies.push(new Currency('MYR', 'Malaysian ringgit', 100));
        curencies.push(new Currency('NAD', 'Namibian dollar', 100));
        curencies.push(new Currency('NGN', 'Nigerian naira', 100));
        curencies.push(new Currency('NIO', 'Nicaraguan cordoba	', 100));
        curencies.push(new Currency('NOK', 'Norwegian krone', 100));
        curencies.push(new Currency('NPR', 'Nepalese rupee', 100));
        curencies.push(new Currency('NZD', ' New Zealand dollar', 100));
        curencies.push(new Currency('PEN', 'Peruvian sol', 100));
        curencies.push(new Currency('PGK', ' Papua New Guinean kina', 100));
        curencies.push(new Currency('PHP', 'Philippine peso', 100));
        curencies.push(new Currency('PKR', 'Pakistani rupee', 100));
        curencies.push(new Currency('QAR', 'Qatari riyal', 100));
        curencies.push(new Currency('RUB', 'Russian ruble', 100));
        curencies.push(new Currency('SAR', 'Saudi Arabian riyal', 100));
        curencies.push(new Currency('SCR', 'Seychellois rupee', 100));
        curencies.push(new Currency('SEK', 'Swedish krona', 100));
        curencies.push(new Currency('SGD', 'Singapore dollar', 100));
        curencies.push(new Currency('SLL', 'Sierra Leonean leone', 100));
        curencies.push(new Currency('SOS', 'Somali shilling', 100));
        curencies.push(new Currency('SSP', 'South Sudanese pound', 100));
        curencies.push(new Currency('SVC', 'Salvadoran colón', 100));
        curencies.push(new Currency('SZL', 'Swazi lilangeni', 100));
        curencies.push(new Currency('THB', 'Thai baht', 100));
        curencies.push(new Currency('TTD', 'Trinidad and Tobago dollar', 100));
        curencies.push(new Currency('TZS', 'Tanzanian shilling', 100));
        curencies.push(new Currency('USD', 'United States dollar', 100));
        curencies.push(new Currency('UYU', 'Uruguayan peso', 100));
        curencies.push(new Currency('UZS', "Uzbekistani so'm", 100));
        curencies.push(new Currency('YER', 'Yemeni rial', 100));
        curencies.push(new Currency('ZAR', 'South African rand	', 100));
        return curencies;
      }
}