import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransportService {

  constructor(private http:HttpClient) { }


  loadCars(){

  }

  loadBikes(){

  }
  
  loadScooters()
  {

    
  }
}
