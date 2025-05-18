const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export interface CryptoPrice {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
}

export interface MarketChart {
    prices: [number, number][];  // [timestamp, price]
    market_caps: [number, number][];
    total_volumes: [number, number][];
}

export const cryptoApi = {
    getTopCryptos: async (limit: number = 10): Promise<CryptoPrice[]> => {
        const response = await fetch(`${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-cg-demo-api-key': process.env.REACT_APP_COINGECKO_API_KEY || ''
            },
        });

        return await response.json();
    },

    // Get historical chart data for a specific crypto
    getMarketChart: async (coinId: string, days: number = 7): Promise<MarketChart> => {
        const response = await fetch(
            `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-cg-demo-api-key': process.env.REACT_APP_COINGECKO_API_KEY || ''
                },
            }
        );
        
        return await response.json();
    }
}; 