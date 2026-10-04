import { test, expect } from '../../src/fixtures/base.fixture';
import { ApiAssertions } from '../../src/api/assertions/api.assertions';

test.describe('API - Products Suite', { tag: ['@api', '@regression'] }, () => {
  test('GET /api/products returns paginated products (default pageSize 6)', async ({ productApi }) => {
    const response = await productApi.getProducts({ page: 1, pageSize: 6 });
    const data = await ApiAssertions.expectSuccessPayload<{ items: any[]; pagination: any }>(response);

    expect(data.items.length).toBe(6);
    expect(data.pagination.pageSize).toBe(6);
    expect(data.pagination.page).toBe(1);
  });

  test('GET /api/products supports category filtering and price sorting', async ({ productApi }) => {
    const response = await productApi.getProducts({ category: 'electronics', sort: 'price_asc' });
    const data = await ApiAssertions.expectSuccessPayload<{ items: any[] }>(response);

    expect(data.items.length).toBeGreaterThan(0);
    // Verify prices are sorted in ascending order
    for (let i = 0; i < data.items.length - 1; i++) {
      expect(data.items[i].price).toBeLessThanOrEqual(data.items[i + 1].price);
    }
  });

  test('GET /api/products/:id returns single product details', async ({ productApi }) => {
    const response = await productApi.getProductById('wireless-noise-canceling-headphones');
    const product = await ApiAssertions.expectSuccessPayload<any>(response);

    expect(product.slug).toBe('wireless-noise-canceling-headphones');
    expect(product.price).toBe(199.99);
  });
});
