export interface CategoryData {
    name: string;
    value: number;
    children: CryptoCategory[];
}

export interface CryptoCategory {
    id: string;
    name: string;
    market_cap: number;
    market_cap_change_24h: number;
    top_3_coins: string[];
}