import { test, expect } from "@playwright/test";

test.describe("MacQuest Game", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows welcome screen with title and start button", async ({
    page,
  }) => {
    // Check title and subtitle
    await expect(page.getByText("MacQuest")).toBeVisible();
    await expect(page.getByText("The Typing Adventure")).toBeVisible();

    // Check Start Adventure button
    await expect(
      page.getByRole("button", { name: /Start Adventure/i })
    ).toBeVisible();

    // Check F and J key indicators
    await expect(page.getByText("F", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("J", { exact: true }).first()).toBeVisible();
  });

  test("starts game when clicking Start Adventure", async ({ page }) => {
    // Click start button
    await page.getByRole("button", { name: /Start Adventure/i }).click();

    // Wait for the target letter to appear (first letter is "F")
    await expect(page.getByText("F", { exact: true }).first()).toBeVisible({
      timeout: 5000,
    });

    // Check Level 1 indicator is visible
    await expect(page.getByText("Level 1")).toBeVisible();

    // Check progress counter shows 0 out of 8
    await expect(page.getByText("0")).toBeVisible();
    await expect(page.getByText("/8")).toBeVisible();
  });

  test("handles correct keypress", async ({ page }) => {
    // Start game
    await page.getByRole("button", { name: /Start Adventure/i }).click();
    await expect(page.getByText("F", { exact: true }).first()).toBeVisible({
      timeout: 5000,
    });

    // Press the correct key "f" (target is "F")
    await page.keyboard.press("f");

    // Wait for celebration message to appear in a glass panel
    const glassPanel = page.locator(".glass-panel").first();
    await expect(glassPanel).toBeVisible({ timeout: 5000 });

    // Check that some encouraging message text is shown
    await expect(glassPanel).not.toBeEmpty();
  });

  test("handles wrong keypress", async ({ page }) => {
    // Start game
    await page.getByRole("button", { name: /Start Adventure/i }).click();
    await expect(page.getByText("F", { exact: true }).first()).toBeVisible({
      timeout: 5000,
    });

    // Press a wrong key "k" when target is "F"
    await page.keyboard.press("k");

    // Check that a wrong key / correction message appears
    await expect(page.getByText(/Oops|Almost|Try again/i)).toBeVisible({
      timeout: 3000,
    });
  });

  test("progresses through level", async ({ page }) => {
    // Start game
    await page.getByRole("button", { name: /Start Adventure/i }).click();
    await expect(page.getByText("F", { exact: true }).first()).toBeVisible({
      timeout: 5000,
    });

    // Level 1 sequence: F, J, F, J, J, F, F, J
    const sequence = ["f", "j", "f", "j", "j", "f", "f", "j"];

    for (const key of sequence) {
      await page.keyboard.press(key);
      // Wait for celebration phase to finish (2500ms) plus buffer
      await page.waitForTimeout(3000);
    }

    // After all 8 letters, "Level Complete!" should appear
    await expect(page.getByText(/Level Complete/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test("advances to next level", async ({ page }) => {
    // Start game
    await page.getByRole("button", { name: /Start Adventure/i }).click();
    await expect(page.getByText("F", { exact: true }).first()).toBeVisible({
      timeout: 5000,
    });

    // Complete level 1: F, J, F, J, J, F, F, J
    const sequence = ["f", "j", "f", "j", "j", "f", "f", "j"];

    for (const key of sequence) {
      await page.keyboard.press(key);
      await page.waitForTimeout(3000);
    }

    // Wait for Level Complete screen
    await expect(page.getByText(/Level Complete/i)).toBeVisible({
      timeout: 5000,
    });

    // Click "Next Level" button
    await page.getByRole("button", { name: /Next Level/i }).click();

    // Check Level 2 indicator is visible
    await expect(page.getByText("Level 2")).toBeVisible({ timeout: 5000 });

    // First letter of level 2 is "D"
    await expect(page.getByText("D", { exact: true }).first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("shows keyboard with target key highlighted", async ({ page }) => {
    // Start game
    await page.getByRole("button", { name: /Start Adventure/i }).click();
    await expect(page.getByText("F", { exact: true }).first()).toBeVisible({
      timeout: 5000,
    });

    // Check that the SVG keyboard is visible (inside a div with class "keyboard-body")
    const keyboardBody = page.locator(".keyboard-body");
    await expect(keyboardBody).toBeVisible({ timeout: 5000 });

    // Verify the keyboard contains an SVG element
    const svg = keyboardBody.locator("svg");
    await expect(svg).toBeVisible();
  });

  test("shows progress bar during gameplay", async ({ page }) => {
    // Start game
    await page.getByRole("button", { name: /Start Adventure/i }).click();
    await expect(page.getByText("F", { exact: true }).first()).toBeVisible({
      timeout: 5000,
    });

    // Check that a progress bar exists
    const progressBar = page.getByRole("progressbar");
    await expect(progressBar).toBeVisible({ timeout: 5000 });

    // Press correct key and wait for celebration
    await page.keyboard.press("f");
    await page.waitForTimeout(3000);

    // Verify the counter has updated from 0 to 1
    await expect(page.getByText("1")).toBeVisible();
    await expect(page.getByText("/8")).toBeVisible();
  });
});
