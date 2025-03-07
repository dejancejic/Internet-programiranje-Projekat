export class Manufacturer {
    constructor(
      private _id: number,
      private _name: string,
      private _country: string,
      private _address: string,
      private _phone: string,
      private _fax: string | null,
      private _email: string
    ) {}
  
    
    get id(): number {
      return this._id;
    }
    set id(value: number) {
      this._id = value;
    }
  
    get name(): string {
      return this._name;
    }
    set name(value: string) {
      this._name = value;
    }
  

    get country(): string {
      return this._country;
    }
    set country(value: string) {
      this._country = value;
    }

    get address(): string {
      return this._address;
    }
    set address(value: string) {
      this._address = value;
    }
  
    get phone(): string {
      return this._phone;
    }
    set phone(value: string) {
      this._phone = value;
    }
  
    get fax(): string | null {
      return this._fax;
    }
    set fax(value: string | null) {
      this._fax = value;
    }
  
    get email(): string {
      return this._email;
    }
    set email(value: string) {
      this._email = value;
    }
  }
  