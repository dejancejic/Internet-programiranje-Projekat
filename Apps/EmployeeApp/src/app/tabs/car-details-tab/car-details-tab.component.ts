import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'car-details-tab',
  imports: [CommonModule],
  templateUrl: './car-details-tab.component.html',
  styleUrl: './car-details-tab.component.css'
})
export class CarDetailsTabComponent {
@Input() car:any=null!;

onImageError(event:any){
  event.target.src = './assets/defaultCar.png';
}
}
