import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from '../utils/constants.service';
import { catchError } from 'rxjs';
import { BaseService } from '../utils/base.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService extends BaseService{

  constructor(private http:HttpClient,private constantsService:ConstantsService) { 
    super();
  }


    getMonthRevenueStatistics()
      {
        let options=this.getStandardOptions();
                    options.withCredentials=true;
                    options.params=new HttpParams({
                      fromObject:{
                        format:'json'
                      },
                    });
                    options.withCredentials=true;
  
        return this.http.get(this.constantsService.SERVER_URL+'statistics/month/revenue',options).
        pipe(catchError(this.handleError));
      }
      
      getVehicleRevenueStatistics()
      {
        let options=this.getStandardOptions();
                    options.withCredentials=true;
                    options.params=new HttpParams({
                      fromObject:{
                        format:'json'
                      },
                    });
                    options.withCredentials=true;
  
        return this.http.get(this.constantsService.SERVER_URL+'statistics/vehicle',options).
        pipe(catchError(this.handleError));
      }


      getTotalMalfunctionsPerVehicleStatistics()
      {
        let options=this.getStandardOptions();
                    options.withCredentials=true;
                    options.params=new HttpParams({
                      fromObject:{
                        format:'json'
                      },
                    });
                    options.withCredentials=true;
  
        return this.http.get(this.constantsService.SERVER_URL+'statistics/malfunctions/total',options).
        pipe(catchError(this.handleError));
      }

}
