// Try to gather data from other websites to enhance outcomes for patients and healthcare providers.

const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const router = express.Router();

// Use body-parser middleware to parse URL-encoded request bodies
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/check-interactions', async (req, res) => {
    const { drugs } = req.body; // Expecting a comma-separated string
    const drugList = drugs.split(',').map(drug => drug.trim());

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://go.drugbank.com/drug-interaction-checker', { waitUntil: 'networkidle2' }); // Adjust to actual URL

    // Fill the search input with drug names one by one
    for (const drug of drugList) {
        await page.type('.select2-search__field', drug , {delay: 100});
        await page.keyboard.press('Enter'); // Simulate pressing Enter after each drug is typed

        // Wait for the dropdown options to appear and select the first one
        try {
            await page.waitForSelector('.select2-results__option--highlighted', { visible: true, timeout: 60000 });
            await page.keyboard.press('Enter'); // Select the highlighted option
        } catch (error) {
            console.error(`Error selecting drug: ${drug}`, error);
            res.status(500).json({ error: `Error selecting drug: ${drug}` });
            await browser.close();
            return;
        }

        // Wait for a short period to ensure the drug is processed
       
    }

    // Click the search button after all drugs are entered
    await page.click('#search');

    // Wait for results to load
    await page.waitForSelector('.results', { timeout: 120000 });

    // Extract interaction data
    const interactions = await page.evaluate(() => {
        const results = [];
        const rows = document.querySelectorAll('.interactions-row.main-row');
        rows.forEach(row => {
            const subject = row.querySelector('.subject h5').innerText;
            const affected = row.querySelector('.affected h5').innerText;
            const severity = row.querySelector('.severity-badge').innerText;
            const description = row.querySelector('.description p').innerText;
            results.push({ subject, affected, severity, description });
        });
        return results;
    });

    
    res.json(interactions);
});

module.exports = router;