const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true });
  
  // Desktop Modal
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.waitForSelector('#cta-interested', { timeout: 10000 });
  await page.click('#cta-interested');
  await page.waitForTimeout(800);
  await page.screenshot({ path: '.planning/ui-reviews/02-20261105-103000/modal-desktop.png' });
  console.log('Saved modal-desktop.png');
  await page.close();

  // Mobile Modal
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobilePage.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await mobilePage.waitForSelector('#cta-interested', { timeout: 10000 });
  await mobilePage.click('#cta-interested');
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: '.planning/ui-reviews/02-20261105-103000/modal-mobile.png' });
  console.log('Saved modal-mobile.png');
  await mobilePage.close();

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
