import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { OperatorHeaderComponent } from '../operator-header/operator-header.component';
import { DurationService } from '../services/utils/duration.service';
import { RentalsService } from '../services/rentals/rentals.service';
import { HttpClientModule } from '@angular/common/http';
import * as L from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ConstantsService } from '../services/utils/constants.service';

@Component({
  selector: 'app-rentals',
  imports: [CommonModule,OperatorHeaderComponent,HttpClientModule,LeafletModule],
  templateUrl: './rentals.component.html',
  styleUrl: './rentals.component.css',
  providers:[DurationService,RentalsService,ConstantsService]
})
export class RentalsComponent implements OnInit,AfterViewInit {

  durationService=inject(DurationService);
  rentalsService=inject(RentalsService);
  constantsService=inject(ConstantsService);

  loading:boolean=false;
  carsSelected:boolean=true;


 
  currentPageRentals = 1;
  rentalsPerPage = 6;
  totalPagesRentals = 0;
  pagesRentals: number[] = [];


  rentals:any[]=[];
  selectedType='cars';

  rentalMap: { [key: string]: any } = {};

  options: any;
  layers: L.Layer[] = [];
 

 
 private map: any;


  ngAfterViewInit(): void {
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


    if (this.map) {
      this.map.remove();  
      this.map = null;    
    }
    
    // Initialize map
    this.map = L.map('map1', {
    }).setView([this.constantsService.MAP_INITIAL_POSITION.x, this.constantsService.MAP_INITIAL_POSITION.y], this.constantsService.MAP_ZOOM);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);


  }

  private setMap()
  {
    this.map.eachLayer((layer:any) => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
  }
  selectedRowIndex=-1;
  setMapLocation(rental: any,index:number): void {
    this.selectedRowIndex = index;
    this.map.setView([rental.leftX, rental.leftY], this.constantsService.MAP_ZOOM);

    this.setMap();

     L.marker([rental.takenX, rental.takenY])
      .addTo(this.map)
      .bindPopup('Taken Location');

    L.marker([rental.leftX, rental.leftY])
      .addTo(this.map)
      .bindPopup('Left Location').openPopup();
  }



  ngOnInit(): void {
    this.loading=true;
    this.loadData();
    
  }
  
  loadData(page: number = 1,query:string='')
  {
    this.currentPageRentals = page;
    this.rentalsService.getAllRentals(page - 1, this.rentalsPerPage,query).subscribe((data:any)=>{
      this.loading=false;

      this.rentalMap=JSON.parse(JSON.stringify(data));

      this.adjustImageData('cars');
      this.adjustImageData('scooters');
      this.adjustImageData('bikes');
  
      this.rentals=this.rentalMap[this.selectedType].content;
      this.totalPagesRentals = data[this.selectedType].totalPages;
    this.pagesRentals = Array.from({ length: this.totalPagesRentals }, (_, i) => i + 1);

    },(error)=>{

      alert("Error reading data!");
      this.loading=false;
    }
    );
  }


  private adjustImageData(type:string)
  {
    let collection=this.rentalMap[type].content;

      for(let element of collection)
      {
        if(!element.client.image.startsWith('data:')){
          element.client.image='data:image/png;base64,'+element.client.image;
          }
      }
      this.rentalMap[type].content=collection;
    
  }
  

  search(event:any)
  {
    const query = event.toLowerCase();
    this.currentPageRentals=1;


    this.loadData(this.currentPageRentals, query);
  }

  changeType(event:any)
  {
    if(event==='E-Car')
    {
      this.carsSelected=true;
      this.selectedType='cars';
    }
    else if(event==='E-Bike'){
      this.carsSelected=false;
      this.selectedType='bikes';
    }
    else if(event==='E-Scooter')
    {
      this.carsSelected=false;
      this.selectedType='scooters';
    }
    this.selectedRowIndex=-1;
    this.setMap();
    this.rentals=this.rentalMap[this.selectedType].content;
  }

  calculateDuration(start: Date, end: Date): string {
   
    return this.durationService.calculateDuration(start,end);
  }


  changePageRentals(page: number) {
    if (page >= 1 && page <= this.totalPagesRentals) {
      this.loadData(page);
    }
  }

}
