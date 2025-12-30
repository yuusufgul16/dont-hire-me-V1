// Netlify Serverless Function - API Key'i gizler
exports.handler = async (event, context) => {
    // Sadece POST isteklerini kabul et
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { message, systemPrompt } = JSON.parse(event.body);

        // API key environment variable'dan gelir (Netlify dashboard'da ayarlayacağız)
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

        // Gemini API'ye istek at
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemPrompt}\n\nKullanıcı Sorusu: ${message}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1500,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // Veya sadece kendi domain'in
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error', details: error.message })
        };
    }
};
