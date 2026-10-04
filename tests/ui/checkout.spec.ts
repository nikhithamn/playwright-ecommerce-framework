import { test, expect } from '../../src/fixtures/base.fixture';
import { Config } from '../../config/env.config';

test.describe('UI - Checkout & Order Placement Suite', { tag: ['@ui', '@smoke', '@e2e'] }, () => {
  test('Authenticated user can complete checkout and place an order', async ({ loginPage, catalogPage, cartPage, checkoutPage, confirmationPage }) => {
    // 1. Log in with seed customer account (has pre-configured addresses)
    await loginPage.goto();
    await loginPage.login(Config.users.customer.email, Config.users.customer.password);

    // 2. Add product to cart
    await catalogPage.goto();
    await catalogPage.clickAddToCartForProduct();

    // 3. Go to Cart & Checkout
    await cartPage.goto();
    await cartPage.proceedToCheckout();

    // 4. Select Shipping Address & Place Order
    await checkoutPage.selectShippingAddress('addr-shipping-1');
    await checkoutPage.setSimulateOutcome('SUCCESS');
    await checkoutPage.placeOrder();

    // 5. Verify Order Confirmation screen
    await expect(confirmationPage.confirmationHeading).toBeVisible();
    await expect(confirmationPage.orderNumber).toBeVisible();

    const orderNum = await confirmationPage.getOrderNumberText();
    expect(orderNum).toContain('ORD-');
  });
});
