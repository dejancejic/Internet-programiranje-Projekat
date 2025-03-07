export class Vehicle {
    constructor(
        private _id: number,
        private _status: string,
        private _image: string,
        private _manufacturer: string
    ) {}

    // Getter and Setter for id
    public get id(): number {
        return this._id;
    }

    public set id(id: number) {
        this._id = id;
    }

    // Getter and Setter for status
    public get status(): string {
        return this._status;
    }

    public set status(status: string) {
        this._status = status;
    }

    // Getter and Setter for image
    public get image(): string {
        return this._image;
    }

    public set image(image: string) {
        this._image = image;
    }

    // Getter and Setter for manufacturer
    public get manufacturer(): string {
        return this._manufacturer;
    }

    public set manufacturer(manufacturer: string) {
        this._manufacturer = manufacturer;
    }
}
