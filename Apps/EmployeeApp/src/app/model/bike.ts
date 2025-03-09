import { Vehicle } from "./vehicle";

export class Bike extends Vehicle
{

    constructor(
        id: number,
        status: string,
        image: string,
        manufacturer: string,
        public bikeId:string,
        public price:number,
        public range:string,
        public model: string,
        public manufacturerId: number
    )
    {
        super(id,status,image,manufacturer);
    }

}