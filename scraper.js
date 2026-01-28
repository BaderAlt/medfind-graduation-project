const puppeteer = require('puppeteer');

async function scrapeProduct(productName) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const results = [];

  const websites = [
    {
      name: 'Al-Dawaa',
      url: 'https://www.al-dawaa.com/arabic/',
      searchInputSelector: '.ais-SearchBox-input',
      resultSelector: 'h3[itemprop="name"].result-title.text-ellipsis',
      selectors: {
        titleSelector: 'h3[itemprop="name"].result-title.text-ellipsis',
        priceSelector: 'span[itemprop="lowPrice"].after_special',
        imageSelector: 'img[itemprop="image"]'
      }
    },
    {
      name: 'United Pharmacy',
      url: 'https://unitedpharmacy.sa/',
      searchInputSelector: '#autocomplete-0-input',
      resultSelector: '.product-item-info',
      selectors: {
        titleSelector: '.product-item-link',
        priceSelector: '.price',
        imageSelector: '.product-image-photo'
      }
    },
  
    
    {
      name: 'Nahdi',
      url: 'https://www.nahdionline.com/en/',
      searchInputSelector: 'input[name="q"].input-text.algolia-search-input',
      resultSelector: 'h3[itemprop="name"] a',
      selectors: {
        titleSelector: 'h3[itemprop="name"] a',
        priceSelector: '.after_special',
        imageSelector: 'img[itemprop="image"]'
      }
    }
  ];

  for (const website of websites) {
    await page.goto(website.url);

    try {
      console.log(`Searching for ${productName} on ${website.name}...`);
      await page.waitForSelector(website.searchInputSelector);
      await page.type(website.searchInputSelector, productName, { delay: 10 });
      await page.keyboard.press('Enter');
      await page.waitForSelector(website.resultSelector);

      const data = await page.evaluate((selectors) => {
        const title = document.querySelector(selectors.titleSelector)?.innerText.trim();
        const price = document.querySelector(selectors.priceSelector)?.innerText.trim();
        const imageUrl = document.querySelector(selectors.imageSelector)?.getAttribute('src');
        return { title, price, imageUrl };
      }, website.selectors);

      results.push({ website: website.name, ...data });
    } catch (error) {
      console.error(`Error scraping ${website.name}: ${error.message}`);
    }
  }

  await browser.close();
  return results;
}

module.exports = scrapeProduct;