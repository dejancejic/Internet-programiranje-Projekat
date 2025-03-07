import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from '../utils/constants.service';
import { catchError, throwError } from 'rxjs';
import { Car } from '../../model/car';

@Injectable({
  providedIn: 'root'
})
export class CarsService {

  constructor(private http:HttpClient,private constantsService:ConstantsService) { }

private getStandardOptions():any
    {
      return {
        headers:
        new HttpHeaders({
          'Content-Type':'application/json',
        })
      };
    }


     getCars()
          { 
            let options=this.getStandardOptions();
            options.withCredentials=true;
            options.params=new HttpParams({
              fromObject:{
                format:'json'
              },
            });
            options.withCredentials=true;
    
            return this.http.get(this.constantsService.SERVER_URL+'vehicle/cars',options).
            pipe(catchError(this.handleError));
          }


          addCar(car:Car)
                { 
                  let options=this.getStandardOptions();
                  options.withCredentials=true;
                  options.params=new HttpParams({
                    fromObject:{
                      format:'json'
                    },
                  });
                  options.withCredentials=true;
          
                  let body=JSON.stringify(car);
          
                  return this.http.post(this.constantsService.SERVER_URL+'vehicles/car/add',body,options).
                  pipe(catchError(this.handleError));
                }


    private handleError(error:HttpErrorResponse)
        {
          if(error.status === 0)
          {
            console.error("There is an issue with client or network:",error.error);
          }
          else{
            console.error("Server error: "+error.error);
          }
          return throwError(()=>new Error("Cannot get or add cars!"+error.error));
        }

}
