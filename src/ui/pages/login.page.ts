import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';

export class LoginPage extends BasePage {
  readonly header: HeaderComponent;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitBtn: Locator;
  readonly autofillCustomerBtn: Locator;
  readonly autofillAdminBtn: Locator;
  readonly loginErrorAlert: Locator;
  readonly loginPageContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitBtn = page.getByTestId('login-submit-btn');
    this.autofillCustomerBtn = page.getByTestId('quick-fill-customer-btn');
    this.autofillAdminBtn = page.getByTestId('quick-fill-admin-btn');
    this.loginErrorAlert = page.getByTestId('login-error-alert');
    this.loginPageContainer = page.getByTestId('login-page');
  }

  get errorMessage(): Locator {
    return this.loginErrorAlert;
  }

  async goto(): Promise<void> {
    await this.navigateTo('/login');
    await this.loginPageContainer.waitFor({ state: 'visible', timeout: 15000 });
  }

  async login(email: string, pass: string): Promise<void> {
    const loginResponsePromise = this.page.waitForResponse((resp) => resp.url().includes('/auth/login') && resp.status() === 200);
    await this.fill(this.emailInput, email, 'Email Input');
    await this.fill(this.passwordInput, pass, 'Password Input');
    await this.click(this.submitBtn, 'Submit Login Button');
    
    await loginResponsePromise.catch(() => {});
    await this.page.waitForFunction(() => !!localStorage.getItem('token'), { timeout: 5000 }).catch(() => {});
    await this.page.getByTestId('user-greeting').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  }

  async fillInvalidCredentials(email: string, pass: string): Promise<void> {
    await this.fill(this.emailInput, email, 'Email Input');
    await this.fill(this.passwordInput, pass, 'Password Input');
    await this.click(this.submitBtn, 'Submit Login Button');
  }

  async useCustomerQuickFill(): Promise<void> {
    await this.click(this.autofillCustomerBtn, 'Auto-fill Customer Credentials Button');
  }

  async clickAutoFillCustomer(): Promise<void> {
    await this.useCustomerQuickFill();
  }
}
