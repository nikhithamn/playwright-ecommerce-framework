import { APIRequestContext } from '@playwright/test';
import { RequestBuilder } from '../builders/request.builder';

export class ProductApi {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getProducts(params: Record<string, string | number | boolean> = {}) {
    const builder = new RequestBuilder(this.request).setEndpoint('/products');
    Object.entries(params).forEach(([k, v]) => builder.setQueryParam(k, v));
    return builder.get();
  }

  async getProductById(id: string) {
    return new RequestBuilder(this.request)
      .setEndpoint(`/products/${id}`)
      .get();
  }
}
