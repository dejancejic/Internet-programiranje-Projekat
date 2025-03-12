import { Vehicle } from "./vehicle";

export class Car extends Vehicle {
    constructor(
        id: number,
        status: string,
        image: string,
        manufacturer: string,
        public carId: string,
        public buyDate: Date,
        public price: number,
        public description: string,
        public model: string,
        public manufacturerId: number
    ) {
        super(id, status, image, manufacturer);
    }

    
}
