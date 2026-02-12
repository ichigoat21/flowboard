import { test, expect } from "@playwright/test";
import path from "path";

async function waitForBoard(page) {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Add Task" })
  ).toBeVisible({ timeout: 15_000 });
}

async function createTask(page, {
  title       = `Task-${Date.now()}`,
  description = "E2E description",
  priority    = "low",
  category    = "feature",
  column      = "todo",
} = {}) {
  const priorityLabel = { low: "#low", medium: "#medium", high: "#high" }[priority];
  const columnLabel   = { todo: "Todo", "in-prog": "In Progress", done: "Completed" }[column];
  const categoryLabel = {
    work: "Work", personal: "Personal", bug: "Bug",
    feature: "Feature", research: "Research",
  }[category];

  await page.getByRole("button", { name: "Add Task" }).click();
  await expect(page.getByRole("heading", { name: "Add Task" })).toBeVisible();

  await page.getByPlaceholder("Task title").fill(title);
  await page.getByPlaceholder("Add a description").fill(description);


  await page.getByRole("button", { name: priorityLabel, exact: true }).click();


  await page.getByRole("button", { name: columnLabel, exact: true }).click();

  await page.locator(".react-select__control").click();
  await page.getByText(categoryLabel, { exact: true }).first().click();

  await page.getByRole("button", { name: "Submit Task" }).click();


  await expect(
    page.getByRole("heading", { name: "Add Task" })
  ).not.toBeVisible({ timeout: 10_000 });

  return title;
}

test.describe("Kanban Board", () => {

  test("page loads and shows the board heading", async ({ page }) => {
    await waitForBoard(page);
    await expect(
      page.getByRole("heading", { name: "Kanban Board" })
    ).toBeVisible();
  });

  test("all three columns are visible", async ({ page }) => {
    await waitForBoard(page);
    await expect(page.getByText("To Do")).toBeVisible();
    await expect(page.getByText("In Progress")).toBeVisible();
    await expect(page.getByText("Completed")).toBeVisible();
  });

  test("user can create a task and see it on the board", async ({ page }) => {
    await waitForBoard(page);
    const title = await createTask(page, { title: "My New E2E Task" });


    await expect(
      page.locator('[data-testid="task-card"]').filter({ hasText: title })
    ).toBeVisible({ timeout: 8_000 });
  });

  test("user can delete a task and see it removed", async ({ page }) => {
    await waitForBoard(page);

    const title = await createTask(page, { title: "Task To Delete" });
    const card  = page.locator('[data-testid="task-card"]').filter({ hasText: title });
    await expect(card).toBeVisible({ timeout: 8_000 });

    await card.locator('[title="Delete task"]').click();

    await expect(card).not.toBeVisible({ timeout: 8_000 });
  });

  test("user can drag a task from To Do to In Progress", async ({ page }) => {
    await waitForBoard(page);

    const title  = await createTask(page, { title: "Drag Me Task", column: "todo" });
    const card   = page.locator('[data-testid="task-card"]').filter({ hasText: title });
    await expect(card).toBeVisible({ timeout: 8_000 });

    const inProg = page.locator('[data-testid="column-in-prog"]');

    await card.dispatchEvent("dragstart");
    await inProg.dispatchEvent("dragover");
    await inProg.dispatchEvent("drop");
    await card.dispatchEvent("dragend");
    await expect(
      inProg.locator('[data-testid="task-card"]').filter({ hasText: title })
    ).toBeVisible({ timeout: 8_000 });
  });

  test("UI updates in real-time when a second user creates a task", async ({ browser }) => {
    const ctxA = await browser.newContext();
    const ctxB = await browser.newContext();
    const pageA = await ctxA.newPage();
    const pageB = await ctxB.newPage();

    await waitForBoard(pageA);
    await waitForBoard(pageB);

    const title = await createTask(pageA, { title: "Real-time Task" });

    await expect(
      pageB.locator('[data-testid="task-card"]').filter({ hasText: title })
    ).toBeVisible({ timeout: 10_000 });

    await ctxA.close();
    await ctxB.close();
  });

});


test.describe("Dropdown Select", () => {

  test("user can click each priority button", async ({ page }) => {
    await waitForBoard(page);
    await page.getByRole("button", { name: "Add Task" }).click();
    await expect(page.getByRole("heading", { name: "Add Task" })).toBeVisible();
    for (const label of ["#low", "#medium", "#high"]) {
      const btn = page.getByRole("button", { name: label, exact: true });
      await btn.click();
      await expect(btn).toBeEnabled();
    }
  });

  test("user can pick a category via react-select and change it", async ({ page }) => {
    await waitForBoard(page);
    await page.getByRole("button", { name: "Add Task" }).click();
    await expect(page.getByRole("heading", { name: "Add Task" })).toBeVisible();

    const control    = page.locator(".react-select__control");
    const singleVal  = page.locator(".react-select__single-value");

    await control.click();
    await page.getByText("Bug", { exact: true }).first().click();
    await expect(singleVal).toHaveText("Bug");

    await control.click();
    await page.getByText("Research", { exact: true }).first().click();
    await expect(singleVal).toHaveText("Research");
  });

  test("user can edit a task's category and the card badge updates", async ({ page }) => {
    await waitForBoard(page);

    const title = await createTask(page, {
      title: "Category Change Task",
      category: "feature",
    });
    const card = page.locator('[data-testid="task-card"]').filter({ hasText: title });
    await expect(card).toBeVisible({ timeout: 8_000 });
    await expect(card.getByText("feature")).toBeVisible();

    await card.locator('[title="Edit task"]').click();
    await expect(page.getByRole("heading", { name: "Update Task" })).toBeVisible();

    await page.locator(".react-select__control").click();
    await page.getByText("Bug", { exact: true }).first().click();
    await expect(page.locator(".react-select__single-value")).toHaveText("Bug");

    await page.getByRole("button", { name: "Update Task" }).click();
    await expect(
      page.getByRole("heading", { name: "Update Task" })
    ).not.toBeVisible({ timeout: 8_000 });


    await expect(card.getByText("bug")).toBeVisible({ timeout: 8_000 });
  });

});

