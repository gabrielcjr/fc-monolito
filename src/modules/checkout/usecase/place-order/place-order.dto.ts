export interface PlaceOrderInputDto {
    clientId: string;
    products: {
        id: string;
    }[];
}

export interface PlaceOrderOutputDto {
    id: string;
    invoiceId: string;
    status: string;
    total: number;
    products: {
        id: string;
    }[];
}