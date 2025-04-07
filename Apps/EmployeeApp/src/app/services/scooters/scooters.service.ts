import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from '../utils/constants.service';
import { BaseService } from '../utils/base.service';
import { catchError } from 'rxjs';
import { Scooter } from '../../model/scooter';

@Injectable({
  providedIn: 'root'
})
export class ScootersService extends BaseService{

  constructor(private http:HttpClient,private constantsService:ConstantsService) {
    super();
   }

    getScooters(page: number = 0, size: number = this.constantsService.PAGINATION_NUMBER,query:string='')
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
    
            return this.http.get(this.constantsService.SERVER_URL+'vehicle/scooters',options).
            pipe(catchError(this.handleError));
    }


    addScooter(scooter:Scooter)
             { 
              
    let options=this.getStandardOptions();
    options.withCredentials=true;
    options.params=new HttpParams({
      fromObject:{
      format:'json'     
                  },
                });
                      
 options.withCredentials=true;
              
  let body=JSON.stringify(scooter);
                     
              
  return this.http.post(this.constantsService.SERVER_URL+'vehicle/scooters/add',body,options).
  pipe(catchError(this.handleError));
    }
  

}
