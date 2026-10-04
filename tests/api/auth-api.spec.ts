import { test, expect } from '../../src/fixtures/base.fixture';
import { Config } from '../../config/env.config';
import { ApiAssertions } from '../../src/api/assertions/api.assertions';
import { UserFactory } from '../../src/factories/user.factory';

test.describe('API - Authentication Suite', { tag: ['@api', '@smoke'] }, () => {
  test('POST /api/auth/login returns JWT access token for valid credentials', async ({ authApi }) => {
    const response = await authApi.login(Config.users.customer.email, Config.users.customer.password);
    const data = await ApiAssertions.expectSuccessPayload<{ token: string; user: any }>(response);

    expect(data.token).toBeDefined();
    expect(data.user.email).toBe(Config.users.customer.email);
  });

  test('POST /api/auth/login returns 401 INVALID_CREDENTIALS for wrong password', async ({ authApi }) => {
    const response = await authApi.login(Config.users.customer.email, 'WrongPass999!');
    await ApiAssertions.expectErrorCode(response, 'INVALID_CREDENTIALS', 401);
  });

  test('POST /api/auth/register creates a new user account dynamically', async ({ authApi }) => {
    const newUser = UserFactory.createRandomUser();
    const response = await authApi.register(newUser);
    const data = await ApiAssertions.expectSuccessPayload<{ token: string; user: any }>(response);

    expect(data.user.email).toBe(newUser.email);
    expect(data.user.firstName).toBe(newUser.firstName);
  });
});
