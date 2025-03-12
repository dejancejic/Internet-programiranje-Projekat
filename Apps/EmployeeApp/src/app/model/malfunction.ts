export class Malfunction
{
    constructor(
        public id:number,
        public description:string,
        public dateTime:Date,
        public vehicleId:number
    ){}
}