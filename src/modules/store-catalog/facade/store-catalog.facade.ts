import FindAllProductsUsecase from "../use-case/find-all-products/find-all-products.usecase";
import FindProductUseCase from "../use-case/find-product/find-product.usecase";
import { FindAllStoreCatalogFacadeOutputDto, FindStoreCatalogFacadeInputDto, FindStoreCatalogFacadeOutputDto } from "./store-catalog.facade.interface";

export interface UseCaseProps {
    findUseCase: FindProductUseCase;
    findAllUseCase: FindAllProductsUsecase;
}

export default class StoreCatalogFacade implements StoreCatalogFacade {
    private _findUseCase: FindProductUseCase;
    private _findAllUseCase: FindAllProductsUsecase;

    constructor(props: UseCaseProps) {
        this._findUseCase = props.findUseCase;
        this._findAllUseCase = props.findAllUseCase;
    }

    async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
        return await this._findAllUseCase.execute();
    }

    async find(id: FindStoreCatalogFacadeInputDto): Promise<FindStoreCatalogFacadeOutputDto> {
        return await this._findUseCase.execute(id);
        
    }
}
