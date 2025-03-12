import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleService } from '../services/vehicles/vehicle.service';
import { Vehicle } from '../model/vehicle';
import { Car } from '../model/car';
import { Bike } from '../model/bike';
import { Scooter } from '../model/scooter';
import { ActivatedRoute, Router } from '@angular/router';
import { CarDetailsTabComponent } from "../tabs/car-details-tab/car-details-tab.component";
import { BikeDetailsTabComponent } from "../tabs/bike-details-tab/bike-details-tab.component";
import { ScooterDetailsTabComponent } from "../tabs/scooter-details-tab/scooter-details-tab.component";
import { DurationService } from '../services/utils/duration.service';
import { Malfunction } from '../model/malfunction';
import { futureDateValidator } from '../services/validators/dateValidator';

declare var bootstrap:any;

@Component({
  selector: 'app-vehicle-details',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule, CarDetailsTabComponent, BikeDetailsTabComponent, ScooterDetailsTabComponent],
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.css',
  providers:[VehicleService,DurationService]
})
export class VehicleDetailsComponent implements OnInit,AfterViewInit{


  router:Router=inject(Router);
  vehicleService=inject(VehicleService);
  durationService=inject(DurationService);


  vehicleType='';
  vehicle:any=null!;
  error:boolean=false;
  add:boolean=false;
  networkError:boolean=false;

  loading:boolean=false;

  malfunctions:Malfunction[]=[];
  rentals:any[]=[];
  malfunctionsAll:Malfunction[]=[];
  rentalsAll:any[]=[];

  paginatedMalfunctions: any[] = [];
  currentPageMalfunctions = 1;
  malfunctionsPerPage = 6;
  totalPagesMalfunctions = 0;
  pagesMalfunctions: number[] = [];


  paginatedRentals: any[] = [];
  currentPageRentals = 1;
  rentalsPerPage = 6;
  totalPagesRentals = 0;
  pagesRentals: number[] = [];

  selectedMalfunction:Malfunction|null=null;


  modalInstance: any;
  @ViewChild('addMalfunctionModal') addMalfunctionModal: any; 
  modalInstanceRemove: any;
  @ViewChild('removeMalfunctionModal') removeMalfunctionModal: any; 
  modalInstanceSuccess: any;
  @ViewChild('successModal') successModal: any; 


  formBuilder=inject(FormBuilder);
  selectedForm:FormGroup=this.formBuilder.group({
    id:[null],
    description:[null,Validators.required],
    dateTime:[null,[Validators.required, futureDateValidator()]],
    vehicleId:[null]
  });


  vehicleId=0;

  calculateDuration(start: Date, end: Date): string {
   
    return this.durationService.calculateDuration(start,end);
  }
  

