import { expect, test } from "@playwright/test"

test("homepage has title and links", async ({ page }) => {
  await page.goto("/")

  // Expect a title "to contain" a substring.
  // Note: Since we use i18n, the actual title depends on the locale.
  // But we can check for the existence of the main heading or specific text if we know the default locale.
  // For now, let's just check if it loads.
  await expect(page).toHaveTitle(/LibraKeeper/);

  const getStarted = page.getByRole("link", { name: /get started/i })
  await expect(getStarted).toBeVisible();
});

test("login page loads", async ({ page }) => {
  await page.goto("/auth/signin")
  await expect(page.getByText("Welcome to LibraKeeper")).toBeVisible()
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});
