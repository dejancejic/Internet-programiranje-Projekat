import { Injectable } from '@angular/core';
import { Car } from '../../model/car';
import { Bike } from '../../model/bike';
import { Scooter } from '../../model/scooter';

@Injectable({
  providedIn: 'root'
})
export class CSVserviceService {

  constructor() { }

  verifyCSV(file: any,fileInput:any): Promise<Car | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = async (event) => {
        const csvContent = event.target?.result as string;
        const lines = csvContent.split("\n").map(line => line.trim()); 
  
        if (lines.length < 2) {
        
          resolve(null);
          return;
        }
  
        
        const headers = lines[0].split(",").map(header => header.trim());
  
        const carDataIndex = {
          status: headers.indexOf("status"),
          carId: headers.indexOf("carId"),
          price: headers.indexOf("price"),
          description: headers.indexOf("description"),
          model: headers.indexOf("model"),
          manufacturerId: headers.indexOf("manufacturerId")
        };
  
        if (Object.values(carDataIndex).includes(-1)) {
  
          resolve(null);
          return;
        }
  
      
        const dataRow = lines[1]?.split(",").map(value => value.trim());
        if (!dataRow || dataRow.length < Object.keys(carDataIndex).length) {
  
          resolve(null);
          return;
        }
  
        let car: Car = new Car(null!, dataRow[carDataIndex.status],'','',dataRow[carDataIndex.carId],null!,
          parseFloat(dataRow[carDataIndex.price]),
          dataRow[carDataIndex.description],
          dataRow[carDataIndex.model],parseInt(dataRow[carDataIndex.manufacturerId]),
          
        );
        resolve(car);
      };
  
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }
  

  verifyCSVBike(file: any,fileInput:any): Promise<Bike | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = async (event) => {
        const csvContent = event.target?.result as string;
        const lines = csvContent.split("\n").map(line => line.trim()); 
  
        if (lines.length < 2) {
        
          resolve(null);
          return;
        }
  
        
        const headers = lines[0].split(",").map(header => header.trim());
  
        const bikeDataIndex = {
          status: headers.indexOf("status"),
          bikeId: headers.indexOf("bikeId"),
          price: headers.indexOf("price"),
          range: headers.indexOf("range"),
          model: headers.indexOf("model"),
          manufacturerId: headers.indexOf("manufacturerId")
        };
  
        if (Object.values(bikeDataIndex).includes(-1)) {
  
          resolve(null);
          return;
        }
  
      
        const dataRow = lines[1]?.split(",").map(value => value.trim());
        if (!dataRow || dataRow.length < Object.keys(bikeDataIndex).length) {
  
          resolve(null);
          return;
        }
  
        let bike: Bike = new Bike(null!, dataRow[bikeDataIndex.status],'','',dataRow[bikeDataIndex.bikeId],
          parseFloat(dataRow[bikeDataIndex.price]),
          dataRow[bikeDataIndex.range],
          dataRow[bikeDataIndex.model],parseInt(dataRow[bikeDataIndex.manufacturerId]),
          
        );
        resolve(bike);
      };
  
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }


  verifyCSVScooter(file: any,fileInput:any): Promise<Scooter | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = async (event) => {
        const csvContent = event.target?.result as string;
        const lines = csvContent.split("\n").map(line => line.trim()); 
  
        if (lines.length < 2) {
        
          resolve(null);
          return;
        }
  
        
        const headers = lines[0].split(",").map(header => header.trim());
  
        const scooterDataIndex = {
          status: headers.indexOf("status"),
          scooterId: headers.indexOf("scooterId"),
          price: headers.indexOf("price"),
          speed: headers.indexOf("speed"),
          model: headers.indexOf("model"),
          manufacturerId: headers.indexOf("manufacturerId")
        };
  
        if (Object.values(scooterDataIndex).includes(-1)) {
  
          resolve(null);
          return;
        }
  
      
        const dataRow = lines[1]?.split(",").map(value => value.trim());
        if (!dataRow || dataRow.length < Object.keys(scooterDataIndex).length) {
  
          resolve(null);
          return;
        }
  
        let scooter: Scooter = new Scooter(null!, dataRow[scooterDataIndex.status],'','',dataRow[scooterDataIndex.scooterId],
          parseFloat(dataRow[scooterDataIndex.price]),
          parseInt(dataRow[scooterDataIndex.speed]),
          dataRow[scooterDataIndex.model],parseInt(dataRow[scooterDataIndex.manufacturerId]),
          
        );
        resolve(scooter);
      };
  
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  
  

}
