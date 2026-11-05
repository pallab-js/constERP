import { test, expect } from "@playwright/test";

test("dashboard loads and shows the sidebar", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("ConstERP")).toBeVisible();
  await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Projects" })).toBeVisible();
});

test("projects page renders without crashing", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.getByText("Projects")).toBeVisible();
});

test("clients page renders without crashing", async ({ page }) => {
  await page.goto("/clients");
  await expect(page.getByText("Clients")).toBeVisible();
});