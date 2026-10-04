import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';

export class ProductDetailPage extends BasePage {
  readonly header: HeaderComponent;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productStock: Locator;
  readonly quantityInput: Locator;
  readonly increaseQtyBtn: Locator;
  readonly decreaseQtyBtn: Locator;
  readonly addToCartBtn: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.productName = page.getByTestId('product-name');
    this.productPrice = page.getByTestId('product-price');
    this.productStock = page.getByTestId('product-stock');
    this.quantityInput = page.getByTestId('quantity-input');
    this.increaseQtyBtn = page.getByTestId('quantity-increase-btn');
    this.decreaseQtyBtn = page.getByTestId('quantity-decrease-btn');
    this.addToCartBtn = page.getByTestId('add-to-cart-btn');
    this.errorMessage = page.getByTestId('error-message');
  }

  async gotoProduct(productId: string): Promise<void> {
    await this.navigateTo(`/products/${productId}`);
  }

  async setQuantity(qty: number): Promise<void> {
    await this.fill(this.quantityInput, qty.toString(), 'Quantity Input');
  }

  async addToCart(): Promise<void> {
    await this.click(this.addToCartBtn, 'Add to Cart Button');
  }
}
