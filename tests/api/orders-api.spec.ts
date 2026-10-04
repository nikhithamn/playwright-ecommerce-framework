import { test, expect } from '../../src/fixtures/base.fixture';
import { Config } from '../../config/env.config';
import { ApiAssertions } from '../../src/api/assertions/api.assertions';

test.describe('API - Orders Suite', { tag: ['@api', '@regression'] }, () => {
  test('POST /api/orders returns 402 PAYMENT_DECLINED when payment fails', async ({ authApi, cartApi, orderApi }) => {
    // 1. Authenticate
    const token = await authApi.loginAndGetToken(Config.users.customer.email, Config.users.customer.password);

    // 2. Add item to cart
    await cartApi.addItem(token, 'ergonomic-wireless-mouse', 1);

    // 3. Place order with simulated payment outcome = FAILED
    const response = await orderApi.placeOrder(token, {
      billingAddressId: 'addr-billing-1',
      shippingAddressId: 'addr-shipping-1',
      paymentMethod: 'CARD',
      simulatedPaymentOutcome: 'FAILED',
    });

    await ApiAssertions.expectErrorCode(response, 'PAYMENT_DECLINED', 402);
  });
});
