import { APIResponse, expect } from '@playwright/test';
import { Logger } from '../../utils/logger';

export class ApiAssertions {
  static async expectStatusCode(response: APIResponse, expectedCode: number): Promise<void> {
    const status = response.status();
    Logger.info(`[API Assertion] Expected status: ${expectedCode}, Actual: ${status}`);
    expect(status, `API response status code should be ${expectedCode}`).toBe(expectedCode);
  }

  static async expectSuccessPayload<T = any>(response: APIResponse): Promise<T> {
    const status = response.status();
    Logger.info(`[API Assertion] Response status code: ${status}`);
    expect(status >= 200 && status < 300, `API response status code should be 2xx (actual: ${status})`).toBe(true);
    const json = await response.json();
    expect(json.success, 'Response success flag should be true').toBe(true);
    expect(json.data, 'Response data payload should be defined').toBeDefined();
    return json.data as T;
  }

  static async expectErrorCode(response: APIResponse, expectedErrorCode: string, expectedStatus: number = 400): Promise<void> {
    await this.expectStatusCode(response, expectedStatus);
    const json = await response.json();
    expect(json.success, 'Response success flag should be false').toBe(false);
    expect(json.error, 'Response error object should be present').toBeDefined();
    expect(json.error.code, `Error code should match '${expectedErrorCode}'`).toBe(expectedErrorCode);
    Logger.info(`[API Assertion] Verified Error Code: ${json.error.code} - ${json.error.message}`);
  }
}
