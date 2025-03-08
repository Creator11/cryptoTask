export interface NodeData {
    address: string;
    type: string;
    address_name: string;
    risk_score: number;
    creator: boolean;
    creator_addr: string;
    updated_at: string;
    created_at: string;
    tokens: any[];
    balance: number;
    networks: string[];
    not_open: boolean;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
}

export interface LinkData {
    source: string | NodeData;
    target: string | NodeData;
    label: string;
}

export interface GraphData {
    nodes: NodeData[];
    links: LinkData[];
}

export const initialData: GraphData = {
    nodes: [
        {
            address: "0x75e89d5979e4f6fba9f97c104c2f0afb3f1dcb88",
            type: "cex",
            address_name: "MEXC",
            risk_score: 0.0,
            creator: false,
            creator_addr: "",
            updated_at: "1970-01-01 00:00:00",
            created_at: "1970-01-01 00:00:00",
            tokens: [],
            balance: 0.0,
            networks: ["Ethereum"],
            not_open: true
        },
        {
            address: "0x889edc2edab5f40e902b864ad4d7ade8e412f9b1",
            type: "stakingpool",
            address_name: "Lido: stETH Withdrawal NFT (unstETH)",
            risk_score: 0.0,
            creator: false,
            creator_addr: "",
            updated_at: "1970-01-01 00:00:00",
            created_at: "1970-01-01 00:00:00",
            tokens: [],
            balance: 0.0,
            networks: ["Ethereum"],
            not_open: true
        }
    ],
    links: [
        {
            source: "0x75e89d5979e4f6fba9f97c104c2f0afb3f1dcb88",
            target: "0x889edc2edab5f40e902b864ad4d7ade8e412f9b1",
            label: "Link 1"
        }
    ]
};

export const stepData2: GraphData = {
    nodes: [
        {
            address: "0x6a2b402b710c746de3fc064090ca1eab109a0e31",
            type: "unmarked",
            address_name: "",
            risk_score: 0.0,
            creator: false,
            creator_addr: "",
            updated_at: "1970-01-01 00:00:00",
            created_at: "1970-01-01 00:00:00",
            tokens: [],
            balance: 0.0,
            networks: ["Ethereum"],
            not_open: false
        },
        {
            address: "0x974caa59e49682cda0ad2bbe82983419a2ecc400",
            type: "gambling",
            address_name: "Stake.com",
            risk_score: 0.0,
            creator: false,
            creator_addr: "",
            updated_at: "1970-01-01 00:00:00",
            created_at: "1970-01-01 00:00:00",
            tokens: [],
            balance: 0.0,
            networks: ["Ethereum"],
            not_open: false
        }
    ],
    links: []
};

export const stepData3: GraphData = {
    nodes: [
        {
            address: "0x31e91a09611e1d647b992d72181aa97f32e5bb58",
            type: "smartcontract",
            address_name: "ERC1967Proxy",
            risk_score: 0.0,
            creator: false,
            creator_addr: "",
            updated_at: "1970-01-01 00:00:00",
            created_at: "1970-01-01 00:00:00",
            tokens: [],
            balance: 0.0,
            networks: ["Ethereum"],
            not_open: true
        },
        {
            address: "0x75e89d5979e4f6fba9f97c104c2f0afb3f1dcb88",
            type: "cex",
            address_name: "MEXC",
            risk_score: 0.0,
            creator: false,
            creator_addr: "",
            updated_at: "1970-01-01 00:00:00",
            created_at: "1970-01-01 00:00:00",
            tokens: [],
            balance: 0.0,
            networks: ["Ethereum"],
            not_open: true
        }
    ],
    links: []
};