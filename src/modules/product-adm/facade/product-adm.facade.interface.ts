export interface AddProductFacadeInputDto {
    id?: string;
    name: string;
    description: string;
    purchasePrice: number;
    stock: number;
}

export interface CheckStockFacadeInputDto {
    productId: string;
}

export interface CheckStockFacadeOutputDto {
    productId: string;
    stock: number;
}

export default interface ProductAdmFacadeInterface {
    addProduct(product: AddProductFacadeInputDto): Promise<void>;
    checkStock(productId: CheckStockFacadeInputDto): Promise<CheckStockFacadeOutputDto>;
}