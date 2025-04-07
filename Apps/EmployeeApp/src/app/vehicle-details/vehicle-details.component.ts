import { CommonModule, Location } from '@angular/common';
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
import { MalfunctionTableComponent } from "../tables/malfunction-table/malfunction-table.component";
import { NavAdminComponent } from '../navbars/nav-admin/nav-admin.component';
import { NavManagerComponent } from '../navbars/nav-manager/nav-manager.component';
import { ConstantsService } from '../services/utils/constants.service';

declare var bootstrap:any;

@Component({
  selector: 'app-vehicle-details',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule, CarDetailsTabComponent, BikeDetailsTabComponent, ScooterDetailsTabComponent, MalfunctionTableComponent],
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

  rentals:any[]=[];


  currentPageRentals = 1;
  rentalsPerPage = inject(ConstantsService).PAGINATION_NUMBER;
  totalPagesRentals = 0;
  pagesRentals: number[] = [];



  @ViewChild('malfunctionsTable') malfunctionsTable: any; 



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
  constructor(private location: Location) {
    this.location.subscribe(() => {
      NavAdminComponent.showInfoTab=false;
      NavManagerComponent.showInfoTab=false;
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
    
    setTimeout(()=>{
      this.malfunctionsTable.setMalfunctions(this.vehicle);
    },200);
    
  
    
  }


  initialize()
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


    this.loadData();
  }

  loadData(page: number = 1,query:string='')
  {
    this.currentPageRentals = page;
    this.vehicleService.getVehicleRents(this.vehicleId, page - 1, this.rentalsPerPage,query).subscribe((data:any)=>{
      this.rentals = data.content;
  for(let rental of this.rentals)
    {
      if(!rental.client.image.startsWith('data:')){
        rental.client.image='data:image/png;base64,'+rental.client.image;
        }
    }
    this.totalPagesRentals = data.totalPages;
    this.pagesRentals = Array.from({ length: this.totalPagesRentals }, (_, i) => i + 1);
      
      this.loading=false;
    },(error)=>{
      this.loading=false;
      this.error=true;
    }
    );

  }


  changePageRentals(page: number) {
    if (page >= 1 && page <= this.totalPagesRentals) {
      this.loadData(page);
    }
  }

  



  searchRentals(event:any)
  {
    const query = event.target.value.toLowerCase();
    this.currentPageRentals=1;


    this.loadData(this.currentPageRentals, query);
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
