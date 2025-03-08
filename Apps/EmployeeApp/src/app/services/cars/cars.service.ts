import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from '../utils/constants.service';
import { catchError, throwError } from 'rxjs';
import { Car } from '../../model/car';
import { BaseService } from '../utils/base.service';

@Injectable({
  providedIn: 'root'
})
export class CarsService extends BaseService {

  constructor(private http:HttpClient,private constantsService:ConstantsService) {
    super();
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
                      format:'json',
                
                    },
                  });
                  
                  options.withCredentials=true;
          
                  let body=JSON.stringify(car);
                 
          
                  return this.http.post(this.constantsService.SERVER_URL+'vehicle/cars/add',body,options).
                  pipe(catchError(this.handleError));
                }


                


}
