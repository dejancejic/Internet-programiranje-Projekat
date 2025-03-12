import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
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
  networkError:boolean=false;

  loading:boolean=false;

  malfunctions:any[]=[];
  rentals:any[]=[];
  malfunctionsAll:any[]=[];
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


  formBuilder=inject(FormBuilder);
  selectedForm:FormGroup=this.formBuilder.group({
    id:[null],
    description:[null,Validators.required],
    dateTime:[null,Validators.required]
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

    this.rentals.push({
      id:0,
      dateTime:'2025-01-01',
      duration:'2025-02-01 11:15',
      clientName:'Dejan Cejic'

    });
    this.rentalsAll.push(this.rentals[0]);

    this.malfunctions.push({
      id:0,
      dateTime:'2025-01-01 11:00',
      description:'Description sdasdj l;adjlasj ldads jldsjla djklasdl jdsjakldsj'

    });
    this.malfunctionsAll.push(this.malfunctions[0])

    this.updatePaginationMalfunctions();
    this.updatePaginationRentals();
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


  deleteMalfunction(malfunction:any)
  {

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
      this.rentals=this.rentalsAll;
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
      this.malfunctions=this.malfunctionsAll;
      this.updatePaginationMalfunctions();
      return;
    }
    this.malfunctions=this.malfunctionsAll.filter(m=>m.dateTime.toString().toLowerCase().includes(query));
    this.updatePaginationMalfunctions();
  }

  addMalfunctionToSystem()
  {

  }
  dismiss() {
    this.networkError = false;
  }

  closeModal()
  {
    this.selectedForm.reset();
  }

}
