document.getElementById('searchForm').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const query = form.querySelector('input[name="name"]').value;

    try {
        // Fetch product data
        const response = await fetch(`API/scrape?name=${encodeURIComponent(query)}`);
        const results = await response.json();

        if (results.length === 0) {
            document.getElementById('results').innerText = 'No results found.';
            return;
        }

        // Fetch user location and display results
        getLocation(results);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('results').innerText = 'Error fetching data. Please try again.';
    }
};

async function getLocation(products) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => showResults(position, products));
    } else {
        alert("Geolocation is not supported by this browser.");
        showResults(null, products);
    }
}

async function showResults(position, products) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    // Create product name display
    const productNameDiv = document.createElement('div');
    productNameDiv.className = 'product-name';
    productNameDiv.innerText = `Product Name: ${products[0].title}`;
    resultsDiv.appendChild(productNameDiv);

    const userLocationDiv = document.createElement('div');
    userLocationDiv.className = 'user-location';
    userLocationDiv.innerText = 'User Current Location:';
    resultsDiv.appendChild(userLocationDiv);

    // Create array to hold pharmacy information with distances
    const pharmacyDistanceArray = [];

    for (const product of products) {
        let distanceText = 'Distance: Not available';
        let distance = null;

        if (position) {
            try {
                distance = await getPharmacyDistance(position, product.website);
                distanceText = `Distance: ${distance.toFixed(2)} KM`;
            } catch (error) {
                console.error('Error fetching distance:', error);
            }
        }

        pharmacyDistanceArray.push({
            website: product.website,
            price: product.price,
            imageUrl: product.imageUrl,
            distance: distance,
            distanceText: distanceText
        });
    }

    // Sort pharmacies by distance
    pharmacyDistanceArray.sort((a, b) => {
        return (a.distance || Infinity) - (b.distance || Infinity);
    });

    // Create pharmacy list
    const pharmacyListDiv = document.createElement('div');
    pharmacyListDiv.className = 'pharmacy-list';

    for (const pharmacy of pharmacyDistanceArray) {
        const pharmacyDiv = document.createElement('div');
        pharmacyDiv.className = 'pharmacy-item';

        const nameAndLocationSpan = document.createElement('span');
        nameAndLocationSpan.innerText = pharmacy.website;

        const priceAndDistanceSpan = document.createElement('span');
        priceAndDistanceSpan.innerText = `Price: ${pharmacy.price}\n${pharmacy.distanceText}`;

        // Create and append image
        if (pharmacy.imageUrl) {
            const productImage = document.createElement('img');
            productImage.src = pharmacy.imageUrl;
            productImage.alt = pharmacy.website;
            productImage.style.width = '100px'; 
            pharmacyDiv.appendChild(productImage);
        }

        pharmacyDiv.appendChild(nameAndLocationSpan);
        pharmacyDiv.appendChild(priceAndDistanceSpan);

        pharmacyListDiv.appendChild(pharmacyDiv);
    }

    resultsDiv.appendChild(pharmacyListDiv);
}

async function getPharmacyDistance(position, pharmacyName) {
    const { latitude, longitude } = position.coords;
    const response = await fetch(`/api/pharmacies?lat=${latitude}&lng=${longitude}`);
    const pharmacies = await response.json();

    const pharmacy = pharmacies.find(p => p.name.includes(pharmacyName));
    if (!pharmacy || !pharmacy.geometry || !pharmacy.geometry.location) {
        throw new Error('Pharmacy not found');
    }

    return calculateDistance(latitude, longitude, pharmacy.geometry.location.lat, pharmacy.geometry.location.lng);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}