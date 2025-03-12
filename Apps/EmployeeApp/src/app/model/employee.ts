import { Account } from "./account";

export class Employee extends Account
{

    constructor(
        id:number,
        username:string,
        password:string,
        name:string,
        surname:string,
        public role:string
    ){
        super(id,username,password,name,surname);
    }

}