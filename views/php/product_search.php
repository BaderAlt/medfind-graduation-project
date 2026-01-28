<?php
if (isset($_POST['medicineName'])) {
    $medicineName = $_POST['medicineName'];
    $filter = $_POST['filter'];

    // Web scraping logic for Al Nahdi Pharmacy
    $nahdiProducts = scrapeNahdi($medicineName);

    // Web scraping logic for Al Dawaa Pharmacy
    $dawaaProducts = scrapeDawaa($medicineName);

    // Combine products from both pharmacies
    $allProducts = array_merge($nahdiProducts, $dawaaProducts);

    // Get user's location (for example, from a POST request or use a placeholder)
    $userLocation = 'USER_LATITUDE,USER_LONGITUDE'; // Replace with actual user's latitude and longitude

    // Calculate distances for each product
    calculateDistances($userLocation, $allProducts);

    // Sort products based on filter (price or distance)
    usort($allProducts, function($a, $b) use ($filter) {
        if ($filter == 'price') {
            return $a['price'] - $b['price'];
        } else {
            return $a['distance'] - $b['distance'];
        }
    });

    echo json_encode($allProducts);
}

function scrapeNahdi($medicineName) {
    $nahdiUrl = "https://www.nahdionline.com/en/search?q=" . urlencode($medicineName);
    $nahdiProducts = []; // Array to store product details

    // Use cURL to fetch the webpage content
    $html = file_get_contents($nahdiUrl);
    
    // Use DOMDocument to parse the HTML content
    $doc = new DOMDocument();
    @$doc->loadHTML($html);

    // Use DOMXPath to query the HTML for product details
    $xpath = new DOMXPath($doc);

    // Example of scraping logic:
    $productNodes = $xpath->query('//div[@class="product-item"]'); // Update this according to the actual HTML structure
    
    foreach ($productNodes as $node) {
        $name = $xpath->query('.//h2[@class="product-title"]', $node)->item(0)->nodeValue;
        $price = $xpath->query('.//span[@class="price"]', $node)->item(0)->nodeValue;
        $imageUrl = $xpath->query('.//img[@class="product-image"]', $node)->item(0)->getAttribute('src');

        $nahdiProducts[] = [
            'name' => trim($name),
            'price' => floatval(trim(str_replace(['$', 'SAR'], '', $price))),
            'imageUrl' => $imageUrl,
            'distance' => 0 // Placeholder for distance, will be calculated later
        ];
    }

    return $nahdiProducts;
}

function scrapeDawaa($medicineName) {
    $dawaaUrl = "https://www.al-dawaa.com/english/search?q=" . urlencode($medicineName);
    $dawaaProducts = []; // Array to store product details

    $html = file_get_contents($dawaaUrl);
    
    $doc = new DOMDocument();
    @$doc->loadHTML($html);

    $xpath = new DOMXPath($doc);

    $productNodes = $xpath->query('//div[@class="product-item"]'); 
    
    foreach ($productNodes as $node) {
        $name = $xpath->query('.//h2[@class="product-title"]', $node)->item(0)->nodeValue;
        $price = $xpath->query('.//span[@class="price"]', $node)->item(0)->nodeValue;
        $imageUrl = $xpath->query('.//img[@class="product-image"]', $node)->item(0)->getAttribute('src');

        $dawaaProducts[] = [
            'name' => trim($name),
            'price' => floatval(trim(str_replace(['$', 'SAR'], '', $price))),
            'imageUrl' => $imageUrl,
            'distance' => 0 // Placeholder for distance, will be calculated later
        ];
    }

    return $dawaaProducts;
}

function calculateDistances($userLocation, &$products) {
    $apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';

    // Example of Google Maps Distance Matrix API call
    foreach ($products as &$product) {
        // Assuming each product has a pharmacy location (latitude, longitude)
        $pharmacyLocation = 'PHARMACY_LATITUDE,PHARMACY_LONGITUDE'; 

        $distanceMatrixUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins={$userLocation}&destinations={$pharmacyLocation}&key={$apiKey}";

        $response = file_get_contents($distanceMatrixUrl);
        $data = json_decode($response, true);

        $product['distance'] = $data['rows'][0]['elements'][0]['distance']['value'] / 1000; // Convert meters to kilometers
    }
}
?>
