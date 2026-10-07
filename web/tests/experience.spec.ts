import { expect, test } from "@playwright/test";

test("city dossier shows useful facts and portraits, and supports both reading modes", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#/atlas/frostbay");
  const card = page.getByTestId("detail-panel");
  await expect(
    card.getByRole("button", { name: "Wiki sayfasını aç" }),
  ).toBeInViewport();
  await expect(card.getByTestId("city-facts")).toContainText("45–50 bin");
  await expect(card.getByTestId("city-facts")).toContainText("Nera Veld");
  await expect(
    card.getByRole("img", { name: /^İdare: 5 üzerinden 2/ }),
  ).toBeVisible();
  await expect(
    card.getByRole("img", { name: /^Ticaret: 5 üzerinden 4/ }),
  ).toBeVisible();
  await expect
    .poll(() =>
      card
        .locator(".detail-cover img")
        .evaluate((img: HTMLImageElement) => img.naturalWidth),
    )
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "Wiki sayfasını aç" }).click();
  await expect(page.getByTestId("city-passport")).toContainText("Nera Veld");
  await expect(page.locator(".story-hooks > div")).toHaveCount(3);
  await expect
    .poll(() =>
      page
        .locator(".people-grid img")
        .first()
        .evaluate((img: HTMLImageElement) => img.naturalWidth),
    )
    .toBeGreaterThan(0);
  const chapter = page.locator(".lore-section-card").first();
  await expect(chapter.locator(".section-prose")).toBeHidden();
  await chapter.locator("summary").click();
  await expect(chapter.locator(".section-prose")).toBeVisible();
  await page.getByRole("button", { name: "Tam lore", exact: true }).click();
  await expect(
    page.locator(".reading-switch button[aria-pressed=true]"),
  ).toHaveText("Tam lore");
  await expect(page.locator(".section-detail:not([open])")).toHaveCount(0);
  await page.getByRole("button", { name: "Kartlar", exact: true }).click();
  await expect(chapter.locator(".section-preview")).toBeVisible();
  expect(errors).toEqual([]);
});

