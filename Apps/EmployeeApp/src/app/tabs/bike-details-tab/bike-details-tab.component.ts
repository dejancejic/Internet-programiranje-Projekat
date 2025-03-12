import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'bike-details-tab',
  imports: [CommonModule],
  templateUrl: './bike-details-tab.component.html',
  styleUrl: './bike-details-tab.component.css'
})
export class BikeDetailsTabComponent {
@Input() bike:any=null!;

onImageError(event:any){
  event.target.src = './assets/defaultBike.jpg';
}
}
