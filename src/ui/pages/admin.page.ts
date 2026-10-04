import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';

export class AdminPage extends BasePage {
  readonly header: HeaderComponent;
  readonly resetDatabaseBtn: Locator;
  readonly adminOrdersTable: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.resetDatabaseBtn = page.getByTestId('reset-database-btn');
    this.adminOrdersTable = page.getByTestId('admin-orders-table');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/admin');
  }

  async updateOrderStatus(orderId: string, newStatus: 'CREATED' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'): Promise<void> {
    const select = this.page.getByTestId(`order-status-select-${orderId}`);
    const saveBtn = this.page.getByTestId(`update-status-btn-${orderId}`);
    await select.selectOption(newStatus);
    await this.click(saveBtn, `Save status update '${newStatus}' for order '${orderId}'`);
  }

  async resetDatabase(): Promise<void> {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.click(this.resetDatabaseBtn, 'Reset Database to Seed State Button');
  }
}
