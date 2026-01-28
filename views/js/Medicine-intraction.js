document.addEventListener('DOMContentLoaded', function() {
    const openFdaApiKey = '0DsLr6fhEfoVwfRbXl27hxBDtUNjIcDLfv0mReUx';
    const searchButton = document.querySelector('.Medicine-info-search-button');
    const generalResultContainer = document.getElementById('Result-Search-Medicines-info-general');
    const professionalResultContainer = document.getElementById('Result-Search-Medicines-info-Professional');

    searchButton.addEventListener('click', function() {
        const medicineNameInput = document.querySelector('.Medicine-Name-input').value.trim();
        if (medicineNameInput) {
            // Clear previous results and add loading message
            clearResults();
            generalResultContainer.innerHTML = '<p id="loadingMessage">Loading...</p>';
            professionalResultContainer.innerHTML = '<p id="loadingMessage">Loading...</p>';

            fetchMedicineInteractions(medicineNameInput);
        } else {
            alert('Please enter a medicine name.');
        }
    });

    async function fetchMedicineInteractions(medicineName) {
        const url = `https://api.fda.gov/drug/label.json?api_key=${openFdaApiKey}&search=openfda.brand_name:${medicineName}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            displayMedicineInteractions(data, medicineName);
        } catch (error) {
            appendError(`Error fetching data: ${error.message}`);
        }
    }

    function displayMedicineInteractions(data, medicineName) {
        // Clear the loading message
        clearLoading();

        let generalInteractionContent = '';
        let professionalInteractionContent = '';

        // Mapping medicine names to their general interaction content
        const medicineInteractions = {
            'prozac': `<strong>Prozac (Fluoxetine)</strong>: Interactions: Warfarin, Tramadol, MAO inhibitors, NSAIDs, other SSRIs, Benzodiazepines, Lithium.`,
            'dapagliflozin': `<strong>Dapagliflozin</strong>: Interactions: Diuretics, Insulin, other antidiabetic medications, Rifampin, Phenytoin, Carbamazepine.`,
            'atomoxetine': `<strong>Atomoxetine</strong>: Interactions: MAO inhibitors, Albuterol, Beta-blockers, Antihypertensives, SSRI antidepressants, Quinidine.`,
            'azathioprine': `<strong>Azathioprine</strong>: Interactions: Allopurinol, Warfarin, ACE inhibitors, Trimethoprim, Sulfamethoxazole, Live vaccines.`,
            'lumakras': `<strong>Lumakras (Sotorasib)</strong>: Interactions: Proton pump inhibitors, H2 receptor antagonists, Antacids, Rifampin, St. John's Wort.`,
            'prevymis': `<strong>Prevymis (Letermovir)</strong>: Interactions: Cyclosporine, Tacrolimus, Sirolimus, Warfarin, Rifampin, Atorvastatin.`,
            'recorlev': `<strong>Recorlev (Levoketoconazole)</strong>: Interactions: Anticoagulants, Antiplatelet agents, CYP3A4 substrates, P-gp substrates, Statins.`,
            'nayzilam': `<strong>Nayzilam (Midazolam)</strong>: Interactions: Opioids, Alcohol, Other CNS depressants, Antifungals, Antiretroviral drugs, Benzodiazepines.`,
            'cymbalta': `<strong>Cymbalta (Duloxetine)</strong>: Interactions: MAO inhibitors, Tramadol, SSRIs, SNRIs, NSAIDs, Anticoagulants, Lithium.`,
            'simponi': `<strong>Simponi (Golimumab)</strong>: Interactions: Anakinra, Abatacept, Live vaccines, Immunosuppressants, Methotrexate.`,
            'tirosint': `<strong>Tirosint (Levothyroxine)</strong>: Interactions: Antacids, Calcium supplements, Iron supplements, Warfarin, Antidiabetic medications, Estrogen.`,
            'wakix': `<strong>Wakix (Pitolisant)</strong>: Interactions: Antihistamines, Antidepressants, CYP2D6 inhibitors, Antipsychotics, Beta-blockers.`,
            'truvada': `<strong>Truvada (Emtricitabine/Tenofovir)</strong>: Interactions: Adefovir, Lamivudine, Atazanavir, Ledipasvir, Darunavir, Sofosbuvir.`,
            'trudhesa': `<strong>Trudhesa (Dihydroergotamine mesylate)</strong>: Interactions: CYP3A4 inhibitors, Macrolide antibiotics, Protease inhibitors, SSRIs, Triptans, Beta-blockers.`,
            'viberzi': `<strong>Viberzi (Eluxadoline)</strong>: Interactions: Alosetron, Anticholinergic drugs, Cyclosporine, Rosuvastatin, Rifampin, Warfarin.`,
            'wixela': `<strong>Wixela (Fluticasone/Salmeterol)</strong>: Interactions: Beta-blockers, Diuretics, MAO inhibitors, Tricyclic antidepressants, Antifungals, Antiretrovirals.`,
            'trintellix': `<strong>Trintellix (Vortioxetine)</strong>: Interactions: MAO inhibitors, SSRIs, SNRIs, Tramadol, NSAIDs, Anticoagulants, Lithium.`,
            'serostim': `<strong>Serostim (Somatropin)</strong>: Interactions: Corticosteroids, Insulin, Oral hypoglycemics, Estrogen, Cyclosporine, Anabolic steroids.`,
            'koselugo': `<strong>Koselugo (Selumetinib)</strong>: Interactions: Anticoagulants, CYP3A4 inhibitors, St. John's Wort, Rifampin, Grapefruit juice.`,
            'humira': `<strong>Humira (Adalimumab)</strong>: Interactions: Anakinra, Abatacept, Live vaccines, Methotrexate, Immunosuppressants.`
        };

        // Convert medicineName to lowercase and check if it exists in the interactions map
        const lowerCaseMedicineName = medicineName.toLowerCase();
        if (medicineInteractions[lowerCaseMedicineName]) {
            generalInteractionContent = `
                <div>
                    <h2>General Interaction:</h2>
                    <p>${medicineInteractions[lowerCaseMedicineName]}</p>
                    <p style="color: red;">It's essential to consult a healthcare provider before starting or stopping any medications to avoid potentially serious interactions.</p>
                </div>
            `;
        } else {
            generalResultContainer.innerHTML = '<p>No general interaction information found for the specified medicine.</p>';
        }

        if (data.results && data.results.length > 0) {
            const medicineInfo = data.results[0];
            const drugInteractions = medicineInfo.drug_interactions;

            // Get the subscription status from the cookie
            const isSubscribed = document.cookie.includes('isSubscribed=true');

            if (drugInteractions && isSubscribed) {
                // Display Professional Interaction data if the user is subscribed
                professionalInteractionContent = `
                    <div>
                        <h2>Professional Interaction:</h2>
                        <div>${formatNestedInfo(drugInteractions)}</div>
                    </div>
                `;
            } else if (!isSubscribed) {
                // Display the login and subscribe message if the user is not subscribed
                professionalInteractionContent = `
                    <div class="subscription-prompt">
                        <p style="color: red;">For Professional Interaction, please <a href="http://localhost:344/PROJECT-GRADUATION-2/views/Login.ejs">login</a> or create an account and subscribe.</p>
                    </div>
                `;
            } else {
                professionalInteractionContent = '<p>No drug interactions information found for the specified medicine.</p>';
            }
        } else {
            if (!generalInteractionContent) {
                generalResultContainer.innerHTML = '<p>No information found for the specified medicine.</p>';
                return;
            }
        }

        // Display both sections
        generalResultContainer.innerHTML = generalInteractionContent;
        professionalResultContainer.innerHTML = professionalInteractionContent;
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
            for (const value of Object.values(nestedInfo)) {
                if (typeof value === 'object') {
                    nestedContent += `<div>${formatNestedInfo(value)}</div>`;
                } else {
                    nestedContent += `<div>${value}</div>`;
                }
            }
        }

        return nestedContent;
    }

    function clearLoading() {
        // Remove the loading message if present
        const loadingElements = document.querySelectorAll('#loadingMessage');
        loadingElements.forEach(element => element.remove());
    }

    function clearResults() {
        // Clear previous results
        generalResultContainer.innerHTML = '';
        professionalResultContainer.innerHTML = '';
    }

    function appendError(message) {
        clearLoading();
        generalResultContainer.innerHTML += `<p>${message}</p>`;
    }
});
