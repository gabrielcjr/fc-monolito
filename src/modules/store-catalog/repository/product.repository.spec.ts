import { Sequelize } from "sequelize-typescript";
import ProductModel from "./product.model";

describe("Product repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    })

    afterEach(async () => {
        await sequelize.close();
    })

    it("Should find all products", async () => {

        await ProductModel.create({
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
        })

        await ProductModel.create({
            id: "2",
            name: "Product 2",
            description: "Product 2 description",
            purchasePrice: 200,
        })

        const productRepository = new ProductRepository();

        const products = await productRepository.findAll();

        expect(products.length).toBe(2);
        expect(products[0].id).toEqual("1");
        expect(products[0].name).toEqual("Product 1");
        expect(products[0].description).toEqual("Product 1 description");
        expect(products[0].purchasePrice).toEqual(100);
        expect(products[1].id).toEqual("2");
        expect(products[1].name).toEqual("Product 2");
        expect(products[1].description).toEqual("Product 2 description");
        expect(products[1].purchasePrice).toEqual(200);
        
    })
})