import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';

export class OrderConfirmationPage extends BasePage {
  readonly header: HeaderComponent;
  readonly confirmationHeading: Locator;
  readonly orderNumber: Locator;
  readonly orderStatus: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.confirmationHeading = page.getByTestId('confirmation-heading');
    this.orderNumber = page.getByTestId('order-number');
    this.orderStatus = page.getByTestId('order-status');
  }

  async getOrderNumberText(): Promise<string> {
    const text = await this.orderNumber.innerText();
    return text.replace('Order Number: ', '').trim();
  }
}
