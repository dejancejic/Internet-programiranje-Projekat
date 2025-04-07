import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from '../utils/constants.service';
import { BaseService } from '../utils/base.service';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RentalsService extends BaseService{

  constructor(private http:HttpClient,private constantsService:ConstantsService) { 
    super();
  }


  getAllRentals(page: number = 0, size: number = this.constantsService.PAGINATION_NUMBER,query:string='')
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
  
    return this.http.get(this.constantsService.SERVER_URL+'rent/all',options).
      pipe(catchError(this.handleError));
      }

      getMapData()
      {
        let options=this.getStandardOptions();
        options.withCredentials=true;
        options.params=new HttpParams({
          fromObject:{
            format:'json'
          },
        });
        options.withCredentials=true;
  
    return this.http.get(this.constantsService.SERVER_URL+'rent/map',options).
      pipe(catchError(this.handleError));
      }
}
