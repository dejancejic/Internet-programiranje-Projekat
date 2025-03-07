import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from '../utils/constants.service';
import { catchError, throwError } from 'rxjs';
import { Manufacturer } from '../../model/manufacturer';

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {

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


      getManufacturers()
      { 
        let options=this.getStandardOptions();
        options.withCredentials=true;
        options.params=new HttpParams({
          fromObject:{
            format:'json'
          },
        });
        options.withCredentials=true;

        return this.http.get(this.constantsService.SERVER_URL+'manufacturer/all',options).
        pipe(catchError(this.handleError));
      }


      deleteManufacturer(id:number)
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

        return this.http.delete(this.constantsService.SERVER_URL+'manufacturer/delete',options).
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
      return throwError(()=>new Error("Cannot get or add manufacturers!"+error.error));
    }
}
