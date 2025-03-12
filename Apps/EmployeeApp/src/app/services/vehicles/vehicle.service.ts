import { Injectable } from '@angular/core';
import { BaseService } from '../utils/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs';
import { ConstantsService } from '../utils/constants.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService extends BaseService{

  constructor(private http:HttpClient,private constantsService:ConstantsService) { 
    super();
  }


  deleteVehicle(id:number)
                { 
                  let options=this.getStandardOptions();
                  options.withCredentials=true;
                  options.params=new HttpParams({
                    fromObject:{
                      format:'json',
                      id:id.toString()
                    },
                  });
                  options.withCredentials=true;
          
                  return this.http.delete(this.constantsService.SERVER_URL+'vehicle/delete',options).
                  pipe(catchError(this.handleError));
                }


    getVehicleById(id:number)
    {
      let options=this.getStandardOptions();
                  options.withCredentials=true;
                  options.params=new HttpParams({
                    fromObject:{
                      format:'json',
                      id:id
                    },
                  });
                  options.withCredentials=true;

      return this.http.get(this.constantsService.SERVER_URL+'vehicle/id',options).
      pipe(catchError(this.handleError));
    }
}
