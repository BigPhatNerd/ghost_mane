const fetch = require("node-fetch");

async function getTweetsAndReply() {
    const url = 'https://ghost-mane.org/api/search_tweets';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

getTweetsAndReply();