test("named seas and mountains have real map targets and can be hidden as a layer", async ({
  page,
}) => {
  await page.goto("/#/atlas/hardlane");
  await expect(page.getByTestId("marker-ak-cam-denizi")).toBeVisible();
  await expect(page.getByTestId("marker-veyrakar")).toBeVisible();
  await page
    .getByRole("button", { name: "Denizler & zirveler", exact: true })
    .click();
  await expect(page.getByTestId("marker-ak-cam-denizi")).toBeHidden();
  await expect(page.getByTestId("marker-veyrakar")).toBeHidden();
  await page
    .getByRole("textbox", { name: "Atlas ve wiki içinde ara" })
    .fill("Ak Cam");
  await page.getByTestId("feature-result-ak-cam-denizi").click();
  await expect(page.getByTestId("marker-ak-cam-denizi")).toBeVisible();
  await expect(page.getByTestId("detail-panel")).toContainText("Açık su");
  await page.getByRole("button", { name: "Wiki sayfasını aç" }).click();
  await expect(page.locator(".article-title h1")).toHaveText("Ak Cam Denizi");
  await page
    .getByRole("button", { name: "İlgili yeri haritada göster", exact: true })
    .click();
  await expect(page).toHaveURL(/#\/atlas\/ak-cam-denizi$/);
  await expect(page.getByTestId("marker-ak-cam-denizi")).toBeVisible();
});

test("route strokes respond to clicks and unfinished Cevher is visibly distinguished", async ({
  page,
}) => {
  await page.goto("/#/atlas/kemige-basan-yol");
  const route = page.getByTestId("route-cevher-cizgisi");
  await expect(route).toHaveClass(/planned/);
  await page.waitForTimeout(1100);
  const click = await route
    .locator(".route-hit")
    .evaluate((path: SVGPathElement) => {
      for (const fraction of [0.15, 0.3, 0.45, 0.6, 0.75, 0.9]) {
        const point = path
          .getPointAtLength(path.getTotalLength() * fraction)
          .matrixTransform(path.getScreenCTM()!);
        if (document.elementFromPoint(point.x, point.y) === path)
          return { x: point.x, y: point.y };
      }
      return null;
    });
  expect(
    click,
    "A visible portion of the planned route accepts a pointer",
  ).not.toBeNull();
  await page.mouse.click(click!.x, click!.y);
  await expect(page).toHaveURL(/#\/atlas\/cevher-cizgisi$/);
  await expect(page.getByTestId("detail-panel")).toContainText(
    "Bu yol inşa edilmedi",
  );
  await expect(route).toHaveClass(/route-selected/);
  await page
    .getByRole("button", { name: "Ticaret yolları", exact: true })
    .click();
  await expect(route).toBeHidden();
  await page
    .getByRole("button", { name: "Ticaret yolları", exact: true })
    .click();
  await expect(route).toBeVisible();
});

test("wiki return keeps the chosen map camera and home fits after the card closes", async ({
  page,
}) => {
  await page.goto("/#/atlas/marhalden");
  await expect(page.getByTestId("zoom-level")).not.toHaveText("100%");
  await page.waitForTimeout(1100);
  await page.getByRole("button", { name: "Yakınlaştır", exact: true }).click();
  await page.waitForTimeout(1000);
  const zoom = await page.getByTestId("zoom-level").textContent();
  await page.getByRole("button", { name: "Wiki sayfasını aç" }).click();
  await page.getByRole("button", { name: "Haritaya dön", exact: true }).click();
  await expect(page.getByTestId("zoom-level")).toHaveText(zoom!);
  await page
    .getByRole("button", { name: "Haritanın tamamını göster", exact: true })
    .click();
  await expect(page.getByTestId("detail-panel")).toHaveCount(0);
  await expect(page.getByTestId("zoom-level")).toHaveText("100%");
});

test("new tax settlement pin discloses its approximate position and links to its tax authority", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Atlas ve wiki içinde ara" })
    .fill("Korhenden");
  await page.getByTestId("location-result-korhenden").click();
  await expect(page.getByTestId("marker-korhenden")).toBeVisible();
  await expect(page.getByTestId("detail-panel")).toContainText(
    "konum yaklaşık",
  );
  await page.getByRole("button", { name: "Wiki sayfasını aç" }).click();
  await expect(page.locator(".article-title h1")).toHaveText("Korhenden");
  await page
    .getByTestId("related-locations")
    .getByRole("button", {
      name: "Valdareth Vergi Havzası Coğrafya",
      exact: true,
    })
    .click();
  await expect(page.locator(".article-title h1")).toHaveText(
    "Valdareth Vergi Havzası",
  );
});

test("mobile dossier stays below the map, reading fits and Ashara gallery opens and closes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/atlas/kaldmere");
  await expect(page.getByTestId("marker-kaldmere")).toBeVisible();
  await page.waitForTimeout(1000);
  const map = await page.locator(".map-stage").boundingBox();
  const card = await page.getByTestId("detail-panel").boundingBox();
  expect(card!.y).toBeGreaterThanOrEqual(map!.y + map!.height);
  const marker = page.getByTestId("marker-kaldmere");
  expect(
    await marker.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return (
        document
          .elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
          ?.closest("button") === el
      );
    }),
  ).toBe(true);
  await page.getByRole("button", { name: "Wiki sayfasını aç" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await page
      .locator(".section-preview")
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
  ).toBeGreaterThanOrEqual(15);
  await page.goto("/#/wiki");
  await page.getByRole("button", { name: "Ashara Portre galerisi" }).click();
  await expect(
    page.getByRole("dialog", { name: "Ashara portresi" }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page
        .getByRole("dialog")
        .locator("img")
        .evaluate((img: HTMLImageElement) => img.naturalWidth),
    )
    .toBeGreaterThan(0);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("route animation respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/atlas/kemige-basan-yol");
  await expect(page.getByTestId("route-kemige-basan-yol")).toBeVisible();
  expect(
    await page
      .getByTestId("route-kemige-basan-yol")
      .locator(".route-line")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});
