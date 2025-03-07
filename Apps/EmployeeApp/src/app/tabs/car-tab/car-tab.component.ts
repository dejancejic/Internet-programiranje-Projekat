import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'car-tab',
  imports: [],
  templateUrl: './car-tab.component.html',
  styleUrl: './car-tab.component.css'
})
export class CarTabComponent implements OnInit {

  @Input() id:number=0;
  @Input() base64Image:string='';
  @Input() manufacturer:string='';
  @Input() model:string='';
  @Input() price:number=0.01;

  @Output() remove=new EventEmitter<string>();


 ngOnInit(): void {
  this.base64Image='data:image/png;base64,'+this.base64Image;
 }


  onImageError(event:any){
    event.target.src = './assets/defaultCar.png';
  }

  removeVehicle()
  {
    this.remove.emit();
  }

}
