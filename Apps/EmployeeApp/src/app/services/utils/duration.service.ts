import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DurationService {

  constructor() { }


  calculateDuration(start: Date, end: Date): string {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    
    if (endTime < startTime) {
      return 'Invalid duration';
    }
  
    let diff = endTime - startTime;
  
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
  
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
  
    const minutes = Math.floor(diff / (1000 * 60));
  
    let result = '';
    if (days > 0) {
      result += `${days}d `;
    }
    if (hours > 0 || days > 0) { 
      result += `${hours}h `;
    }
    result += `${minutes}m`;
  
    return result.trim();
  }
}
