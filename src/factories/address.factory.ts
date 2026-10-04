import { faker } from '@faker-js/faker';

export interface AddressPayload {
  type: 'SHIPPING' | 'BILLING';
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export class AddressFactory {
  static createRandomAddress(type: 'SHIPPING' | 'BILLING' = 'SHIPPING'): AddressPayload {
    return {
      type,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      addressLine1: faker.location.streetAddress(),
      addressLine2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      postalCode: faker.location.zipCode('#####'),
      country: 'USA',
      phone: faker.phone.number('+1 555-###-####'),
      isDefault: true,
    };
  }
}
