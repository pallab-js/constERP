import { test, expect } from "@playwright/test";

const pages = [
  "/",
  "/projects",
  "/clients",
  "/vendors",
  "/estimates",
  "/materials",
  "/purchase-orders",
  "/invoices",
  "/expenses",
  "/workers",
  "/attendance",
  "/equipment",
];

for (const route of pages) {
  test(`page renders without horizontal overflow: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("body")).toBeVisible();
    const overflow = await page.evaluate(() => {
      const el = document.documentElement;
      return el.scrollWidth - el.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("dashboard shows Nagaland-focused seeded operations", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Dashboard", exact: true })).toBeVisible();
  await expect(page.getByText(/Nagaland/i).first()).toBeVisible();
  await expect(page.getByText(/Kohima/i).first()).toBeVisible();
});

test("projects and clients include Northeast/Nagaland seed records", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.getByText("Kohima-Jessami Road Improvement (Pkg-I)")).toBeVisible();
  await page.goto("/clients");
  await expect(page.getByText("Nagaland PWD (R&B), Kohima")).toBeVisible();
});

test("mobile navigation drawer opens and navigates", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-only behavior");
  await page.goto("/");
  const openMenu = page.getByRole("button", { name: "Open menu" });
  await expect(openMenu).toBeVisible();
  await openMenu.click();
  await expect(page.getByRole("navigation")).toBeVisible();
  await page.getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
});

test("mobile tables remain usable within scroll containers", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-only behavior");
  await page.goto("/projects");
  const table = page.locator("table").first();
  await expect(table).toBeVisible();
  const scrollable = await page.locator("div.overflow-x-auto").first().evaluate((el) => el.scrollWidth > el.clientWidth);
  expect(scrollable).toBeTruthy();
});
