export class FakeUser {
    firstName: string;
    lastName: string;
    city: string;
    address: string;
    image: string;

    constructor(firstName: string, lastName: string, city: string, address: string, image: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.city = city;
        this.address = address;
        this.image = image;
    }
}