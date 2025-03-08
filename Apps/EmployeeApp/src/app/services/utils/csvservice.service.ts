import { Injectable } from '@angular/core';
import { Car } from '../../model/car';

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
  

  
  

}
