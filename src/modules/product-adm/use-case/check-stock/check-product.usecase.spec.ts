import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import AddProductUseCase from "../add-product/add-product.usecase";
import CheckStockUseCase from "./check-product.usecase";

const product = new Product({
    id: new Id("1"),
    name: "Product",
    description: "Product description",
    purchasePrice: 100,
    stock: 10,
  });

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
    }
}

describe("Check Stock usecase unit test", () => {

    it("should get stock of product", async () => {
        
        const ProductRepository = MockRepository();
        const checkStockUsecase = new CheckStockUseCase(ProductRepository);
        const input = {
            productId: "1",
        }

        const result = await checkStockUsecase.execute(input);

        expect(ProductRepository.find).toBeCalled();
        expect(result.productId).toBe("1")
        expect(result.stock).toBe(10)
    })

})