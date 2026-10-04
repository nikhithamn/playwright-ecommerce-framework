import { APIRequestContext } from '@playwright/test';
import { RequestBuilder } from '../builders/request.builder';
import { ApiAssertions } from '../assertions/api.assertions';
import { UserPayload } from '../../factories/user.factory';

export interface JwtTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export class AuthApi {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(email: string, password: string) {
    const response = await new RequestBuilder(this.request)
      .setEndpoint('/auth/login')
      .setBody({ email, password })
      .post();

    return response;
  }

  async loginAndGetToken(email: string, password: string): Promise<string> {
    const response = await this.login(email, password);
    const data = await ApiAssertions.expectSuccessPayload<{ token: string }>(response);
    return data.token;
  }

  async loginWithJwt(email: string, password: string): Promise<JwtTokenResponse> {
    const response = await new RequestBuilder(this.request)
      .setEndpoint('/auth/jwt/login')
      .setBody({ email, password })
      .post();

    return ApiAssertions.expectSuccessPayload<JwtTokenResponse>(response);
  }

  async refreshJwtToken(refreshToken: string): Promise<JwtTokenResponse> {
    const response = await new RequestBuilder(this.request)
      .setEndpoint('/auth/jwt/refresh')
      .setBody({ refreshToken })
      .post();

    return ApiAssertions.expectSuccessPayload<JwtTokenResponse>(response);
  }

  async register(user: UserPayload) {
    const response = await new RequestBuilder(this.request)
      .setEndpoint('/auth/register')
      .setBody(user)
      .post();

    return response;
  }

  async getProfile(token: string) {
    const response = await new RequestBuilder(this.request)
      .setEndpoint('/auth/me')
      .setAuthToken(token)
      .get();

    return response;
  }
}
