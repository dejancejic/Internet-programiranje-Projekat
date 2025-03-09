import { Vehicle } from "./vehicle";

export class Scooter extends Vehicle
{

    constructor(
        id: number,
        status: string,
        image: string,
        manufacturer: string,
        public scooterId:string,
        public price:number,
        public speed:number,
        public model: string,
        public manufacturerId: number
    )
    {
        super(id,status,image,manufacturer);
    }

}