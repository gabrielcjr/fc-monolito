import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindAllProductsUsecase from "./find-all-products.usecase";

const product = new Product({
    id: new Id('1'),
    name: 'Product 1',
    description: 'Product 1 description',
    salesPrice: 10

});

const product2 = new Product({
    id: new Id('2'),
    name: 'Product 2',
    description: 'Product 2 description',
    salesPrice: 20

});

const MockRepository = () => {
    return {
      find: jest.fn(),
      findAll: jest.fn().mockReturnValue(Promise.resolve([product, product2])),
    };
  };

describe("find all products use case", () => {
    it("should return all products", async () => {
        const productRepository = MockRepository();
        const usecase = new FindAllProductsUsecase(productRepository);
        const result = await usecase.execute();
        
        expect(productRepository.findAll).toHaveBeenCalled();
        expect(result.products.length).toBe(2);
        expect(result.products[0].id).toEqual('1');
        expect(result.products[0].name).toEqual('Product 1');
        expect(result.products[0].description).toEqual('Product 1 description');
        expect(result.products[0].salesPrice).toEqual(10);
        expect(result.products[1].id).toEqual('2');
        expect(result.products[1].name).toEqual('Product 2');
        expect(result.products[1].description).toEqual('Product 2 description');
        expect(result.products[1].salesPrice).toEqual(20);
    })
})
