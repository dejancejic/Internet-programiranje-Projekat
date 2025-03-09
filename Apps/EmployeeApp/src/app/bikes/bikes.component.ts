import { AfterViewInit, ChangeDetectorRef, Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Bike } from '../model/bike';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { VehicleService } from '../services/vehicles/vehicle.service';
import { Vehicle } from '../model/vehicle';
import { BikeTabComponent } from "../tabs/bike-tab/bike-tab.component";
import { BikeService } from '../services/bike/bike.service';

declare var bootstrap: any;

@Component({
  selector: 'app-bikes',
  imports: [HeaderComponent, HttpClientModule, CommonModule, CdkVirtualScrollViewport, ScrollingModule, BikeTabComponent],
  templateUrl: './bikes.component.html',
  styleUrl: './bikes.component.css',
  providers:[VehicleService,BikeService]
})
export class BikesComponent implements OnInit,AfterViewInit {

  bikes:Bike[]=[];
  allBikes:Bike[]=[];

  query:string='';

  vehicleService=inject(VehicleService);

  bikeService=inject(BikeService);

  visibleRows: any[] = [];
    constructor(private cdr: ChangeDetectorRef){}
    itemsPerRow = 1;
    rowHeight = 150;


      @ViewChild('removeVehicleModal') removeVehicleModal: any; 
      @ViewChild('successModal') successModal: any; 

  modalInstance: any;
  modalInstanceSuccess: any;

  selectedId=-1;
  loading:boolean=true;
  error:boolean=false;


    @HostListener('window:resize')
      onResize() {
        this.calculateItemsPerRow();
        this.formatCarsIntoRows();
      }
    
      private calculateItemsPerRow() {
        const containerWidth = window.innerWidth - 50; 
        const itemWidth = 200; 
        this.itemsPerRow = Math.floor(containerWidth / itemWidth) || 1;
    
        this.rowHeight=350;
      }
    
      private formatCarsIntoRows() {
        this.visibleRows = [];
        for (let i = 0; i < this.bikes.length; i += this.itemsPerRow) {
          this.visibleRows.push(this.bikes.slice(i, i + this.itemsPerRow));
        }
      }

      ngOnInit(): void {
        this.getBikes();
      }


      ngAfterViewInit(): void {
        
        const modalElement = this.removeVehicleModal.nativeElement;
    this.modalInstance = new bootstrap.Modal(modalElement);

    const modalElementSuccess = this.successModal.nativeElement;
    this.modalInstanceSuccess = new bootstrap.Modal(modalElementSuccess);
      }





      getBikes()
      {
        this.bikeService.getBikes().subscribe((data:any)=>{
          this.bikes=data;
          this.allBikes=data;

          this.calculateItemsPerRow();
          this.formatCarsIntoRows();
          this.cdr.detectChanges();
       
         this.loading=false;
      },(error)=>{
        this.error=true;
        this.loading=false;
        });
        
      }


      search(query: any) {
        this.query = query;
      
        if (!query.trim()) {
          this.bikes = [...new Set(this.allBikes)];
        } else {
          this.bikes = this.allBikes.filter(c =>
            c.manufacturer.toLowerCase().includes(query.toLowerCase()) ||
            c.bikeId.toLowerCase().includes(query.toLowerCase()) ||
            c.model.toLowerCase().includes(query.toLowerCase())
          );
        }
    
        this.calculateItemsPerRow();
        this.formatCarsIntoRows();
        this.cdr.detectChanges();
      }

      addNewVehicle(event:any)
      {
        this.bikes.push(event);
        this.calculateItemsPerRow();
        this.formatCarsIntoRows();
        this.cdr.detectChanges();
      }

  removeVehicle()
  {
    if(this.selectedId!==-1)
      {
        let bike=null;
        let index=0;
        for(let b of this.bikes){
          if(b.id===this.selectedId){
        bike=b;
        break;
        }
        index++;
      }

      this.vehicleService.deleteVehicle(bike!.id).subscribe((data)=>{
        this.loading=false;
        this.modalInstance.hide();
        this.modalInstanceSuccess.show();
        this.bikes.splice(index,1);
        this.calculateItemsPerRow();
    this.formatCarsIntoRows();
    this.cdr.detectChanges();
        this.selectedId=-1;
      },
    (error)=>{
      this.loading=false;
      alert(error);
      this.selectedId=-1;
    });


    }

  }

  showDeleteVehicleModal(id:number)
  {
    if (this.modalInstance) {
      this.selectedId=id;
      this.modalInstance.show();
    }
  }

  dismiss()
  {
    this.error=false;
  }



}
