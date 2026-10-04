import { test, expect } from '../../src/fixtures/base.fixture';
import { Config } from '../../config/env.config';

test.describe('UI - Authentication Suite', { tag: ['@ui', '@smoke'] }, () => {
  test('User can log in successfully using valid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(Config.users.customer.email, Config.users.customer.password);

    // Verify user greeting in header
    await expect(loginPage.header.loginBtn).not.toBeVisible();
    await expect(loginPage.page.getByTestId('user-greeting')).toBeVisible();
  });

  test('User sees error message when logging in with invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('invalid-user@test.com', 'WrongPassword123!');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid email address or password');
  });

  test('User can use quick-fill customer credentials helper', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.clickAutoFillCustomer();

    await expect(loginPage.emailInput).toHaveValue(Config.users.customer.email);
    await expect(loginPage.passwordInput).toHaveValue(Config.users.customer.password);
  });
});
