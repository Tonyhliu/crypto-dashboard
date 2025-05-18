import { MarketChart } from "./cryptoApi";

const formatChartDataForAI = (chartData: MarketChart, cryptoName: string) => {
    if (!chartData?.prices?.length) {
        return `No price data available for ${cryptoName} at the moment.`;
    }

    const prices = chartData.prices;
    const latestPrice = prices[prices.length - 1][1];
    const oldestPrice = prices[0][1];
    const priceChange = ((latestPrice - oldestPrice) / oldestPrice) * 100;
    const highestPrice = Math.max(...prices.map(p => p[1]));
    const lowestPrice = Math.min(...prices.map(p => p[1]));

    return `
        Current ${cryptoName} Analysis:
        - Latest Price: $${latestPrice.toLocaleString()}
        - Price Change: ${priceChange.toFixed(2)}%
        - 7-day Range: $${lowestPrice.toLocaleString()} - $${highestPrice.toLocaleString()}
        - Data Points: ${prices.length} measurements over 7 days
    `;
};

export const aiService = {
    chat: async (message: string, chartData: MarketChart, cryptoName: string) => {
        if (!process.env.REACT_APP_GEMINI_API_KEY) {
            throw new Error('Gemini API key is not set');
        }

        try {
            const chartContext = formatChartDataForAI(chartData, cryptoName);

            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': process.env.REACT_APP_GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a cryptocurrency analysis assistant. Analyze this data and respond to the user's question.
                            
                            Market Data:
                            ${chartContext}
                            
                            User question: ${message}
                            
                            Please provide a concise and focused response based on the data provided.`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 150,
                    },
                }),
            });

            const data = await response.json();

            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Invalid response format from Gemini API');
            }
        } catch (error) {
            console.error('Chat error:', error);
            throw error;
        }
    }
};

export type Message = {
    role: 'user' | 'assistant';
    content: string;
};