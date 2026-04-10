module.exports = async (req, res) => {
    const apiVersion = 'quote-api-v2-cjs-2026-04-10';
    const upstreamUrl = 'https://api.api-ninjas.com/v2/randomquotes?categories=success,wisdom';

    const apiKey = process.env.QUOTE_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Missing QUOTE_API_KEY', apiVersion, upstreamUrl });
    }

    try {
        const response = await fetch(upstreamUrl, {
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (!response.ok) {
            const details = await response.text();
            return res.status(response.status).json({ error: `Upstream error: ${response.status}`, details, apiVersion, upstreamUrl });
        }

        const data = await response.json();
        const quote = data?.[0]?.quote;

        if (!quote) {
            return res.status(502).json({ error: 'Invalid quote response' });
        }

        return res.status(200).json({ quote, apiVersion });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch quote', apiVersion, upstreamUrl });
    }
}

