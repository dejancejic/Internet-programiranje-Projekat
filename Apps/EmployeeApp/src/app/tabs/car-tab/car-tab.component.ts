import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Car } from '../../model/car';
import { Router } from '@angular/router';
import { NavAdminComponent } from '../../navbars/nav-admin/nav-admin.component';
import { NavManagerComponent } from '../../navbars/nav-manager/nav-manager.component';

@Component({
  selector: 'car-tab',
  imports: [CommonModule],
  templateUrl: './car-tab.component.html',
  styleUrl: './car-tab.component.css'
})
export class CarTabComponent implements OnInit {

  @Input() showDelete:boolean=true;
  @Input() car:Car=null!;

  @Output() remove=new EventEmitter<string>();
  @Output() updatePrice=new EventEmitter();
  
  router=inject(Router);

 ngOnInit(): void {
  if(!this.car.image.startsWith('data:')){
  this.car.image='data:image/png;base64,'+this.car.image;
  }
 }


  onImageError(event:any){
    event.target.src = './assets/defaultCar.png';
  }

  removeVehicle(event:Event)
  {
    event.stopPropagation();
    this.remove.emit();
  }

  showDetails()
  {

    if(this.showDelete===false){

      this.updatePrice.emit();
      return;
    }

    if(window.location.href.includes("manager")){
      NavManagerComponent.showInfoTab=true;
      this.router.navigate(['manager','details'], { queryParams: { id: this.car.id,type:'car'} });
    }
    else{
      NavAdminComponent.showInfoTab=true;
    this.router.navigate(['transport','details'], { queryParams: { id: this.car.id,type:'car'} });
    }
  }

}
