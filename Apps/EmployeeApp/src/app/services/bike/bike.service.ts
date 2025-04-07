import { Injectable } from '@angular/core';
import { BaseService } from '../utils/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConstantsService } from '../utils/constants.service';
import { catchError } from 'rxjs';
import { Bike } from '../../model/bike';

@Injectable({
  providedIn: 'root'
})
export class BikeService extends BaseService{

  constructor(private http:HttpClient,private constantsService:ConstantsService) {
    super();
   }

getBikes(page: number = 0, size: number = this.constantsService.PAGINATION_NUMBER,query:string='')
          { 
            let options=this.getStandardOptions();
            options.withCredentials=true;
            options.params=new HttpParams({
              fromObject:{
                format:'json',
                page: page.toString(),
            size: size.toString(),
            query:query,
              },
            });
            options.withCredentials=true;
    
            return this.http.get(this.constantsService.SERVER_URL+'vehicle/bikes',options).
            pipe(catchError(this.handleError));
    }


    addBike(bike:Bike)
             { 
              
    let options=this.getStandardOptions();
    options.withCredentials=true;
    options.params=new HttpParams({
      fromObject:{
      format:'json',
                    
                  },
                });
                      
 options.withCredentials=true;
              
  let body=JSON.stringify(bike);
                     
              
  return this.http.post(this.constantsService.SERVER_URL+'vehicle/bikes/add',body,options).
  pipe(catchError(this.handleError));
    }


}
