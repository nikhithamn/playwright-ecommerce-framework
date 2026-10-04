import { APIRequestContext } from '@playwright/test';
import { RequestBuilder } from '../builders/request.builder';

export interface PlaceOrderPayload {
  billingAddressId: string;
  shippingAddressId: string;
  paymentMethod?: 'CARD' | 'UPI' | 'NET_BANKING';
  couponCode?: string;
  simulatedPaymentOutcome?: 'SUCCESS' | 'FAILED';
  cardNumber?: string;
}

export class OrderApi {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async placeOrder(token: string, payload: PlaceOrderPayload) {
    return new RequestBuilder(this.request)
      .setEndpoint('/orders')
      .setAuthToken(token)
      .setBody(payload)
      .post();
  }

  async getOrders(token: string) {
    return new RequestBuilder(this.request)
      .setEndpoint('/orders')
      .setAuthToken(token)
      .get();
  }

  async getOrderById(token: string, id: string) {
    return new RequestBuilder(this.request)
      .setEndpoint(`/orders/${id}`)
      .setAuthToken(token)
      .get();
  }

  async updateOrderStatus(adminToken: string, orderId: string, status: string) {
    return new RequestBuilder(this.request)
      .setEndpoint(`/admin/orders/${orderId}/status`)
      .setAuthToken(adminToken)
      .setBody({ status })
      .put();
  }
}
