import { Vehicle } from "./vehicle";

export class Car extends Vehicle {
    constructor(
        id: number,
        status: string,
        image: string,
        manufacturer: string,
        private _carId: string,
        private _rentDate: Date,
        private _price: number,
        private _description: string,
        private _model: string,
        private _manufacturerId: number
    ) {
        super(id, status, image, manufacturer);
    }

    // Getters
    public get carId(): string {
        return this._carId;
    }

    public get rentDate(): Date {
        return this._rentDate;
    }

    public get price(): number {
        return this._price;
    }

    public get description(): string {
        return this._description;
    }

    public get model(): string {
        return this._model;
    }

    public get manufacturerId(): number {
        return this._manufacturerId;
    }

    // Setters
    public set carId(carId: string) {
        this._carId = carId;
    }

    public set rentDate(rentDate: Date) {
        this._rentDate = rentDate;
    }

    public set price(price: number) {
        this._price = price;
    }

    public set description(description: string) {
        this._description = description;
    }

    public set model(model: string) {
        this._model = model;
    }

    public set manufacturerId(manufacturerId: number) {
        this._manufacturerId = manufacturerId;
    }
}
