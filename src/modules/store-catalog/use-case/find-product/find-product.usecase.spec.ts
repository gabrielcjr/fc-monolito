import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindProductUseCase from "./find-product.usecase";

const product = new Product({
    id: new Id("1"),
    name: "Product 1",
    description: "Product 1 description",
    salesPrice: 100,
})

const MockRepository = () => {
    return {
        findAll: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
    }}


describe("Find product use case test", () => {
    it("Should find a product", async () => {
        const productRepository = MockRepository();
        const findProductUseCase = new FindProductUseCase(productRepository);

        const input = {
            id: "1",
        }
        const product = await findProductUseCase.execute(input);

        expect(productRepository.find).toHaveBeenCalled()
        expect(product.id).toEqual("1");
        expect(product.name).toEqual("Product 1");
        expect(product.description).toEqual("Product 1 description");
        expect(product.salesPrice).toEqual(100);
    })
})