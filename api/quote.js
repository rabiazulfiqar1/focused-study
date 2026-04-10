const express = require('express');
const app = express();

app.get('/quote', async (req, res) => {
    try {
        const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=motivational', {
            headers: {
                'X-Api-Key': process.env.QUOTE_API_KEY
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: `Upstream error: ${response.status}` });
        }

        const data = await response.json();
        const quote = data?.[0]?.quote;

        if (!quote) {
            return res.status(502).json({ error: 'Invalid quote response' });
        }

        return res.status(200).json({ quote });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch quote' });
    }
});