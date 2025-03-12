import { Injectable } from '@angular/core';
import { BaseService } from '../utils/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConstantsService } from '../utils/constants.service';
import { catchError } from 'rxjs';
import { Employee } from '../../model/employee';

@Injectable({
  providedIn: 'root'
})
export class AccountsService extends BaseService {

  constructor(private http:HttpClient,private constantsService:ConstantsService) {
      super();
     }

     getEmployees()
               { 
                 let options=this.getStandardOptions();
                 options.withCredentials=true;
                 options.params=new HttpParams({
                   fromObject:{
                     format:'json'
                   },
                 });
         
                 return this.http.get(this.constantsService.SERVER_URL+'account/employees',options).
                 pipe(catchError(this.handleError));
         }


         getClients()
               { 
                 let options=this.getStandardOptions();
                 options.withCredentials=true;
                 options.params=new HttpParams({
                   fromObject:{
                     format:'json'
                   },
                 });
         
                 return this.http.get(this.constantsService.SERVER_URL+'account/clients',options).
                 pipe(catchError(this.handleError));
         }


        setClientStatus(id:number,status:boolean)
        {
          let options=this.getStandardOptions();
                 options.withCredentials=true;
                 options.params=new HttpParams({
                   fromObject:{
                     format:'json',
                     id:id,
                     status:status
                   },
                 });
         
                 return this.http.put(this.constantsService.SERVER_URL+'account/client/status',{},options).
                 pipe(catchError(this.handleError));
        }


        addEmployee(employee:Employee)
        {
          let options=this.getStandardOptions();
                 options.withCredentials=true;
                 options.params=new HttpParams({
                   fromObject:{
                     format:'json'
                   },
                 });

                 let body=JSON.stringify(employee);

                 return this.http.post(this.constantsService.SERVER_URL+'account/employee/add',body,options).
                 pipe(catchError(this.handleError));
        }

        updateEmployee(employee:Employee)
        {
          let options=this.getStandardOptions();
                 options.withCredentials=true;
                 options.params=new HttpParams({
                   fromObject:{
                     format:'json'
                   },
                 });

                 let body=JSON.stringify(employee);

                 return this.http.put(this.constantsService.SERVER_URL+'account/employee/update',body,options).
                 pipe(catchError(this.handleError));
        }

        deleteEmployee(id:number)
        {
          let options=this.getStandardOptions();
                 options.withCredentials=true;
                 options.params=new HttpParams({
                   fromObject:{
                     format:'json',
                     id:id
                   },
                 });


                 return this.http.delete(this.constantsService.SERVER_URL+'account/employee/delete',options).
                 pipe(catchError(this.handleError));
        }



}
