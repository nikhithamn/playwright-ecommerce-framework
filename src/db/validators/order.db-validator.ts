import { PostgresClient } from '../clients/postgres.client';
import { expect } from '@playwright/test';
import { Logger } from '../../utils/logger';

export class OrderDbValidator {
  async getOrderByNumber(orderNumber: string) {
    const res = await PostgresClient.query(
      `SELECT * FROM "Order" WHERE "orderNumber" = $1 LIMIT 1`,
      [orderNumber]
    );
    return res.rows[0] || null;
  }

  async verifyOrderExists(orderNumber: string) {
    Logger.info(`[DB Validation] Verifying Order '${orderNumber}' exists in PostgreSQL...`);
    const order = await this.getOrderByNumber(orderNumber);
    expect(order, `Database record for order ${orderNumber} should exist`).not.toBeNull();
    return order;
  }

  async verifyOrderStatus(orderNumber: string, expectedStatus: string) {
    Logger.info(`[DB Validation] Verifying Order '${orderNumber}' status is '${expectedStatus}'...`);
    const order = await this.getOrderByNumber(orderNumber);
    expect(order).not.toBeNull();
    expect(order.status).toBe(expectedStatus);
  }

  async getProductById(productId: string) {
    const res = await PostgresClient.query(
      `SELECT * FROM "Product" WHERE "id" = $1 LIMIT 1`,
      [productId]
    );
    return res.rows[0] || null;
  }

  async verifyProductStock(productId: string, expectedStock: number) {
    Logger.info(`[DB Validation] Verifying Product '${productId}' stock level in DB...`);
    const product = await this.getProductById(productId);
    expect(product, `Product ${productId} should exist in DB`).not.toBeNull();
    expect(product.stockQuantity).toBe(expectedStock);
  }

  async verifyPaymentRecord(orderId: string, expectedStatus: string = 'SUCCESS') {
    Logger.info(`[DB Validation] Verifying Payment status for order '${orderId}' in DB...`);
    const res = await PostgresClient.query(
      `SELECT * FROM "Payment" WHERE "orderId" = $1 LIMIT 1`,
      [orderId]
    );
    const payment = res.rows[0] || null;
    expect(payment, `Payment record for order ${orderId} should exist`).not.toBeNull();
    expect(payment.status).toBe(expectedStatus);
  }
}
