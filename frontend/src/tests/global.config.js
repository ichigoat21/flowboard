import { chromium } from "@playwright/test";

async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto("http://localhost:3000");
    await page.waitForSelector('[data-testid="column-todo"]', { timeout: 15_000 });

    for (let attempt = 0; attempt < 5; attempt++) {
      let count = await page.locator('[data-testid="task-card"]').count();
      if (count === 0) break;

      while (count > 0) {
        await page
          .locator('[data-testid="task-card"]')
          .first()
          .locator('[title="Delete task"]')
          .click();
        await page.waitForFunction(
          (n) => document.querySelectorAll('[data-testid="task-card"]').length < n,
          count,
          { timeout: 5_000 }
        ).catch(() => {});

        count = await page.locator('[data-testid="task-card"]').count();
      }

      await page.waitForTimeout(600);
    }
  } catch {
  }
  await browser.close();
}

export default globalSetup;