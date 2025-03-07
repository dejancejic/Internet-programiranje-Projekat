import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  public SERVER_URL='https://localhost:8443/';
  
  constructor() { }
}
