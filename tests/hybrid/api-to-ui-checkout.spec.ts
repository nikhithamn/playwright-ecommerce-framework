import { test, expect } from '../../src/fixtures/base.fixture';
import { UserFactory } from '../../src/factories/user.factory';
import { ApiAssertions } from '../../src/api/assertions/api.assertions';

test.describe('Hybrid - API Setup to UI Checkout Flow', { tag: ['@hybrid', '@e2e'] }, () => {
  test('Create user and cart items via API, then complete checkout on UI', async ({ authApi, cartApi, loginPage, cartPage, checkoutPage, confirmationPage }) => {
    // 1. API: Register a brand new user
    const newUser = UserFactory.createRandomUser();
    const regRes = await authApi.register(newUser);
    const { token } = await ApiAssertions.expectSuccessPayload<{ token: string }>(regRes);

    // 2. API: Add product to cart via API
    const addRes = await cartApi.addItem(token, 'classic-denim-jacket', 1);
    await ApiAssertions.expectSuccessPayload(addRes);

    // 3. UI: Log in with the newly registered API user
    await loginPage.goto();
    await loginPage.login(newUser.email, newUser.password);

    // 4. UI: Verify Cart Page has the item populated via API
    await cartPage.goto();
    await expect(cartPage.subtotalAmount).toBeVisible();

    // 5. UI: Proceed to Checkout & complete order
    await cartPage.proceedToCheckout();
    await checkoutPage.setSimulateOutcome('SUCCESS');
    await checkoutPage.placeOrder();

    // 6. UI: Assert Order Confirmation
    await expect(confirmationPage.confirmationHeading).toBeVisible();
    const orderNum = await confirmationPage.getOrderNumberText();
    expect(orderNum).toContain('ORD-');
  });
});
