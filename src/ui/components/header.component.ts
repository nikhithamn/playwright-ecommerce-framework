import { Page, Locator } from '@playwright/test';
import { BasePage } from '../pages/base.page';

export class HeaderComponent extends BasePage {
  readonly logo: Locator;
  readonly searchInput: Locator;
  readonly searchClearBtn: Locator;
  readonly cartIconBtn: Locator;
  readonly cartBadgeCount: Locator;
  readonly loginBtn: Locator;
  readonly logoutBtn: Locator;
  readonly ordersBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.logo = page.getByTestId('nav-logo');
    this.searchInput = page.getByTestId('nav-search-input');
    this.searchClearBtn = page.getByTestId('nav-search-clear-btn');
    this.cartIconBtn = page.getByTestId('nav-cart-btn');
    this.cartBadgeCount = page.getByTestId('cart-badge-count');
    this.loginBtn = page.getByTestId('nav-login-btn');
    this.logoutBtn = page.getByTestId('nav-logout-btn');
    this.ordersBtn = page.getByTestId('nav-orders-btn');
  }

  async clickCart(): Promise<void> {
    await this.click(this.cartIconBtn, 'Header Shopping Cart Icon Button');
  }

  async searchProduct(keyword: string): Promise<void> {
    await this.fill(this.searchInput, keyword, 'Header Search Input');
    await this.searchInput.press('Enter');
  }

  async getCartCount(): Promise<number> {
    const text = await this.cartBadgeCount.innerText();
    return parseInt(text.trim(), 10) || 0;
  }

  async clickLogout(): Promise<void> {
    await this.click(this.logoutBtn, 'Logout Button');
  }
}
