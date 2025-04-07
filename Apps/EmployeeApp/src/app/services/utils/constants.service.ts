import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  public SERVER_URL='https://localhost:8443/';
  public MAP_ZOOM=14;
  public MAP_INITIAL_POSITION={ x: 44.790754, y: 17.197667 }; 
  public PAGINATION_NUMBER=6;
  
  constructor() { }
}
