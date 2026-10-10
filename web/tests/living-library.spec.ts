import { expect, test } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { characters, characterById } from '../src/lore/characters';
import { abilities, abilityModifier, characterAbilities } from '../src/character-abilities';
import { worldBooks } from '../src/lore/books';
import { originalBooks } from '../src/lore/book-originals';
import { writerCharacters } from '../src/lore/writers';
import { cityGuides } from '../src/lore/civic-guides';
import { institutionOperations } from '../src/lore/institution-operations';
import { institutionRosters } from '../src/lore/danstsud-roster';
import { characterLife } from '../src/lore/character-life';
import { articleById, locationById, regionById, loreArticles, historyArticle } from '../src/data';
import { portraitFor } from '../src/media';

test('every identified character has six bounded editable abilities without assigning identity to unknown portraits', () => {
  expect(characters).toHaveLength(161);
  expect(Object.keys(characterAbilities).sort()).toEqual(characters.map(person => person.id).sort());
  for (const person of characters) {
    const scores = characterAbilities[person.id];
    expect(scores, person.id).toHaveLength(6);
    expect(scores.every(value => Number.isInteger(value) && value >= 3 && value <= 20), person.id).toBe(true);
    expect(portraitFor(person.portrait), person.id).toBeDefined();
  }
  for (const id of ['lysandra', 'ashara', 'roddic']) expect(characterAbilities[id], id).toBeUndefined();
  expect(abilityModifier(9)).toBe(-1);
  expect(abilityModifier(18)).toBe(4);
  expect(abilities.map(value => value.key)).toEqual(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']);
  expect(characterAbilities.eryndorn[3]).toBe(18);
  expect(characterAbilities.eryndorn[0]).toBeLessThan(characterAbilities.grathor[0]);
  expect(portraitFor('bryndon-kiyi-defteri')?.painted).toBe(true);
});

test('all books contain substantial leaves, clear provenance and valid canonical author and place links', () => {
  expect(worldBooks).toHaveLength(14);
  expect(new Set(worldBooks.map(book => book.id)).size).toBe(14);
  for (const book of worldBooks) {
    const words = book.excerpt.join(' ').trim().split(/\s+/).length;
    expect(words, book.id).toBeGreaterThanOrEqual(400);
    expect(words, book.id).toBeLessThanOrEqual(900);
    expect(book.excerpt.length, book.id).toBeGreaterThanOrEqual(3);
    expect(book.excerpt.length, book.id).toBeLessThanOrEqual(4);
    expect(book.period, book.id).toBeTruthy();
    expect(book.category, book.id).toBeTruthy();
    expect(book.note.length, book.id).toBeGreaterThan(40);
    expect(articleById(book.id) || (book.id === historyArticle.id ? historyArticle : undefined), book.id).toBeDefined();
    expect(locationById(book.placeId!) || regionById(book.placeId!), book.id).toBeDefined();
    if (book.authorId) expect(characterById(book.authorId), book.id).toBeDefined();
  }
  for (const original of originalBooks) {
    const expanded = worldBooks.find(book => book.id === original.id)!;
    expect(expanded.author).toBe(original.author);
    expect(expanded.condition).toBe(original.condition);
    for (const leaf of original.excerpt) expect(expanded.excerpt.join(' '), original.id).toContain(leaf);
  }
  expect(worldBooks.find(book => book.id === 'kitap-kirik-muhur')?.authorId).toBeUndefined();
});

test('all important cities and institution rosters have operating guides and searchable full lore', () => {
  expect(Object.keys(cityGuides)).toHaveLength(15);
  for (const [id, guide] of Object.entries(cityGuides)) {
    expect(Object.values(guide).every(value => value.length > 65), id).toBe(true);
    expect(locationById(id)?.sections?.some(section => section.title === 'Bir günün geçimi'), id).toBe(true);
  }
  for (const roster of institutionRosters) {
    expect(institutionOperations[roster.id], roster.id).toBeDefined();
    expect(articleById(roster.id)?.sections.some(section => section.title === 'Yetki, destek ve hesap verme'), roster.id).toBe(true);
    for (const id of roster.memberIds) expect(characterById(id), id).toBeDefined();
  }
  const records = new Set([...loreArticles.map(article => article.id), ...Object.keys(cityGuides), 'danstsud', 'hardlane', 'manorveil', 'lowvale']);
  for (const writer of writerCharacters) {
    expect(records.has(writer.id), writer.id).toBe(true);
    expect(writer.related?.every(id => records.has(id) || locationById(id) || regionById(id)), writer.id).toBe(true);
    expect(portraitFor(writer.portrait)?.painted).toBe(true);
  }
  for (const [id, life] of Object.entries(characterLife)) {
    expect(characterById(id), id).toBeDefined();
    expect(Object.values(life).every(value => value.length > 12), id).toBe(true);
    expect(articleById(id)?.sections.some(section => section.title === 'Bir seçimin izi'), id).toBe(true);
  }
  for (const id of ['gil','jeremiah','volomiyr','lysandra']) expect(characterLife[id], id).toBeUndefined();
});

test('no private DM solution marker or preparation is shipped through app sources or public assets', () => {
  function paths(root: string): string[] { return readdirSync(root, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? paths(resolve(root, entry.name)) : [resolve(root, entry.name)]); }
  const files = [...paths(resolve('src')), ...paths(resolve('public'))];
  expect(files.filter(file => /DM_HAZIRLIK|private-aruzahr/.test(file))).toEqual([]);
  for (const file of files.filter(file => /\.(tsx?|m?js|json|md|html|css)$/.test(file))) {
    expect(readFileSync(file, 'utf8'), file).not.toContain('ARUZAHR_DM_PRIVATE__');
  }
  for (const book of worldBooks.filter(book => book.id === 'kitap-uc-agirlik')) {
    expect(book.excerpt.join(' ')).not.toContain('Karven bunu satışın kenar notuna');
    expect(book.excerpt.join(' ')).toContain('yirmi dört');
    expect(book.excerpt.join(' ')).toContain('on sekiz buçuk');
  }
});

test('the character directory shows the full roster, filters by place and reads the same stats on wiki', async ({ page }) => {
  await page.goto('/#/characters');
  await expect(page.getByTestId('characters-hub')).toBeVisible();
  await expect(page.locator('.character-directory-entry')).toHaveCount(24);
  await page.getByRole('button', { name: 'Bütün 161 kişiyi göster', exact: true }).click();
  await expect(page.locator('.character-directory-entry')).toHaveCount(161);
  await page.getByRole('combobox', { name: 'Karakterin şehri' }).selectOption('marhalden');
  const local = characters.filter(person => person.city === 'marhalden');
  await expect(page.locator('.character-directory-entry')).toHaveCount(local.length);
  await page.getByRole('searchbox', { name: 'Karakter adı veya görevi' }).fill('Mereth');
  await expect(page.locator('.character-directory-entry')).toHaveCount(1);
  const values = await page.getByTestId('abilities-mereth-vann').locator('dd strong').allTextContents();
  await page.getByRole('link', { name: 'Mereth Vann karakterini tanı', exact: true }).click();
  await expect(page.locator('.article-title h1')).toHaveText('Mereth Vann');
  await expect(page.getByTestId('abilities-mereth-vann')).toContainText('D&D OYUN TASLAĞI');
  expect(await page.getByTestId('abilities-mereth-vann').locator('dd strong').allTextContents()).toEqual(values);
  await page.goBack();
  await expect(page.getByTestId('characters-hub')).toBeVisible();
});

test('country and affiliation filters combine, no-match reset works, unknown portraits remain separate', async ({ page }) => {
  await page.goto('/#/characters');
  await page.getByRole('combobox', { name: 'Karakterin ülkesi' }).selectOption('xotar');
  await expect(page.locator('.character-directory-entry')).toHaveCount(characters.filter(person => person.region === 'xotar').length);
  await page.getByRole('searchbox', { name: 'Karakter adı veya görevi' }).fill('olmayan-bir-kisi');
  await expect(page.getByRole('heading', { name: 'Bu aramada kimse bulunamadı.' })).toBeVisible();
  await page.getByRole('button', { name: 'Bütün karakterlere dön', exact: true }).click();
  const affiliation = characterById('gil')!.affiliation;
  await page.getByRole('combobox', { name: 'Karakterin kurumu' }).selectOption(affiliation);
  await expect(page.locator('.character-directory-entry')).toHaveCount(characters.filter(person => person.affiliation === affiliation).length);
  await page.locator('.unidentified-portraits summary').click();
  await expect(page.locator('.unidentified-portraits')).toContainText('Kimlik, görev veya D&D değeri atanmaz');
  await expect(page.locator('.unidentified-portraits .character-abilities')).toHaveCount(0);
});

for (const book of worldBooks) {
  test(`${book.title} opens every surviving leaf, its record and its named author`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/#/books/${book.id}`);
    const desk = page.getByTestId('book-reading-desk');
    await expect(desk).toHaveAttribute('data-book-id', book.id);
    for (let index = 0; index < book.excerpt.length; index++) {
      await page.getByRole('combobox', { name: 'Kitap bölümü', exact: true }).selectOption(String(index));
      await expect.poll(() => page.locator('.book-paper-reading > p').allTextContents()).toEqual(book.excerpt[index].split('\n\n'));
      await expect(page.getByRole('button', { name: 'Önceki kitap yaprağı' })).toBeEnabled({ enabled: index > 0 });
      await expect(page.getByRole('button', { name: 'Sonraki kitap yaprağı' })).toBeEnabled({ enabled: index < book.excerpt.length - 1 });
    }
    await page.getByRole('button', { name: 'Bütün kaydı oku', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#/wiki/${book.id}$`));
    await page.getByTestId('related-books').getByRole('button').first().click();
    await expect(page).toHaveURL(new RegExp(`#/books/${book.id}`));
    if (book.authorId) {
      await page.getByRole('button', { name: 'Yazarı tanı', exact: true }).click();
      await expect(page.getByTestId(`abilities-${book.authorId}`)).toBeVisible();
      await expect(page.locator('.hero-portrait-button')).toBeVisible();
      await expect(page.getByTestId('related-books')).toContainText(book.title);
    }
  });
}

test('reader deep links, bookmark, saved font, keyboard leaves and history all preserve the selected volume', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/books/kitap-yel-degirmeni?leaf=2');
  await expect(page.getByRole('combobox', { name: 'Kitap bölümü', exact: true })).toHaveValue('1');
  await page.getByRole('combobox', { name: 'Kitap yazısı boyutu' }).selectOption('27');
  await page.getByRole('button', { name: 'Bu yaprağı işaretle', exact: true }).click();
  await page.getByTestId('book-reading-desk').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/kitap-yel-degirmeni\?leaf=3$/);
  await page.getByRole('button', { name: 'İşaretli yaprağa dön' }).click();
  await expect(page).toHaveURL(/kitap-yel-degirmeni\?leaf=2$/);
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'Kitap yazısı boyutu' })).toHaveValue('27');
  await expect(page.getByRole('button', { name: 'Bu yaprağın işaretini kaldır' })).toHaveAttribute('aria-pressed', 'true');
  expect(await page.locator('.book-paper-reading p').first().evaluate(el => getComputedStyle(el).fontSize)).toBe('27px');
  await page.getByRole('button', { name: 'Sonraki kitap yaprağı' }).click();
  await expect.poll(() => page.locator('.book-paper').evaluate(el => el.getBoundingClientRect().top)).toBeLessThan(250);
  await expect.poll(() => page.locator('.book-paper').evaluate(el => el.getBoundingClientRect().top)).toBeGreaterThan(65);
  await page.goBack();
  await expect(page.getByRole('combobox', { name: 'Kitap bölümü', exact: true })).toHaveValue('1');
  await page.getByRole('button', { name: 'Bu yaprağın işaretini kaldır' }).click();
  await expect(page.getByRole('button', { name: 'Bu yaprağı işaretle', exact: true })).toHaveAttribute('aria-pressed', 'false');
});

