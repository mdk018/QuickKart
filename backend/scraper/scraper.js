const puppeteer = require('puppeteer');

async function scrapePrice(url, platform) {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
  } catch (err) {
    console.error(`Failed to navigate to URL: ${url}`, err);
    await browser.close();
    return null;
  }

  let price = null;

  if (platform === 'amazon') {
    const selectors = [
      '#priceblock_ourprice',
      '#priceblock_dealprice',
      '#price_inside_buybox',
      '#newBuyBoxPrice',
      '.a-price .a-offscreen',
      '#priceblock_saleprice',
      '#priceblock_businessprice',
      '#priceblock_pospromoprice',
      '#priceblock_ourprice_lbl',
      '#priceblock_dealprice_lbl',
      '#priceblock_saleprice_lbl',
      '.a-price-whole',
      '.a-price-fraction',
      '.a-price-symbol',
      '.a-size-base.a-color-price',
      '.offer-price',
      '.priceToPay .a-offscreen',
      '.a-row.a-spacing-mini .a-color-price',
      '.a-color-price',
      '.a-text-price',
      '.aok-offscreen',
      '.a-price .a-price-whole',
      '.a-price .a-price-fraction',
      '.a-price .a-price-symbol',
      '.a-price .aok-align-center',
      '.a-price .aok-align-end',
      '.a-price .aok-align-top'  // covers many Amazon price markup cases
    ];

    for (const selector of selectors) {
      try {
        price = await page.$eval(selector, el => el.textContent.trim());
        if (price) break; // stop at first found price
      } catch (err) {
        // Element not found for this selector, try next
      }
    }

    if (!price) {
      console.error(`Price element not found on Amazon product page: ${url}`);
      // Optionally add screenshot for debugging:
      // await page.screenshot({ path: 'amazon-price-not-found.png' });
    }
  }

  // Add other platforms if needed here

  await browser.close();

  if (price) {
    // Remove non-numeric characters and convert to Number
    return Number(price.replace(/[^0-9.-]+/g, ''));
  }

  return null;
}

module.exports = scrapePrice;
