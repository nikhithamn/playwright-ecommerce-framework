import { test, expect } from '../../src/fixtures/base.fixture';
import { Config } from '../../config/env.config';

test.describe('UI - Shopping Cart Suite', { tag: ['@ui', '@regression'] }, () => {
  test('User can add a product to cart and apply a promo coupon', async ({ loginPage, catalogPage, cartPage }) => {
    // 1. Log in first
    await loginPage.goto();
    await loginPage.login(Config.users.customer.email, Config.users.customer.password);

    // 2. Add product > $50 minimum order value for SAVE10 coupon
    await catalogPage.goto();
    await catalogPage.clickAddToCartForProduct('wireless-noise-canceling-headphones');

    // 3. Open Cart Page & Apply Coupon SAVE10
    await cartPage.goto();
    await expect(cartPage.subtotalAmount).toBeVisible();

    await cartPage.applyCoupon('SAVE10');
    await expect(cartPage.removeCouponBtn).toBeVisible();
    await expect(cartPage.discountAmount).toBeVisible();
  });

  test('User sees error message when applying an expired coupon code', async ({ loginPage, cartPage, catalogPage }) => {
    // 1. Log in first
    await loginPage.goto();
    await loginPage.login(Config.users.customer.email, Config.users.customer.password);

    // 2. Add product to cart
    await catalogPage.goto();
    await catalogPage.clickAddToCartForProduct('wireless-noise-canceling-headphones');

    // 3. Open Cart & apply expired coupon
    await cartPage.goto();
    await cartPage.applyCoupon('EXPIRED2023');

    await expect(cartPage.couponError).toBeVisible();
    await expect(cartPage.couponError).toContainText('expired');
  });
});