test('books search the manuscript and its author, condition and category filters combine', async ({ page }) => {
  await page.goto('/#/books');
  await page.getByRole('searchbox', { name: 'Kitaplarda ara' }).fill('Neral');
  await expect(page.locator('.world-book-grid > button')).toHaveCount(1);
  await page.getByRole('searchbox', { name: 'Kitaplarda ara' }).fill('');
  await page.getByRole('group', { name: 'Kitap türleri' }).getByRole('button', { name: 'Yolculuk', exact: true }).click();
  await page.getByRole('group', { name: 'Kitaplık rafları' }).getByRole('button', { name: /Kayıp yapraklar/ }).click();
  await expect(page.locator('.world-book-grid > button')).toHaveCount(worldBooks.filter(book => book.category === 'yolculuk' && book.condition === 'kayip').length);
  await page.getByRole('searchbox', { name: 'Kitaplarda ara' }).fill('olmayan-bir-nusha');
  await page.getByRole('button', { name: 'Bütün kitaplara dön' }).click();
  await expect(page.locator('.world-book-grid > button')).toHaveCount(14);
});

test('all six writers have visible painterly portraits and enter the global gallery with canonical links', async ({ page }) => {
  for (const writer of writerCharacters) {
    const response = await page.request.get(portraitFor(writer.portrait)!.src);
    expect(response.ok(), writer.id).toBe(true);
    expect(response.headers()['content-type'], writer.id).toContain('image/webp');
  }
  await page.goto('/#/gallery');
  await page.getByRole('textbox', { name: 'Görsellerde ara' }).fill('Ivena');
  await expect(page.locator('.gallery-tile')).toHaveCount(1);
  await page.locator('.gallery-tile-footer button').click();
  await expect(page.locator('.article-title h1')).toHaveText('Ivena Sarell');
  await expect(page.locator('.hero-portrait-button img')).toBeVisible();
  await expect.poll(() => page.locator('.hero-portrait-button img').evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(300);
  for (const src of ['/illustrations/bryndon.webp','/illustrations/bryndon-painted.webp']) {
    await page.goto('/#/gallery');
    await page.getByRole('textbox', { name: 'Görsellerde ara' }).fill('Bryndon');
    await page.locator('.gallery-tile').filter({ has: page.locator(`img[src="${src}"]`) }).locator('.gallery-tile-footer button').click();
    await expect(page).toHaveURL(/#\/wiki\/bryndon-kiyi-defteri$/);
    await expect(page.locator('.hero-portrait-button img')).toHaveAttribute('src','/illustrations/bryndon-painted.webp');
  }
});

test('operating guides expand useful text and city books focus the correct map anchor', async ({ page }) => {
  await page.goto('/#/wiki/valdareth');
  const guide = page.getByTestId('city-living-guide');
  await guide.locator('summary').filter({ hasText: 'Sofra & su' }).click();
  await expect(guide.locator('details[open]')).toContainText('Serenith');
  await page.getByTestId('related-books').getByRole('button', { name: /Beşinci Duvarın Dilekçesi/ }).click();
  await page.getByRole('button', { name: 'Haritada göster', exact: true }).click();
  await expect(page.getByTestId('marker-valdareth')).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/#/wiki/mor-pelerin');
  const operations = page.getByTestId('institution-operations');
  await operations.locator('summary').filter({ hasText: 'Ücret & destek' }).click();
  await expect(operations.locator('details[open]')).toContainText('iki kişilik bir ordu');
  await page.goto('/#/wiki/orvel-kaya-binegi');
  await expect(page.getByTestId('species-passport')).toContainText('Otçul küçük sürüler');
  await page.getByRole('button', { name: 'Tam lore', exact: true }).click();
  await expect(page.locator('.lore-section-card').filter({ hasText: 'Devriyenin yük ve mevsim hesabı' })).toContainText('70–90 kg');
});

for (const width of [320,390,820,1024,1440]) {
  test(`menus, character cards and parchment stay readable at ${width}px with reduced motion`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#/characters');
    await expect(page.getByTestId('characters-hub')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width < 980) await page.getByRole('button', { name: 'Bölge menüsünü aç', exact: true }).click();
    const menu = width < 980 ? page.getByRole('navigation', { name: 'Keşif alanları' }) : page.getByRole('navigation', { name: 'Ana gezinme' });
    for (const label of ['Kitaplar','Galeri','Karakterler']) await expect(menu.getByRole('link', { name: label, exact: true })).toBeVisible();
    await menu.getByRole('link', { name: 'Kitaplar', exact: true }).click();
    await page.goto('/#/books/kitap-yel-degirmeni?leaf=2');
    await expect(page.getByTestId('book-reading-desk')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('combobox', { name: 'Kitap yazısı boyutu' }).selectOption('27');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('.book-paper').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    await page.goto('/#/wiki/valdareth');
    await page.getByTestId('city-living-guide').locator('summary').first().click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('malformed storage and invalid book URLs fall back without breaking the reader', async ({ page }) => {
  await page.addInitScript(() => { localStorage.setItem('aruzahr-book-marks', 'not-json'); localStorage.setItem('aruzahr-book-font', '999'); });
  await page.goto('/#/books/%E0%A4%A?leaf=-2');
  await expect(page.getByRole('alert')).toContainText('Bu nüsha bulunamadı');
  await expect(page.getByRole('combobox', { name: 'Kitap bölümü', exact: true })).toHaveValue('0');
  await expect(page.getByRole('combobox', { name: 'Kitap yazısı boyutu' })).toHaveValue('23');
  await page.goto('/#/books/kitap-yel-degirmeni?leaf=100');
  await expect(page.getByRole('combobox', { name: 'Kitap bölümü', exact: true })).toHaveValue('2');
});
