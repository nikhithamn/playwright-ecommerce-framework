import { APIRequestContext } from '@playwright/test';
import { RequestBuilder } from '../builders/request.builder';

export class CartApi {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getCart(token: string) {
    return new RequestBuilder(this.request)
      .setEndpoint('/cart')
      .setAuthToken(token)
      .get();
  }

  async addItem(token: string, productId: string, quantity: number) {
    return new RequestBuilder(this.request)
      .setEndpoint('/cart/items')
      .setAuthToken(token)
      .setBody({ productId, quantity })
      .post();
  }

  async clearCart(token: string) {
    return new RequestBuilder(this.request)
      .setEndpoint('/cart')
      .setAuthToken(token)
      .delete();
  }
}
