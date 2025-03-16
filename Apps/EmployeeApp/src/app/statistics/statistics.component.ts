import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { StatisticsService } from '../services/statistics/statistics.service';

@Component({
  selector: 'app-statistics',
  imports: [CommonModule,NgxChartsModule,HttpClientModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
  providers:[StatisticsService]
})
export class StatisticsComponent implements OnInit,AfterViewInit{

  constructor(private statisticsService: StatisticsService) {}

  selectedMonth:string='1';
  

  revenuePerDay1 = [
    { name: '01', value: 1500 },
    { name: '02', value: 2200 },
    { name: '03', value: 1800 },
    { name: '04', value: 2500 },
    { name: '05', value: 3000 }
  ];

  revenuePerType = [
    
  ];

  revenuePerMonth:{[key: string]: any[] } = {};

  revenuePerDay=[
    { name: '1', value: 0 },
  ];

  groupedBarChartData = [
    {
      name: 'E-Car',
      series: [
       
      ]
    },
    {
      name: 'E-Bike',
      series: [
       
      ]
    },
    {
      name: 'E-Scooter',
      series: [
        
      ]
    }
  ];
  




  colorScheme ='natural';
  colorSchemeFlame ='flame';
  colorSchemeVivid ='vivid';

  view: [number, number] = [620, 300];



  ngOnInit(): void {
    //this.initialize();
    
  }
  ngAfterViewInit(): void {
    this.initialize();
  }

  private initialize()
  {
    this.statisticsService.getMonthRevenueStatistics().subscribe((data:any)=>{
      this.revenuePerMonth=data;
      this.revenuePerDay=this.revenuePerMonth['1'];

    },(error)=>{
      alert("Error reading data!");
    });

    this.statisticsService.getVehicleRevenueStatistics().subscribe((data:any)=>{

      this.revenuePerType = data;

    },(error)=>{
      alert("Error reading data!");
    });

    this.statisticsService.getTotalMalfunctionsPerVehicleStatistics().subscribe((data:any)=>{

      this.groupedBarChartData=data;
      
    },(error)=>{
      alert("Error reading data!");
    });
    
   
  }


  selectMonth(event:any)
  {
    let select=document.getElementById("monthInput") as HTMLSelectElement;

    this.selectedMonth=select.value;
    this.revenuePerDay=this.revenuePerMonth[this.selectedMonth];
  }
}
