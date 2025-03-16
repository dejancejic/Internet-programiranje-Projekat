import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Scooter } from '../../model/scooter';
import { Router } from '@angular/router';
import { NavAdminComponent } from '../../navbars/nav-admin/nav-admin.component';
import { NavManagerComponent } from '../../navbars/nav-manager/nav-manager.component';

@Component({
  selector: 'scooter-tab',
  imports: [CommonModule],
  templateUrl: './scooter-tab.component.html',
  styleUrl: './scooter-tab.component.css'
})
export class ScooterTabComponent {

  @Input() showDelete:boolean=true;
  @Input() scooter:Scooter=null!;

  @Output() remove=new EventEmitter();
  @Output() updatePrice=new EventEmitter();
    
  router=inject(Router);
  
    ngOnInit(): void {
      if(!this.scooter.image.startsWith('data:')){
      this.scooter.image='data:image/png;base64,'+this.scooter.image;
      }
     }
  
    onImageError(event:any){
      event.target.src = './assets/defaultScooter.jpg';
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
                    this.router.navigate(['manager','details'], { queryParams: { id: this.scooter.id,type:'scooter'} });
                  }
                  else{
        NavAdminComponent.showInfoTab=true;
        this.router.navigate(['transport','details'], { queryParams: { id: this.scooter.id,type:'scooter'} });
                  }
      }

}
