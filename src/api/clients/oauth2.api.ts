import { APIRequestContext } from '@playwright/test';
import { RequestBuilder } from '../builders/request.builder';
import { ApiAssertions } from '../assertions/api.assertions';

export interface OAuth2TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

export interface ClientCredentialsConfig {
  clientId: string;
  clientSecret: string;
  scope?: string;
}

export interface PkceConfig {
  clientId: string;
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

export class OAuth2Api {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * OAuth 2.0 Client Credentials Grant Flow
   */
  async getClientCredentialsToken(config: ClientCredentialsConfig): Promise<OAuth2TokenResponse> {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', config.clientId);
    params.append('client_secret', config.clientSecret);
    if (config.scope) {
      params.append('scope', config.scope);
    }

    const response = await new RequestBuilder(this.request)
      .setEndpoint('/oauth/token')
      .setHeader('Content-Type', 'application/x-www-form-urlencoded')
      .setBody(params.toString())
      .post();

    return ApiAssertions.expectSuccessPayload<OAuth2TokenResponse>(response);
  }

  /**
   * OAuth 2.0 Authorization Code Flow with PKCE
   */
  async exchangeCodeForTokenPKCE(config: PkceConfig): Promise<OAuth2TokenResponse> {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', config.clientId);
    params.append('code', config.code);
    params.append('code_verifier', config.codeVerifier);
    params.append('redirect_uri', config.redirectUri);

    const response = await new RequestBuilder(this.request)
      .setEndpoint('/oauth/token')
      .setHeader('Content-Type', 'application/x-www-form-urlencoded')
      .setBody(params.toString())
      .post();

    return ApiAssertions.expectSuccessPayload<OAuth2TokenResponse>(response);
  }

  /**
   * Refresh OAuth 2.0 Token
   */
  async refreshToken(clientId: string, clientSecret: string, refreshToken: string): Promise<OAuth2TokenResponse> {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('refresh_token', refreshToken);

    const response = await new RequestBuilder(this.request)
      .setEndpoint('/oauth/token')
      .setHeader('Content-Type', 'application/x-www-form-urlencoded')
      .setBody(params.toString())
      .post();

    return ApiAssertions.expectSuccessPayload<OAuth2TokenResponse>(response);
  }
}
