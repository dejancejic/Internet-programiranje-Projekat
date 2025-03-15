import { AfterViewInit, Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { OperatorHeaderComponent } from "../operator-header/operator-header.component";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RentalsService } from '../services/rentals/rentals.service';
import { ConstantsService } from '../services/utils/constants.service';
import * as L from 'leaflet';
import { CarDetailsTabComponent } from "../tabs/car-details-tab/car-details-tab.component";
import { BikeDetailsTabComponent } from "../tabs/bike-details-tab/bike-details-tab.component";
import { ScooterDetailsTabComponent } from "../tabs/scooter-details-tab/scooter-details-tab.component";


declare var bootstrap:any;
@Component({
  selector: 'app-vehicle-map',
  imports: [OperatorHeaderComponent, CommonModule, HttpClientModule, CarDetailsTabComponent, BikeDetailsTabComponent, ScooterDetailsTabComponent],
  templateUrl: './vehicle-map.component.html',
  styleUrl: './vehicle-map.component.css',
  providers:[RentalsService,ConstantsService],
  encapsulation:ViewEncapsulation.None
})
export class VehicleMapComponent implements OnInit,AfterViewInit{

  rentalsService=inject(RentalsService);
  constantsService=inject(ConstantsService);

  vehicles:any[]=[];

  selectedVehicle:any;

  loading:boolean=false;

  selectedType='E-Car';

  options: any;
  layers: L.Layer[] = [];
  private map: any;

  modalInstanceVehicleInfo: any;
  @ViewChild('vehicleInfoModal') vehicleInfoModal: any;

  vehicleMap:{ [key: string]: any[] } = {};

  private adjustImageData(type:string)
  {
    let collection=this.vehicleMap[type];
      for(let element of collection)
      {
        if(!element.vehicle.image.startsWith('data:')){
          element.vehicle.image='data:image/png;base64,'+element.vehicle.image;
          }
      }
      this.vehicleMap[type]=collection;
  }
  ngOnInit(): void {
    
    this.rentalsService.getMapData().subscribe((data:any)=>{

      this.vehicleMap=data;
      this.adjustImageData('E-Car');
      this.adjustImageData('E-Bike');
      this.adjustImageData('E-Scooter');

      this.vehicles=this.vehicleMap[this.selectedType];

      this.setMap();

    },(error)=>{
      alert("Error reading data!");
    }
    );
  }

  ngAfterViewInit(): void {

    const modalElement = this.vehicleInfoModal.nativeElement;
    this.modalInstanceVehicleInfo = new bootstrap.Modal(modalElement);
    const iconUrl = './assets/marker-icon.png';
        const iconRetinaUrl = './assets/marker-icon-2x.png';
        const shadowUrl = './assets/marker-shadow.png';
    
        const defaultIcon = L.icon({
          iconUrl,
          iconRetinaUrl,
          shadowUrl,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
    
        L.Marker.prototype.options.icon = defaultIcon;
    
        // Initialize map
        this.map = L.map('map', {
        }).setView([this.constantsService.MAP_INITIAL_POSITION.x, this.constantsService.MAP_INITIAL_POSITION.y], this.constantsService.MAP_ZOOM);
    
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);

  }


   private clearMap()
    {
      this.map.eachLayer((layer:any) => {
        if (layer instanceof L.Marker) {
          this.map.removeLayer(layer);
        }
      });
    }


    setMap()
    {
      this.clearMap();
      for(let veh of this.vehicles)
      {
        this.setMapLocation(veh.x,veh.y,veh.vehicle);
      }
      
    }

    setMapLocation(x: any, y: any, vehicle:any): void {
      this.map.setView([x, y], this.constantsService.MAP_ZOOM);
    
      this.clearMap();
    
      
      const customIcon = L.divIcon({
        className: 'custom-marker', 
        html: `<div class="marker-container">
                 <img src="${vehicle.image}" class="marker-image" />
               </div>`,
        iconSize: [40, 40], 
        iconAnchor: [20, 40] 
      });
    
      const customMarker = L.marker([x, y], { icon: customIcon })
        .addTo(this.map);

        this.selectedVehicle=vehicle;

        customMarker.on('click', () => {
          this.showVehicleInfoDialog(vehicle);
        });

    }
    onImageError(event:any){
      if(this.selectedType==='E-Car'){
      event.target.src = './assets/defaultCar.png';
      }
      else if(this.selectedType==='E-Bike')
      {
        event.target.src = './assets/defaultBike.jpg';
      }
      else if(this.selectedType==='E-Scooter')
      {
        event.target.src = './assets/defaultScooter.jpg';
      }
    }

    showVehicleInfoDialog(vehicle:any)
  {
    this.modalInstanceVehicleInfo.show();
  }
    

  search(event:any)
  {
    const query = event.toLowerCase();
    if(!query.trim() || query==='')
    {
      this.vehicles=JSON.parse(JSON.stringify(this.vehicleMap[this.selectedType]));
      this.setMap();
      return;
    }
    if(this.selectedType==='E-Car'){
    this.vehicles=this.vehicleMap[this.selectedType].filter(model=>model.vehicle.carId.toString().toLowerCase().includes(query));
    }
    else if(this.selectedType==='E-Bike')
    {
      this.vehicles=this.vehicleMap[this.selectedType].filter(model=>model.vehicle.bikeId.toString().toLowerCase().includes(query));
    }
    else if(this.selectedType==='E-Scooter'){
      this.vehicles=this.vehicleMap[this.selectedType].filter(model=>model.vehicle.scooterId.toString().toLowerCase().includes(query));
    }
    this.setMap();
  }

  changeType(event:any)
  {
    this.selectedType=event;
    this.vehicles=this.vehicleMap[this.selectedType];
    this.setMap();
  }
}
