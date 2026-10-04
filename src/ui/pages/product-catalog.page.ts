import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';
import { PaginationComponent } from '../components/pagination.component';

export class ProductCatalogPage extends BasePage {
  readonly header: HeaderComponent;
  readonly pagination: PaginationComponent;
  readonly sortSelect: Locator;
  readonly minPriceInput: Locator;
  readonly maxPriceInput: Locator;
  readonly instockCheckbox: Locator;
  readonly applyFiltersBtn: Locator;
  readonly clearFiltersBtn: Locator;
  readonly productsGrid: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.pagination = new PaginationComponent(page);
    this.sortSelect = page.getByTestId('sort-select');
    this.minPriceInput = page.getByTestId('min-price-input');
    this.maxPriceInput = page.getByTestId('max-price-input');
    this.instockCheckbox = page.getByTestId('instock-filter-checkbox');
    this.applyFiltersBtn = page.getByTestId('apply-filters-btn');
    this.clearFiltersBtn = page.getByTestId('clear-filters-btn');
    this.productsGrid = page.getByTestId('products-grid');
    this.productCards = page.locator('[data-testid^="product-card-"]');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/products');
    await this.page.getByTestId('products-grid').waitFor({ state: 'visible', timeout: 15000 });
    
    // Ensure React auth check finishes if user is logged in
    const hasToken = await this.page.evaluate(() => !!localStorage.getItem('token'));
    if (hasToken) {
      await this.page.getByTestId('user-greeting').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    }
  }

  async selectCategoryFilter(categorySlug: string): Promise<void> {
    const radio = this.page.getByTestId(`category-filter-${categorySlug}`);
    await this.click(radio, `Category filter radio '${categorySlug}'`);
  }

  async selectSortBy(sortOption: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'rating_desc'): Promise<void> {
    await this.sortSelect.selectOption(sortOption);
  }

  async setPriceRange(min: number, max: number): Promise<void> {
    await this.fill(this.minPriceInput, min.toString(), 'Min Price Input');
    await this.fill(this.maxPriceInput, max.toString(), 'Max Price Input');
  }

  async applyFilters(): Promise<void> {
    await this.click(this.applyFiltersBtn, 'Apply Filters Button');
  }

  async clickAddToCartForProduct(productIdOrSlug?: string): Promise<void> {
    let selector = 'button[aria-label^="Add "]:enabled';
    if (productIdOrSlug) {
      selector = `[data-testid="product-card-${productIdOrSlug}"] button:enabled, button[data-testid="add-to-cart-btn-${productIdOrSlug}"]:enabled, ${selector}`;
    }
    const btn = this.page.locator(selector).first();
    await this.click(btn, `Add to Cart Button for product '${productIdOrSlug || 'in-stock product'}'`);
    
    await Promise.race([
      this.page.waitForResponse((resp) => resp.url().includes('/cart') && resp.status() < 400),
      this.page.locator('button:has-text("Added")').waitFor({ state: 'visible' }),
      this.page.waitForTimeout(1000)
    ]).catch(() => {});
  }

  async verifyProductCardCount(expectedCount: number): Promise<void> {
    await expect(this.productCards, `Catalog page should render ${expectedCount} product cards`).toHaveCount(expectedCount);
  }
}
