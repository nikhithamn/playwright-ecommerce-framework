import { APIRequestContext, APIResponse } from '@playwright/test';
import { Config } from '../../../config/env.config';
import { TestHelpers } from '../../utils/test-helpers';
import { Logger } from '../../utils/logger';

export class RequestBuilder {
  private requestContext: APIRequestContext;
  private endpoint: string = '';
  private headers: Record<string, string> = {};
  private queryParams: Record<string, string | number | boolean> = {};
  private bodyPayload: any = null;

  constructor(requestContext: APIRequestContext) {
    this.requestContext = requestContext;
    this.headers['Content-Type'] = 'application/json';
    this.headers['x-correlation-id'] = TestHelpers.generateCorrelationId();
  }

  public setEndpoint(path: string): this {
    this.endpoint = path.startsWith('/') ? path : `/${path}`;
    return this;
  }

  public setAuthToken(token: string): this {
    this.headers['Authorization'] = `Bearer ${token}`;
    return this;
  }

  public setHeader(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }

  public setQueryParam(key: string, value: string | number | boolean): this {
    this.queryParams[key] = value;
    return this;
  }

  public setBody(body: any): this {
    this.bodyPayload = body;
    return this;
  }

  private buildUrl(): string {
    const baseUrl = Config.apiBaseUrl;
    const url = new URL(`${baseUrl}${this.endpoint}`);
    Object.entries(this.queryParams).forEach(([k, v]) => {
      url.searchParams.append(k, String(v));
    });
    return url.toString();
  }

  public async get(): Promise<APIResponse> {
    const url = this.buildUrl();
    Logger.info(`[API GET] Requesting: ${url}`);
    return this.requestContext.get(url, { headers: this.headers });
  }

  public async post(): Promise<APIResponse> {
    const url = this.buildUrl();
    Logger.info(`[API POST] Requesting: ${url}`);
    return this.requestContext.post(url, {
      headers: this.headers,
      data: this.bodyPayload,
    });
  }

  public async put(): Promise<APIResponse> {
    const url = this.buildUrl();
    Logger.info(`[API PUT] Requesting: ${url}`);
    return this.requestContext.put(url, {
      headers: this.headers,
      data: this.bodyPayload,
    });
  }

  public async delete(): Promise<APIResponse> {
    const url = this.buildUrl();
    Logger.info(`[API DELETE] Requesting: ${url}`);
    return this.requestContext.delete(url, { headers: this.headers });
  }
}
