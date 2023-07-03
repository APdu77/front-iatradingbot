export class Account {
    id?:number;
    email?:String;
    previousEmail?:String;
    password?:string;
    binanceAccountId?:String;
    binanceApiKey?:string;
    binanceApiSecret?:string;
    suspended?:boolean;
    isApiSecretSet?:boolean;
    validatedMail?:boolean;
    wallet?:any[];
}
