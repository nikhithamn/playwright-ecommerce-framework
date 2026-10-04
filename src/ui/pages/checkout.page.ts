import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';

export class CheckoutPage extends BasePage {
  readonly header: HeaderComponent;
  readonly sameAsShippingCheckbox: Locator;
  readonly paymentCardRadio: Locator;
  readonly paymentUpiRadio: Locator;
  readonly paymentNetBankingRadio: Locator;
  readonly simulateSuccessRadio: Locator;
  readonly simulateFailureRadio: Locator;
  readonly placeOrderBtn: Locator;
  readonly checkoutErrorAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.sameAsShippingCheckbox = page.getByTestId('same-as-shipping-checkbox');
    this.paymentCardRadio = page.getByTestId('payment-method-CARD');
    this.paymentUpiRadio = page.getByTestId('payment-method-UPI');
    this.paymentNetBankingRadio = page.getByTestId('payment-method-NET_BANKING');
    this.simulateSuccessRadio = page.getByTestId('simulate-payment-success-radio');
    this.simulateFailureRadio = page.getByTestId('simulate-payment-failure-radio');
    this.placeOrderBtn = page.getByTestId('place-order-btn');
    this.checkoutErrorAlert = page.getByTestId('checkout-error-alert');
  }

  async selectShippingAddress(addressId?: string): Promise<void> {
    await this.page.getByTestId('checkout-loading').waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
    await this.page.getByTestId('address-section').waitFor({ state: 'visible', timeout: 15000 });
    const selector = addressId
      ? `[data-testid="shipping-address-radio-${addressId}"], [data-testid^="shipping-address-radio-"]`
      : `[data-testid^="shipping-address-radio-"]`;
    const radio = this.page.locator(selector).first();
    await this.click(radio, `Shipping address radio`);
  }

  async setSimulateOutcome(outcome: 'SUCCESS' | 'FAILED'): Promise<void> {
    if (outcome === 'SUCCESS') {
      await this.click(this.simulateSuccessRadio, 'Simulate Payment Success Radio');
    } else {
      await this.click(this.simulateFailureRadio, 'Simulate Payment Failure Radio');
    }
  }

  async placeOrder(): Promise<void> {
    await this.click(this.placeOrderBtn, 'Place Order Button');
  }
}
