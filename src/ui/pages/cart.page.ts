import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';

export class CartPage extends BasePage {
  readonly header: HeaderComponent;
  readonly couponInput: Locator;
  readonly applyCouponBtn: Locator;
  readonly removeCouponBtn: Locator;
  readonly couponError: Locator;
  readonly couponSuccess: Locator;
  readonly subtotalAmount: Locator;
  readonly discountAmount: Locator;
  readonly shippingAmount: Locator;
  readonly taxAmount: Locator;
  readonly totalAmount: Locator;
  readonly proceedToCheckoutBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.couponInput = page.getByTestId('coupon-input');
    this.applyCouponBtn = page.getByTestId('apply-coupon-btn');
    this.removeCouponBtn = page.getByTestId('remove-coupon-btn');
    this.couponError = page.getByTestId('coupon-error');
    this.couponSuccess = page.getByTestId('coupon-success');
    this.subtotalAmount = page.getByTestId('subtotal-amount');
    this.discountAmount = page.getByTestId('discount-amount');
    this.shippingAmount = page.getByTestId('shipping-amount');
    this.taxAmount = page.getByTestId('tax-amount');
    this.totalAmount = page.getByTestId('total-amount');
    this.proceedToCheckoutBtn = page.getByTestId('proceed-to-checkout-btn');
  }

  async goto(): Promise<void> {
    const navCartBtn = this.page.getByTestId('nav-cart-btn');
    if (await navCartBtn.isVisible()) {
      await navCartBtn.click();
    } else {
      await this.navigateTo('/cart');
    }
    await this.page.getByTestId('cart-page').waitFor({ state: 'visible', timeout: 15000 });
  }

  async applyCoupon(code: string): Promise<void> {
    // If a coupon is already applied, remove it first
    if (await this.removeCouponBtn.isVisible()) {
      await this.click(this.removeCouponBtn, 'Remove Existing Coupon Button');
    }
    await this.fill(this.couponInput, code, 'Coupon Code Input');
    await expect(this.couponInput).toHaveValue(code);
    await this.click(this.applyCouponBtn, 'Apply Coupon Button');
    await this.page.waitForResponse((resp) => resp.url().includes('/coupons/validate')).catch(() => {});
  }

  async proceedToCheckout(): Promise<void> {
    // Ensure React user session is active before proceeding to checkout
    await this.page.getByTestId('user-greeting').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    await this.click(this.proceedToCheckoutBtn, 'Proceed to Checkout Button');
    await this.page.getByTestId('checkout-page').waitFor({ state: 'visible', timeout: 15000 });
  }

  async removeItem(itemId: string): Promise<void> {
    const removeBtn = this.page.getByTestId(`remove-item-${itemId}`);
    await this.click(removeBtn, `Remove item '${itemId}' from cart`);
  }
}
