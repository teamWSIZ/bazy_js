export class Customer{
    customerid: number;
    customername: string;
    contactname: string;
    address: string;
    city: string;
    postalcode: string;
    country: string;

    constructor(customerid: number, customername: string, contactname: string, address: string, city: string, postalcode: string, country: string) {
        this.customerid = customerid;
        this.customername = customername;
        this.contactname = contactname;
        this.address = address;
        this.city = city;
        this.postalcode = postalcode;
        this.country = country;
    }
}