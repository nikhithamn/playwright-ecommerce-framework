import { Page, Locator, expect } from '@playwright/test';
import { Config } from '../../../config/env.config';
import { Logger } from '../../utils/logger';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string = '/'): Promise<void> {
    const targetUrl = path.startsWith('http') ? path : `${Config.baseUrl}${path.startsWith('/') ? path : '/' + path}`;
    Logger.info(`[UI Navigation] Navigating to '${targetUrl}'`);
    await this.page.goto(targetUrl);
  }

  async click(locator: Locator | string, description: string): Promise<void> {
    const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
    Logger.info(`[UI Action] Clicking: ${description}`);
    await loc.waitFor({ state: 'visible' });
    await loc.click();
  }

  async fill(locator: Locator | string, text: string, description: string): Promise<void> {
    const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
    Logger.info(`[UI Action] Filling '${description}' with text: '${text}'`);
    await loc.waitFor({ state: 'visible' });
    await loc.fill(text);
  }

  async expectVisible(locator: Locator | string, description: string): Promise<void> {
    const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
    Logger.info(`[UI Assertion] Asserting '${description}' is visible`);
    await expect(loc, `'${description}' should be visible`).toBeVisible();
  }

  async expectText(locator: Locator | string, expectedText: string | RegExp, description: string): Promise<void> {
    const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
    Logger.info(`[UI Assertion] Asserting '${description}' contains text: '${expectedText}'`);
    await expect(loc, `'${description}' should contain text '${expectedText}'`).toContainText(expectedText);
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    Logger.info(`[UI Screenshot] Capturing screenshot: ${name}`);
    return this.page.screenshot({ path: `./test-results/screenshots/${name}.png`, fullPage: true });
  }
}
