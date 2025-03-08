import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor() { }


  protected getStandardOptions():any
      {
        return {
          headers:
          new HttpHeaders({
            'Content-Type':'application/json',
          })
        };
      }

      protected getTextOptions():any
      {
        return {
          headers:
          new HttpHeaders({
            'Content-Type':'application/text',
          })
        };
      }



      protected handleError(error:HttpErrorResponse)
              {
                if(error.status === 0)
                {
                  console.error("There is an issue with client or network:",error.error);
                }
                else{
                  console.error("Server error: "+error.error);
                }
                return throwError(()=>new Error(error.error));
              }
}