  route=inject(ActivatedRoute);


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.vehicleType = params['type'];
      this.vehicleId=parseInt(params['id']);
      this.initialize();
    });
  }

  onImageError(event:any){
    if(this.vehicleType==='scooter'){
    event.target.src = './assets/defaultScooter.jpg';
    }
    else if(this.vehicleType==='bike')
    {
      event.target.src = './assets/defaultBike.jpg';
    }
    else if(this.vehicleType==='car')
    {
      event.target.src = './assets/defaultCar.png';
    }
  }

  ngAfterViewInit(): void {
    const modalElement = this.addMalfunctionModal.nativeElement;
    this.modalInstance = new bootstrap.Modal(modalElement);

    const modalElementRemove = this.removeMalfunctionModal.nativeElement;
    this.modalInstanceRemove = new bootstrap.Modal(modalElementRemove);

    const modalElementSuccess = this.successModal.nativeElement;
    this.modalInstanceSuccess = new bootstrap.Modal(modalElementSuccess);
  }


  async initialize()
  {
    this.loading=true;
    this.vehicleService.getVehicleById(this.vehicleId).subscribe((data:any)=>{
      this.vehicle=data;
      if(!this.vehicle.image.startsWith('data:')){
        this.vehicle.image='data:image/png;base64,'+this.vehicle.image;

        this.loading=false;
        }
    },(error)=>{
      this.loading=false;
      this.error=true;
    }
    );

    this.loading=true;

    this.vehicleService.getVehicleMalfunctions(this.vehicleId).subscribe((data:any)=>{
      this.malfunctionsAll = JSON.parse(JSON.stringify(data));
  this.malfunctions = JSON.parse(JSON.stringify(data));
      
      this.updatePaginationMalfunctions();
      this.loading=false;
    },(error)=>{
      this.loading=false;
      this.error=true;
    }
    );


    this.loading=true;

    this.vehicleService.getVehicleRents(this.vehicleId).subscribe((data:any)=>{
      this.rentalsAll = JSON.parse(JSON.stringify(data));
  this.rentals = JSON.parse(JSON.stringify(data));
      
      this.updatePaginationRentals();
      this.loading=false;
    },(error)=>{
      this.loading=false;
      this.error=true;
    }
    );


  }

  updatePaginationMalfunctions()
  {
    const collection = this.malfunctions;
    this.totalPagesMalfunctions = Math.ceil(collection.length / this.malfunctionsPerPage);
    this.pagesMalfunctions = Array.from({ length: this.totalPagesMalfunctions }, (_, i) => i + 1);
    this.paginatedMalfunctions = collection.slice(
      (this.currentPageMalfunctions - 1) * this.malfunctionsPerPage,
      this.currentPageMalfunctions * this.malfunctionsPerPage
    );
  }
  updatePaginationRentals()
  {
    const collection = this.rentals;
    this.totalPagesRentals = Math.ceil(collection.length / this.rentalsPerPage);
    this.pagesRentals = Array.from({ length: this.totalPagesRentals }, (_, i) => i + 1);
    this.paginatedRentals = collection.slice(
      (this.currentPageRentals - 1) * this.rentalsPerPage,
      this.currentPageRentals * this.rentalsPerPage
    );
  }
  changePageRentals(page: number) {
    if (page >= 1 && page <= this.totalPagesRentals) {
      this.currentPageRentals = page;
      this.updatePaginationRentals();
    }
  }

  changePageMalfunctions(page: number) {
    if (page >= 1 && page <= this.totalPagesMalfunctions) {
      this.currentPageMalfunctions = page;
      this.updatePaginationMalfunctions();
    }
  }


  deleteMalfunction(malfunction:Malfunction)
  {
      this.selectedMalfunction=malfunction;
    this.add=false;
    this.modalInstanceRemove.show();
  }


  selectedDescription: string | null = null;
  tooltipPosition = { top: 0, left: 0 };

  showDescription(event: MouseEvent, description: string) {
    this.selectedDescription = description;
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    
    this.tooltipPosition = {
      top: rect.top + window.scrollY + rect.height / 2,
      left: rect.left + window.scrollX + rect.width + 10
    };
  }

  hideDescription() {
    this.selectedDescription = null;
  }


  searchRentals(event:any)
  {
    const query = event.target.value.toLowerCase();

    if(!query.trim() || query==='')
    {
      this.rentals=JSON.parse(JSON.stringify(this.rentalsAll));
      this.updatePaginationRentals();
      return;
    }
    this.rentals=this.rentalsAll.filter(r=>r.clientName.toString().toLowerCase().includes(query)||
    r.dateTime.toString().toLowerCase().includes(query) );
    this.updatePaginationRentals();
  }

  searchMalfunctions(event:any)
  {
    const query = event.target.value.toLowerCase();

    if(!query.trim() || query==='')
    {
      this.malfunctions = JSON.parse(JSON.stringify(this.malfunctionsAll));
      this.updatePaginationMalfunctions();
      return;
    }
    this.malfunctions=this.malfunctionsAll.filter(m=>m.dateTime.toString().toLowerCase().includes(query));
    this.updatePaginationMalfunctions();
  }

  addMalfunctionToSystem()
  {
    let mal=this.selectedForm.value as Malfunction;
    mal.vehicleId=this.vehicle.id;
     this.vehicleService.addMalfunction(mal).subscribe((data:any)=>{

      this.malfunctionsAll.push(data);
      this.malfunctions.push(data);
      this.vehicle.status='broken';
      this.closeModal();
    this.modalInstance.hide();
    this.modalInstanceSuccess.show();
      this.updatePaginationMalfunctions();
     },
    (error)=>{
      
      this.networkError=true;
    });
  }


  removeMalfunctionToSystem()
  {
    if(this.selectedMalfunction!==null)
    {
        this.vehicleService.deleteMalfunction(this.selectedMalfunction!.id).subscribe((data)=>{

          let index=this.malfunctionsAll.indexOf(this.selectedMalfunction!);
          this.malfunctionsAll.splice(index,1);
          index=this.malfunctionsAll.indexOf(this.selectedMalfunction!);
          this.malfunctions.splice(index,1);
          this.modalInstanceRemove.hide();
          this.modalInstanceSuccess.show();
          if(this.malfunctionsAll.length==0)
          {
            this.vehicle.status='free';
          }
          this.updatePaginationMalfunctions();
        },(error)=>{
          this.networkError=true;
        });
    }
  }

  closeModalRemove()
  {
    this.closeModal();
    this.modalInstanceRemove.hide();
  }

  dismiss() {
    this.networkError = false;
  }

  selectAdd()
  {
    this.add=true;
  }

  closeModal()
  {
    this.selectedForm.reset();
    this.networkError=false;
  }

}
