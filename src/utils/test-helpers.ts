import crypto from 'crypto';

export class TestHelpers {
  static generateCorrelationId(): string {
    return `test-run-${crypto.randomUUID().substring(0, 8)}`;
  }

  static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  static parsePrice(priceString: string): number {
    return parseFloat(priceString.replace(/[^0-9.]/g, ''));
  }
}
