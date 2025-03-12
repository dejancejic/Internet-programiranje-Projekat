import { Account } from "./account";

export class Client extends Account
{
    constructor(
        id:number,
        username:string,
        password:string,
        name:string,
        surname:string,
        public email:string,
        public phone:string,
        public image:string,
        public documentId:number,
        public blocked:boolean
    ){
        super(id,username,password,name,surname);
    }
}