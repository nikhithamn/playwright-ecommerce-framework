import { faker } from '@faker-js/faker';

export interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class UserFactory {
  static createRandomUser(): UserPayload {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email({ provider: 'testqa.org' }).toLowerCase(),
      password: `Pass@${faker.string.alphanumeric(8)}`,
    };
  }

  static createDeterministicCustomer(): UserPayload {
    return {
      firstName: 'Test',
      lastName: 'Customer',
      email: 'customer@test.com',
      password: 'Password123!',
    };
  }

  static createDeterministicAdmin(): UserPayload {
    return {
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@test.com',
      password: 'Admin123!',
    };
  }
}
