import { test, expect } from '../../src/fixtures/base.fixture';

test.describe('UI - Product Catalog Suite', { tag: ['@ui', '@regression'] }, () => {
  test('Catalog renders exactly 6 products per page with pagination controls', async ({ catalogPage }) => {
    await catalogPage.goto();

    // Verify exactly 6 product cards rendered on 1st page
    await catalogPage.verifyProductCardCount(6);

    // Verify pagination controls
    await catalogPage.pagination.verifyPrevDisabled();

    // Navigate to Page 2
    await catalogPage.pagination.clickNext();
    await catalogPage.verifyProductCardCount(6);
  });

  test('User can filter products by primary category', async ({ catalogPage }) => {
    await catalogPage.goto();
    await catalogPage.selectCategoryFilter('electronics');
    await catalogPage.applyFilters();

    // Assert URL query param updated
    await expect(catalogPage.page).toHaveURL(/category=electronics/);
  });

  test('User can sort products by price low to high', async ({ catalogPage }) => {
    await catalogPage.goto();
    await catalogPage.selectSortBy('price_asc');

    await expect(catalogPage.page).toHaveURL(/sort=price_asc/);
  });
});
