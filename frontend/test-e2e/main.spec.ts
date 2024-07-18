import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("もなちゃと☆ω(β版)");
});

test("has text in entrance", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("なまえを入れてください", { exact: true })).toBeVisible();
  await expect(
    page.getByText("荒らし煽りには「無視機能」(荒らし退治も荒らしと同類ですよ)", { exact: true }),
  ).toBeVisible();
});

test("monologue", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox").fill("テストさん#trip");
  await page.getByRole("button", { name: "OK" }).click();
  expect(page).toHaveURL(/\/#\/select/);

  await expect(page.getByText("テストさん")).toBeVisible();

  await page.getByRole("button", { name: "喫茶" }).click();
  expect(page).toHaveURL(/\/#\/room\/1/);

  await page.getByRole("textbox").fill("こんにちは");
  await page.getByRole("button", { name: "OK" }).click();
});
