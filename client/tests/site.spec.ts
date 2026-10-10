import { test, expect } from "@playwright/test";
test("all routes, images, filters and articles work", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of [
    "/",
    "/about",
    "/services",
    "/work",
    "/work/monoform",
    "/process",
    "/team",
    "/journal",
    "/journal/note-1",
    "/careers",
    "/careers/role-1",
    "/contact",
    "/admin",
    "/missing",
  ]) {
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    await page.locator("img").evaluateAll((imgs) =>
      Promise.all(
        imgs.map((img) => {
          const i = img as HTMLImageElement;
          i.loading = "eager";
          return i.decode().catch(() => {});
        }),
      ),
    );
    const broken = await page
      .locator("img")
      .evaluateAll(
        (imgs) =>
          imgs.filter((img) => !(img as HTMLImageElement).naturalWidth).length,
      );
    expect(broken, route).toBe(0);
  }
  await page.goto("/work");
  await page.getByRole("button", { name: "Branding", exact: true }).click();
  await expect(page.locator(".portfolio-grid .project-link")).toHaveCount(2);
  await page.goto("/journal");
  await page
    .getByRole("textbox", { name: "Search articles" })
    .fill("Motion is a language");
  await expect(page.locator(".article-card")).toHaveCount(1);
  await page.locator(".article-card").click();
  await expect(page).toHaveURL(/journal\/note-2/);
  await page.goto("/process");
  await page.getByRole("tab", { name: "03 Design" }).click();
  await expect(page.locator("#process-panel")).toContainText(
    "Make the idea tangible",
  );
  expect(errors).toEqual([]);
});
test("mobile menu, overflow and honest submission errors", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of [
    "/",
    "/work",
    "/services",
    "/contact",
    "/journal",
    "/team",
  ]) {
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      route,
    ).toBe(true);
  }
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "All pages" })
    .getByRole("link", { name: "Contact" })
    .click();
  await expect(page).toHaveURL(/contact/);
  await page.getByRole("textbox", { name: "Full name" }).fill("Test Person");
  await page.getByRole("textbox", { name: /^Email/ }).fill("test@example.com");
  await page.getByLabel("Project type").selectOption("Website");
  await page.getByLabel("Estimated budget").selectOption("Under $10,000");
  await page
    .getByRole("textbox", { name: "Tell us about the idea" })
    .fill("A sufficiently detailed original project description.");
  await page.getByRole("button", { name: "Send your idea" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.locator(".success")).toHaveCount(0);
  await page.goto("/");
  await expect(page.locator("main h1")).toBeVisible();
  await page.locator("img").evaluateAll((imgs) =>
    Promise.all(
      imgs.map((img) => {
        const i = img as HTMLImageElement;
        i.loading = "eager";
        return i.decode().catch(() => {});
      }),
    ),
  );
  await page.screenshot({
    path: "../test-results/mobile-home.png",
    fullPage: true,
  });
});
test("desktop sculpture renders without runtime errors", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("canvas")).toBeVisible();
  await page.waitForFunction(() => {
    const c = document.querySelector("canvas");
    return c && c.width > 0;
  });
  await expect(page.locator(".intro")).toBeHidden();
  await page.screenshot({ path: "../test-results/desktop-sculpture.png" });
  expect(errors).toEqual([]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(page.locator("main h1")).toBeVisible();
  await page.locator("img").evaluateAll((imgs) =>
    Promise.all(
      imgs.map((img) => {
        const i = img as HTMLImageElement;
        i.loading = "eager";
        return i.decode().catch(() => {});
      }),
    ),
  );
  await page.screenshot({
    path: "../test-results/desktop-home.png",
    fullPage: true,
  });
});
