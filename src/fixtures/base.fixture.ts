import { test as base } from '@playwright/test';

// Page Objects
import { LoginPage } from '../ui/pages/login.page';
import { ProductCatalogPage } from '../ui/pages/product-catalog.page';
import { ProductDetailPage } from '../ui/pages/product-detail.page';
import { CartPage } from '../ui/pages/cart.page';
import { CheckoutPage } from '../ui/pages/checkout.page';
import { OrderConfirmationPage } from '../ui/pages/order-confirmation.page';
import { AdminPage } from '../ui/pages/admin.page';

// API Clients
import { AuthApi } from '../api/clients/auth.api';
import { ProductApi } from '../api/clients/product.api';
import { CartApi } from '../api/clients/cart.api';
import { OrderApi } from '../api/clients/order.api';

// DB Validators
import { OrderDbValidator } from '../db/validators/order.db-validator';

export type FrameworkFixtures = {
  // UI Page Objects
  loginPage: LoginPage;
  catalogPage: ProductCatalogPage;
  detailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  confirmationPage: OrderConfirmationPage;
  adminPage: AdminPage;

  // API Clients
  authApi: AuthApi;
  productApi: ProductApi;
  cartApi: CartApi;
  orderApi: OrderApi;

  // DB Validator
  dbValidator: OrderDbValidator;
};

export const test = base.extend<FrameworkFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  catalogPage: async ({ page }, use) => {
    await use(new ProductCatalogPage(page));
  },
  detailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  confirmationPage: async ({ page }, use) => {
    await use(new OrderConfirmationPage(page));
  },
  adminPage: async ({ page }, use) => {
    await use(new AdminPage(page));
  },

  // API Clients
  authApi: async ({ request }, use) => {
    await use(new AuthApi(request));
  },
  productApi: async ({ request }, use) => {
    await use(new ProductApi(request));
  },
  cartApi: async ({ request }, use) => {
    await use(new CartApi(request));
  },
  orderApi: async ({ request }, use) => {
    await use(new OrderApi(request));
  },

  // DB Validator
  dbValidator: async ({}, use) => {
    await use(new OrderDbValidator());
  },
});

export { expect } from '@playwright/test';