test.describe("File Upload", () => {

  test("selecting a valid image shows an inline preview before submit", async ({ page }) => {
    await waitForBoard(page);
    await page.getByRole("button", { name: "Add Task" }).click();
    await expect(page.getByRole("heading", { name: "Add Task" })).toBeVisible();
    await page.locator("#task-file-upload").setInputFiles(
      path.join(process.cwd(), "src", "tests", "fixtures", "sample.png")
    );
    await expect(page.locator("img[src^='blob:']")).toBeVisible({ timeout: 5_000 });
    await expect(page.getByText("sample.png")).toBeVisible();
  });

  test("uploaded image is served from /uploads/ and renders in the card", async ({ page }) => {
    await waitForBoard(page);

    const title = `Upload Test ${Date.now()}`;
    await page.getByRole("button", { name: "Add Task" }).click();
    await page.getByPlaceholder("Task title").fill(title);
    await page.getByRole("button", { name: "#low", exact: true }).click();
    await page.getByRole("button", { name: "Todo", exact: true }).click();

    await page.locator("#task-file-upload").setInputFiles(
      path.join(process.cwd(), "src", "tests", "fixtures", "sample.png")
    );

    await page.getByRole("button", { name: "Submit Task" }).click();
    await expect(
      page.getByRole("heading", { name: "Add Task" })
    ).not.toBeVisible({ timeout: 12_000 });
    const card = page.locator('[data-testid="task-card"]').filter({ hasText: title });
    await expect(card).toBeVisible({ timeout: 8_000 });

    const img = card.locator('img[src*="localhost:3001/uploads/"]');
    await expect(img).toBeVisible({ timeout: 10_000 });

    const decoded = await img.evaluate((el) => el.naturalWidth > 0);
    expect(decoded).toBe(true);
  });

  test("invalid file type: no preview shown, submit triggers alert", async ({ page }) => {
    await waitForBoard(page);
    await page.getByRole("button", { name: "Add Task" }).click();
    await page.getByPlaceholder("Task title").fill("Invalid File Task");
    await page.locator("#task-file-upload").setInputFiles({
      name:     "bad.txt",
      mimeType: "text/plain",
      buffer:   Buffer.from("should be rejected by multer"),
    });
    await expect(page.locator("img[src^='blob:']")).not.toBeVisible();

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toMatch(/upload failed|failed/i);
      await dialog.accept();
    });

    await page.getByRole("button", { name: "Submit Task" }).click();
  });

});


test.describe("Graph / Progress Strip", () => {

  test("percentage increases after a task is created in Completed", async ({ page }) => {
    await waitForBoard(page);

    const strip = page.locator('[data-testid="progress-strip"]');
    await expect(strip).toBeVisible();
    const before = await strip.locator("p").textContent();
    await createTask(page, { title: "Done Task for Graph", column: "done" });

    await expect(strip.locator("p")).not.toHaveText(before, { timeout: 8_000 });
  });

  test("bar chart canvas is mounted and remains after new tasks are added", async ({ page }) => {
    await waitForBoard(page);

    const canvas = page.locator('[data-testid="progress-strip"] canvas');
    await expect(canvas).toBeVisible();

    await createTask(page, { title: "Chart Task A", column: "todo" });
    await createTask(page, { title: "Chart Task B", column: "in-prog" });

    await expect(canvas).toBeVisible();
  });

  test("progress strip updates after dragging a task to Completed", async ({ page }) => {
    await waitForBoard(page);

    const title = await createTask(page, { title: "Move To Done", column: "todo" });
    const card  = page.locator('[data-testid="task-card"]').filter({ hasText: title });
    await expect(card).toBeVisible({ timeout: 8_000 });

    const strip  = page.locator('[data-testid="progress-strip"]');
    const before = await strip.locator("p").textContent();

    const doneCol = page.locator('[data-testid="column-done"]');
    await card.dispatchEvent("dragstart");
    await doneCol.dispatchEvent("dragover");
    await doneCol.dispatchEvent("drop");
    await card.dispatchEvent("dragend");
    await expect(strip.locator("p")).not.toHaveText(before, { timeout: 8_000 });
  });

});