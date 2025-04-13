import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from '../utils/constants.service';
import { catchError, throwError } from 'rxjs';
import { Manufacturer } from '../../model/manufacturer';
import { BaseService } from '../utils/base.service';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService extends BaseService{

  constructor(private http:HttpClient,private constantsService:ConstantsService) { 
    super();
  }

    addManufacturer(manufacturer:Manufacturer,type1:string)
      { 
        let options=this.getStandardOptions();
        options.withCredentials=true;
        options.params=new HttpParams({
          fromObject:{
            format:'json',
            type:type1
          },
        });
        options.withCredentials=true;

        let body=JSON.stringify(manufacturer);

        return this.http.post(this.constantsService.SERVER_URL+'manufacturer/add',body,options).
        pipe(catchError(this.handleError));
      }


      updateManufacturer(manufacturer:Manufacturer)
      { 
        let options=this.getStandardOptions();
        options.withCredentials=true;
        options.params=new HttpParams({
          fromObject:{
            format:'json',
          },
        });
        options.withCredentials=true;

        let body=JSON.stringify(manufacturer);

        return this.http.put(this.constantsService.SERVER_URL+'manufacturer/update',body,options).
        pipe(catchError(this.handleError));
      }


      getManufacturers(page: number = 0, size: number = this.constantsService.PAGINATION_NUMBER,query:string='')
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

        return this.http.get(this.constantsService.SERVER_URL+'manufacturer/all',options).
        pipe(catchError(this.handleError));
      }


      getAllManufacturers()
      { 
        let options=this.getStandardOptions();
        options.withCredentials=true;
        options.params=new HttpParams({
          fromObject:{
            format:'json'
          },
        });
        options.withCredentials=true;

        return this.http.get(this.constantsService.SERVER_URL+'manufacturer/allmanufacturers',options).
        pipe(catchError(this.handleError));
      }


      deleteManufacturer(id:number)
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

        return this.http.delete(this.constantsService.SERVER_URL+'manufacturer/delete',options).
        pipe(catchError(this.handleError));
      }







  
}
