/**
 * E2E 测试 — Playwright 浏览器自动化
 * 运行: npx playwright test
 */
import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('ANOS Portal E2E', () => {
  test('首页加载成功', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('h1')).toContainText('AI 智能工作台');
    await expect(page.locator('text=今日新增需求')).toBeVisible();
  });

  test('侧边栏导航跳转', async ({ page }) => {
    await page.goto(BASE);
    await page.click('text=询价中心');
    await expect(page).toHaveURL(/inquiries/);
    await expect(page.locator('h1')).toContainText('询价中心');
  });

  test('风控中心页面', async ({ page }) => {
    await page.goto(`${BASE}/risk`);
    await expect(page.locator('h1')).toContainText('风控中心');
    await expect(page.locator('text=总应收')).toBeVisible();
    await expect(page.locator('text=逾期总额')).toBeVisible();
  });

  test('Agent中心', async ({ page }) => {
    await page.goto(`${BASE}/agents`);
    await expect(page.locator('text=Sales Agent')).toBeVisible();
    await expect(page.locator('text=Knowledge Agent')).toBeVisible();
  });

  test('CEO驾驶舱', async ({ page }) => {
    await page.goto(`${BASE}/ceo-dashboard`);
    await expect(page.locator('text=今日营收')).toBeVisible();
    await expect(page.locator('text=OIQ指数')).toBeVisible();
  });

  test('工作流运营中心', async ({ page }) => {
    await page.goto(`${BASE}/workflow`);
    await expect(page.locator('text=WF-001')).toBeVisible();
    await expect(page.locator('text=WF-004')).toBeVisible();
  });
});
