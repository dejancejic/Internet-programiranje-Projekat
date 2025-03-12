import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'scooter-details-tab',
  imports: [CommonModule],
  templateUrl: './scooter-details-tab.component.html',
  styleUrl: './scooter-details-tab.component.css'
})
export class ScooterDetailsTabComponent {

  @Input() scooter:any=null!;
  
  onImageError(event:any){
    event.target.src = './assets/defaultScooter.jpg';
  }

}
