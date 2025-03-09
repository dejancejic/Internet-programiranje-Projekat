import { AfterViewInit, ChangeDetectorRef, Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { VehicleService } from '../services/vehicles/vehicle.service';
import { ScootersService } from '../services/scooters/scooters.service';
import { Scooter } from '../model/scooter';
import { ScooterTabComponent } from "../tabs/scooter-tab/scooter-tab.component";

declare var bootstrap: any;
@Component({
  selector: 'app-scooters',
  imports: [HeaderComponent, HttpClientModule, CommonModule, CdkVirtualScrollViewport, ScrollingModule, ScooterTabComponent],
  templateUrl: './scooters.component.html',
  styleUrl: './scooters.component.css',
  providers:[VehicleService,ScootersService]
})
export class ScootersComponent implements OnInit,AfterViewInit{

    scooters:Scooter[]=[];
    allScooters:Scooter[]=[];
  
    query:string='';
  
    vehicleService=inject(VehicleService);
  
    scootersService=inject(ScootersService);


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
            for (let i = 0; i < this.scooters.length; i += this.itemsPerRow) {
              this.visibleRows.push(this.scooters.slice(i, i + this.itemsPerRow));
            }
          }
    
          ngOnInit(): void {
            this.getScooters();
          }

          ngAfterViewInit(): void {
        
            const modalElement = this.removeVehicleModal.nativeElement;
        this.modalInstance = new bootstrap.Modal(modalElement);
    
        const modalElementSuccess = this.successModal.nativeElement;
        this.modalInstanceSuccess = new bootstrap.Modal(modalElementSuccess);
          }



        getScooters()
      {
        this.scootersService.getScooters().subscribe((data:any)=>{
          this.scooters=data;
          this.allScooters=data;
          

          this.calculateItemsPerRow();
          this.formatCarsIntoRows();
          this.cdr.detectChanges();
       
         this.loading=false;
      },(error)=>{
        alert(error);
        this.loading=false;
        });
        
      }

      search(query: any) {
        this.query = query;
      
        if (!query.trim()) {
          this.scooters = [...new Set(this.allScooters)];
        } else {
          this.scooters = this.allScooters.filter(c =>
            c.manufacturer.toLowerCase().includes(query.toLowerCase()) ||
            c.scooterId.toLowerCase().includes(query.toLowerCase()) ||
            c.model.toLowerCase().includes(query.toLowerCase())
          );
        }
    
        this.calculateItemsPerRow();
        this.formatCarsIntoRows();
        this.cdr.detectChanges();
      }

      addNewVehicle(event:any)
      {
        this.scooters.push(event);
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
            for(let b of this.scooters){
              if(b.id===this.selectedId){
            bike=b;
            break;
            }
            index++;
          }
          this.loading=true;
          this.vehicleService.deleteVehicle(bike!.id).subscribe((data)=>{
            this.loading=false;
            this.modalInstance.hide();
            this.modalInstanceSuccess.show();
            this.scooters.splice(index,1);
            this.calculateItemsPerRow();
        this.formatCarsIntoRows();
        this.cdr.detectChanges();
            this.selectedId=-1;
          },
        (error)=>{
          this.loading=false;
          this.error=true;
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
