import { test, expect } from '../../src/fixtures/base.fixture';
import { Config } from '../../config/env.config';
import { ApiAssertions } from '../../src/api/assertions/api.assertions';

test.describe('Hybrid - UI/API Action with PostgreSQL Database Validation', { tag: ['@hybrid', '@db', '@e2e'] }, () => {
  test('Place order via API and validate order record and payment directly in PostgreSQL database', async ({ authApi, cartApi, orderApi, dbValidator }) => {
    // 1. Authenticate & add product to cart via API
    const token = await authApi.loginAndGetToken(Config.users.customer.email, Config.users.customer.password);
    await cartApi.clearCart(token);
    await cartApi.addItem(token, 'robotic-vacuum-cleaner', 1);

    // 2. Place Order via API
    const orderRes = await orderApi.placeOrder(token, {
      billingAddressId: 'addr-billing-1',
      shippingAddressId: 'addr-shipping-1',
      paymentMethod: 'CARD',
      simulatedPaymentOutcome: 'SUCCESS',
    });

    const { order, payment } = await ApiAssertions.expectSuccessPayload<{ order: any; payment: any }>(orderRes);

    // 3. DB: Validate Order Record in PostgreSQL
    const dbOrder = await dbValidator.verifyOrderExists(order.orderNumber);
    expect(dbOrder.subtotal).toBe(order.subtotal);
    expect(dbOrder.total).toBe(order.total);

    // 4. DB: Validate Payment Record in PostgreSQL
    await dbValidator.verifyPaymentRecord(order.id, 'SUCCESS');
  });
});
