import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../pages/base.page';

export class PaginationComponent extends BasePage {
  readonly prevBtn: Locator;
  readonly nextBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.prevBtn = page.getByTestId('pagination-prev');
    this.nextBtn = page.getByTestId('pagination-next');
  }

  async clickNext(): Promise<void> {
    await this.click(this.nextBtn, 'Pagination Next Button');
  }

  async clickPrev(): Promise<void> {
    await this.click(this.prevBtn, 'Pagination Previous Button');
  }

  async clickPageNumber(pageNumber: number): Promise<void> {
    const pageBtn = this.page.getByTestId(`pagination-page-${pageNumber}`);
    await this.click(pageBtn, `Pagination Page ${pageNumber} Button`);
  }

  async verifyPrevDisabled(): Promise<void> {
    await expect(this.prevBtn, 'Previous pagination button should be disabled').toBeDisabled();
  }

  async verifyNextDisabled(): Promise<void> {
    await expect(this.nextBtn, 'Next pagination button should be disabled').toBeDisabled();
  }
}
