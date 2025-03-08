import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ConstantsService } from '../utils/constants.service';
import { BaseService } from '../utils/base.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseService{

  constructor(private http:HttpClient,private constantsService:ConstantsService) {
    super();
   }

  

  login(username:string,password:string)
  { 
    let options=this.getStandardOptions();
    options.withCredentials=true;
    options.params=new HttpParams({
      fromObject:{
        format:'json'
      }
    });
    let body={
      "username":username,
      "password":password
    };
    return this.http.post(this.constantsService.SERVER_URL+'login/employee',body,options).
    pipe(catchError(this.handleError));
  }

  tokenLogin(token:string)
  { 
    let options=this.getStandardOptions();
    options.withCredentials=true;
    options.params=new HttpParams({
      fromObject:{
        format:'text',
        token:token
      },
    });
    
    return this.http.post(this.constantsService.SERVER_URL+'login/employee/token',{},options).
    pipe(catchError(this.handleError));
  }



  protected override handleError(error:HttpErrorResponse)
  {
    if(error.status === 0)
    {
      console.error("There is an issue with client or network:",error.error);
    }
    else{
      console.error("Server error: "+error.error);
    }
    return throwError(()=>new Error("Cannot login!"+error.error));
  }

}
