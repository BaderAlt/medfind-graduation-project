const express = require('express');
const axios = require('axios');
const scrapeProduct = require('../scraper');
const router = express.Router();

const GOOGLE_MAPS_API_KEY = 'AIzaSyAagSOpexoL3sVwuHN2T82enFijiMMIoNo';
// const openFdaInfo_API_KEY = 'zbLtrNOEjRy0PGfhTlK5ukGLId5qgHUquMMMmYKq'; 


router.get('/pharmacies', async (req, res) => {
  const { lat, lng } = req.query;

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        radius: 5000,
        type: 'pharmacy',
        key: GOOGLE_MAPS_API_KEY
      }
    });
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from Google Maps API' });
  }
});

router.get('/scrape', async (req, res) => {
  const productName = req.query.name;
  if (!productName) {
    return res.status(400).json({ error: 'Product name is required' });
  }

  try {
    const productDetails = await scrapeProduct(productName);
    res.json(productDetails);
  } catch (error) {
    console.error('Error scraping product:', error);
    res.status(500).json({ error: 'Error scraping product' });
  }
});


module.exports = router;