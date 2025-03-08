import {CategoryData} from "../types.ts";

export async function fetchCryptoData(): Promise<CategoryData | null> {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/categories', {
            headers: {
                'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`);
        }

        const data = await response.json();
        const limitedData = data.slice(0, 50);

        return {
            name: "Cryptocurrencies",
            value: limitedData.reduce((acc: number, category: any) => acc + category.market_cap, 0),
            children: limitedData.map((category: any) => ({
                id: category.id,
                name: category.name,
                market_cap: category.market_cap,
                market_cap_change_24h: category.market_cap_change_24h,
                top_3_coins: category.top_3_coins || [],
                volume_24h: category.volume_24h,
                updated_at: category.updated_at
            }))
        };
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        return null;
    }
}