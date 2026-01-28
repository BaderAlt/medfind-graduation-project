document.addEventListener('DOMContentLoaded', function() {
    const openFdaApiKey = '0DsLr6fhEfoVwfRbXl27hxBDtUNjIcDLfv0mReUx';
    const googleApiKey = 'AIzaSyBXcMp5Tm-iEQd53bJBtza4cVRV6BIIrhs';
    const searchEngineId = '709e738d5f43a4aa1';
    const searchButton = document.querySelector('.Medicine-info-search-button');
    const resultContainer = document.getElementById('Result-Search-Medicines-info');

    searchButton.addEventListener('click', function() {
        const medicineNameInput = document.querySelector('.Medicine-Name-input').value.trim();
        if (medicineNameInput) {
            // Clear previous results and add loading message
            resultContainer.innerHTML = '<p id="loadingMessage">Loading...</p>';
            fetchMedicineImage(medicineNameInput + " pill shape"); // Fetch image with "pill shape" appended
            fetchMedicineInfo(medicineNameInput);  // Fetch info as entered
        } else {
            alert('Please enter a medicine name.');
        }
    });

    async function fetchMedicineInfo(medicineName) {
        const url = `https://api.fda.gov/drug/label.json?api_key=${openFdaApiKey}&search=openfda.brand_name:${medicineName}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            displayMedicineInfo(data);
        } catch (error) {
            appendError(`Error fetching data: ${error.message}`);
        }
    }

    async function fetchMedicineImage(medicineNameWithShape) {
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(medicineNameWithShape)}&cx=${searchEngineId}&searchType=image&key=${googleApiKey}&num=1`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            displayMedicineImage(data);
        } catch (error) {
            appendError(`Error fetching image: ${error.message}`);
        }
    }

    function displayMedicineInfo(data) {
        if (data.results && data.results.length > 0) {
            const medicineInfo = data.results[0];
            const formattedInfo = formatMedicineInfo(medicineInfo);

            // Append information to the container below the image
            resultContainer.innerHTML += `<div>${formattedInfo}</div>`;
        } else {
            resultContainer.innerHTML += '<p>No information found for the specified medicine.</p>';
        }
    }

    function displayMedicineImage(data) {
        // Clear the loading message
        clearLoading();

        if (data.items && data.items.length > 0) {
            const imageUrl = data.items[0].link;
            const imageElement = `<img src="${imageUrl}" alt="Medicine Image" style="max-width: 100%; height: auto; margin-top: 10px;">`;

            // Prepend image to the container
            resultContainer.innerHTML = `<div>${imageElement}</div>` + resultContainer.innerHTML;
        } else {
            resultContainer.innerHTML += '<p>No image found for the specified medicine.</p>';
        }
    }

    function formatMedicineInfo(medicineInfo) {
        const unwantedTags = ['drug_interactions']; // Tags to exclude
        let formattedInfo = '';

        for (const [key, value] of Object.entries(medicineInfo)) {
            if (!unwantedTags.includes(key)) { // Exclude unwanted tags
                if (typeof value === 'object') {
                    formattedInfo += `<div class="tag"><strong>${key}:</strong> ${formatNestedInfo(value)}</div>`;
                } else {
                    formattedInfo += `<div class="tag"><strong>${key}:</strong> ${value}</div>`;
                }
            }
        }

        return formattedInfo;
    }

    function formatNestedInfo(nestedInfo) {
        let nestedContent = '';

        if (Array.isArray(nestedInfo)) {
            nestedInfo.forEach(item => {
                if (typeof item === 'object') {
                    nestedContent += `<div>${formatNestedInfo(item)}</div>`;
                } else {
                    nestedContent += `<div>${item}</div>`;
                }
            });
        } else {
            for (const [key, value] of Object.entries(nestedInfo)) {
                if (typeof value === 'object') {
                    nestedContent += `<div class="tag"><strong>${key}:</strong> ${formatNestedInfo(value)}</div>`;
                } else {
                    nestedContent += `<div class="tag"><strong>${key}:</strong> ${value}</div>`;
                }
            }
        }

        return nestedContent;
    }

    function clearLoading() {
        // Remove the loading message if present
        const loadingElement = document.getElementById('loadingMessage');
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    function appendError(message) {
        clearLoading();
        resultContainer.innerHTML += `<p>${message}</p>`;
    }
});
