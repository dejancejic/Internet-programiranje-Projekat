import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Bike } from '../../model/bike';
import { NavAdminComponent } from '../../navbars/nav-admin/nav-admin.component';
import { Router } from '@angular/router';
import { NavManagerComponent } from '../../navbars/nav-manager/nav-manager.component';

@Component({
  selector: 'bike-tab',
  imports: [CommonModule],
  templateUrl: './bike-tab.component.html',
  styleUrl: './bike-tab.component.css'
})
export class BikeTabComponent implements OnInit{

  @Input() showDelete:boolean=true;
  @Input() bike:Bike=null!;
  @Output() remove=new EventEmitter();
  @Output() updatePrice=new EventEmitter();
  router=inject(Router);


  ngOnInit(): void {
    if(!this.bike.image.startsWith('data:')){
    this.bike.image='data:image/png;base64,'+this.bike.image;
    }
   }

  onImageError(event:any){
    event.target.src = './assets/defaultBike.jpg';
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
            this.router.navigate(['manager','details'], { queryParams: { id: this.bike.id,type:'bike'} });
          }
          else{
      NavAdminComponent.showInfoTab=true;
      this.router.navigate(['transport','details'], { queryParams: { id: this.bike.id,type:'bike'} });
          }
    }

}
