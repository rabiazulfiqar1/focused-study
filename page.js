function updateTime() {
    let now = new Date();
    const time12hr = now.toLocaleTimeString(
        'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }
    );
    document.getElementById('time').textContent = time12hr;
    // document.getElementById('time').innerHTML = `<strong>${time12hr}</strong>`;
};

async function quoteOfDay() {
    try {
        const { quote: storedQuote, fetchedAt } = JSON.parse(localStorage.getItem('quoteProfile')) || {};
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000; //milliseconds in one day

        // Reuse cached quote for 24 hours to avoid unnecessary API calls.
        if (storedQuote && fetchedAt && (now - fetchedAt) < oneDayMs) {
            document.getElementById('quote').textContent = storedQuote;
            return;
        }

        const response = await fetch('/api/quote');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        document.getElementById('quote').textContent = data.quote;
        localStorage.setItem('quoteProfile', JSON.stringify({
            quote: data.quote,
            fetchedAt: now
        }));

    } catch (error) {
        console.error('Quote fetch failed:', error);
        document.getElementById('quote').textContent = 'Quote unavailable right now.';
    }
}

setInterval(updateTime, 1000); //update time every second
updateTime(); // Initial call to display time immediately
quoteOfDay(); // Initial call to display quote immediately
