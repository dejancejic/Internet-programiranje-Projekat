import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HeaderManufacturerComponent } from "../header-manufacturer/header-manufacturer.component";
import { CommonModule } from '@angular/common';
import { Manufacturer } from '../model/manufacturer';
import { ManufacturerTabComponent } from "../tabs/manufacturer-tab/manufacturer-tab.component";
import { AuthService } from '../services/utils/auth.service';
import { LogoutService } from '../services/logout/logout.service';
import { ManufacturerService } from '../services/manufacturers/manufacturer.service';
import { HttpClientModule } from '@angular/common/http';



declare var bootstrap: any;

@Component({
  selector: 'app-add-manufacturer',
  imports: [HeaderManufacturerComponent, CommonModule, ManufacturerTabComponent,HttpClientModule],
  templateUrl: './add-manufacturer.component.html',
  styleUrl: './add-manufacturer.component.css',
  providers:[ManufacturerService]
})
export class AddManufacturerComponent implements AfterViewInit,OnInit{

  manufacturers:Manufacturer[]=[];

  query='';

  displayedManufacturers: Manufacturer[] = [];
  displayedManufacturersAll: Manufacturer[] = [];

  manufacturerMap: { [key: string]: Manufacturer[] } = {};

  manufacturerService=inject(ManufacturerService);
  authService=inject(AuthService);
  logoutService=inject(LogoutService);
  
  

  selectedManufacturerIndex:number=-1;
  loading:boolean=true;


  loadingVirtual:boolean=false;

  selectedVehicleType='Car';

  private currentBatch = 0;
  private batchSize = 3;




  modalInstance: any;
  @ViewChild('removeManufacturerModal') removeVehicleModal: any; 

  @ViewChild('scrollContainer') scrollContainer: any;

  ngAfterViewInit(): void {
    const modalElement = this.removeVehicleModal.nativeElement;
    this.modalInstance = new bootstrap.Modal(modalElement);
  }


  ngOnInit(): void {
    if(this.authService.isLoggedIn()==false)
    {
      return;
    }
    
    this.getManufacturers();

  }

  private loadManufacturers() {
    if (this.loading) return; 
    if (this.query.trim() || this.displayedManufacturers.length >= this.manufacturers.length) {
    
        return; 
    }

    this.loading = true;
    

    setTimeout(() => {
        const start = this.displayedManufacturers.length;
        const end = start + this.batchSize;

    
        this.displayedManufacturers = [...this.displayedManufacturers, ...this.manufacturers.slice(start, end)];
        this.displayedManufacturersAll= [...this.displayedManufacturers, ...this.manufacturers.slice(start, end)];
        this.loading = false;
    }, 1000); 
}


  loadManufacturersInitial()
  {
    if(this.manufacturers.length>=6){
      this.displayedManufacturers = this.manufacturers.slice(0, 6);
      this.displayedManufacturersAll = this.manufacturers.slice(0, 6);
      }
    else{
      this.displayedManufacturers = this.manufacturers;
      this.displayedManufacturersAll = this.manufacturers;
    }
    this.currentBatch=0;
  
  }

  private getManufacturers()
  {
  
    this.manufacturerService.getManufacturers().subscribe((data:any)=>{
      this.manufacturerMap=data;
      this.manufacturers = [...this.manufacturers, ...data[this.selectedVehicleType]];
      if(this.manufacturers.length>=6){
      this.displayedManufacturers = this.manufacturers.slice(0, 6);
      this.displayedManufacturersAll = this.manufacturers.slice(0, 6);
      }
    else{
      this.displayedManufacturers = this.manufacturers;
      this.displayedManufacturersAll = this.manufacturers;
 
    }
     this.loading=false;
     this.currentBatch++;
  },(error)=>{
    alert(error);
    this.loading=false;
    });

  }


  onScroll(event: any) {
    const container = this.scrollContainer.nativeElement;
    const threshold = 100; 

    if (container.scrollTop + container.clientHeight + threshold >= container.scrollHeight) {
      

      this.loadManufacturers();
    }
  }
  

  search(query: any) {
    this.query=query;
    if (!query.trim()) {
     
      this.displayedManufacturers = [...new Set(this.displayedManufacturersAll)];
      
      return;
    }
  

    const filtered = this.manufacturers.filter(m =>
      m.name.toLowerCase().includes(query.toLowerCase())
    );
  
    this.displayedManufacturers = [...filtered]; 
  }
  
  showDeleteVehicleModal(index:number)
  {
    if (this.modalInstance) {
      this.selectedManufacturerIndex=index;
      this.modalInstance.show();
    }
  }


  removeManufacturer()
  {
   
    if(this.selectedManufacturerIndex!==-1)
    {
      let manu=this.manufacturers[this.selectedManufacturerIndex];
      
      let man=this.manufacturers[this.selectedManufacturerIndex];
      this.manufacturers.splice(this.selectedManufacturerIndex,1);
      let index=this.displayedManufacturers.indexOf(man);
      this.displayedManufacturers.splice(index,1);
      this.manufacturerMap[this.selectedVehicleType]=this.manufacturers;

      this.manufacturerService.deleteManufacturer(manu.id).subscribe((data:any)=>{
         


      },(error)=>{
        alert(error);
        this.loading=false;
        });
      
      
      this.modalInstance.hide();
   
    }
    this.selectedManufacturerIndex=-1;
  }


  changeType(type:string)
  {
    this.selectedVehicleType=type;
    
    this.manufacturers=this.manufacturerMap[type];
    this.loadManufacturersInitial();
  }


  addManufacturer(manufacturer:any)
  {

    this.manufacturerService.addManufacturer(manufacturer,this.selectedVehicleType).subscribe((data:any)=>{
      this.manufacturers = [...this.manufacturers, manufacturer];
      this.displayedManufacturers = [...this.displayedManufacturers, manufacturer];
    
    this.manufacturerMap[this.selectedVehicleType]=this.manufacturers;
    
    this.loading=false;

  },(error)=>{
    alert(error);
    this.loading=false;
    });
  }


  updateManufacturer(manufacturer:any)
  {
    this.manufacturerService.updateManufacturer(manufacturer).subscribe((data:any)=>{
       
    },(error)=>{
      alert(error);
      });

    
  }


}
