import { expect, test, type Page } from '@playwright/test';

async function expectFirstCourse(
  page: Page,
  categoryName: RegExp,
  expectedCourse: string,
) {
  const categoryHeading = page.getByRole('heading', {
    level: 2,
    name: categoryName,
  });

  await expect(categoryHeading).toBeVisible();
  await categoryHeading.click();

  const category = categoryHeading.locator('..');
  const firstCourse = category.getByRole('heading', { level: 4 }).first();

  await expect(firstCourse).toHaveText(expectedCourse);
}

test.describe('菜鸟教程首页', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('RUNOOB-HOME-001：首页标题是“菜鸟教程”', async ({ page }) => {
    await expect(page).toHaveTitle('菜鸟教程');
  });

  test('RUNOOB-HOME-002：Python / 数据科学分类第一项是“学习 Python”', async ({
    page,
  }) => {
    await expectFirstCourse(
      page,
      /Python \/ 数据科学$/,
      '【学习 Python】',
    );
  });

  test('RUNOOB-HOME-003：前端开发分类第一项是“学习 HTML”', async ({
    page,
  }) => {
    await expectFirstCourse(page, /前端开发$/, '【学习 HTML】');
  });
});
