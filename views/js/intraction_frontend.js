document.getElementById('interactionForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const drugs = document.getElementById('drugs').value;

    try {
        const response = await fetch('/check-interactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `drugs=${encodeURIComponent(drugs)}`
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const interactions = await response.json();
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        if (interactions.length === 0) {
            resultsDiv.innerHTML = '<p>No interactions found.</p>';
        } else {
            interactions.forEach(interaction => {
                const interactionDiv = document.createElement('div');
                interactionDiv.className = 'interaction';
                interactionDiv.innerHTML = `
                    <h3>${interaction.subject} & ${interaction.affected}</h3>
                    <p><strong>Severity:</strong> ${interaction.severity}</p>
                    <p>${interaction.description}</p>
                `;
                resultsDiv.appendChild(interactionDiv);
            });
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('results').innerHTML = '<p>An error occurred while fetching interactions.</p>';
    }
});